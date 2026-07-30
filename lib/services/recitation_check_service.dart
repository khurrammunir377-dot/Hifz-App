import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'dart:typed_data';
import 'package:http/http.dart' as http;
import 'package:path_provider/path_provider.dart';
import 'package:record/record.dart';
import 'alignment/alignment_engine.dart';
import 'alignment/alignment_models.dart';
import 'alignment/scoring_engine.dart';
import 'alignment/teacher_response_engine.dart';
import 'db_helper.dart';
import 'wav_utils.dart';
import 'word_matcher.dart' show tokenize;
import '../models/quran_models.dart';

const int kSampleRate = 16000;
const int kNumChannels = 1;
// ~2.5 seconds per chunk: short enough to feel responsive, long enough for
// the speech model to have meaningful context. Tune this if latency numbers
// from real testing suggest a different sweet spot.
const int _chunkDurationMs = 2500;
const int _bytesPerChunk = (kSampleRate * kNumChannels * 2 * _chunkDurationMs) ~/ 1000;

enum ChunkStatus { sending, ok, networkError }

class LiveCheckUpdate {
  final AlignmentResult alignmentResult;
  final ChunkStatus lastChunkStatus;
  final int lastLatencyMs;
  final bool newMistakeDetectedThisUpdate;
  final RecitationError? latestError;
  final String teacherFeedback;

  LiveCheckUpdate({
    required this.alignmentResult,
    required this.lastChunkStatus,
    required this.lastLatencyMs,
    required this.newMistakeDetectedThisUpdate,
    required this.latestError,
    required this.teacherFeedback,
  });
}

class SessionResult {
  final String filePath;
  final AlignmentResult alignmentResult;
  final ScoreReport score;
  final String teacherFeedback;

  SessionResult({
    required this.filePath,
    required this.alignmentResult,
    required this.score,
    required this.teacherFeedback,
  });
}

/// Handles continuous listening during recitation: streams raw audio from the
/// microphone, slices it into rolling chunks, sends each chunk to the
/// recognition backend as it's captured, and runs the Phase 3 alignment
/// engine incrementally as transcripts come back - while also saving the
/// full session audio locally so playback keeps working exactly as before.
class RecitationCheckService {
  final AudioRecorder _recorder = AudioRecorder();
  final AlignmentEngine _engine = AlignmentEngine();
  final ScoringEngine _scoringEngine = ScoringEngine();
  final TeacherResponseEngine _teacherEngine = TeacherResponseEngine();
  StreamSubscription<Uint8List>? _subscription;
  final Stopwatch _sessionStopwatch = Stopwatch();

  final List<int> _pendingChunkBuffer = [];
  final List<int> _fullSessionBuffer = [];
  final List<TimedWord> _recognizedWords = [];

  String _endpointUrl = '';
  List<AyahInfo> _expectedAyahs = [];
  final Set<String> _loggedErrorIds = {}; // avoid double-logging the same error across updates

  final StreamController<LiveCheckUpdate> _updatesController =
      StreamController<LiveCheckUpdate>.broadcast();
  Stream<LiveCheckUpdate> get updates => _updatesController.stream;

  bool _isActive = false;
  bool get isActive => _isActive;

  Future<bool> hasPermission() => _recorder.hasPermission();

  Future<void> start({
    required String endpointUrl,
    required List<AyahInfo> expectedAyahs,
  }) async {
    _endpointUrl = endpointUrl;
    _expectedAyahs = expectedAyahs;
    _pendingChunkBuffer.clear();
    _fullSessionBuffer.clear();
    _recognizedWords.clear();
    _loggedErrorIds.clear();
    _isActive = true;
    _sessionStopwatch
      ..reset()
      ..start();

    final stream = await _recorder.startStream(
      const RecordConfig(
        encoder: AudioEncoder.pcm16bits,
        sampleRate: kSampleRate,
        numChannels: kNumChannels,
      ),
    );

    _subscription = stream.listen((chunk) {
      _pendingChunkBuffer.addAll(chunk);
      _fullSessionBuffer.addAll(chunk);
      if (_pendingChunkBuffer.length >= _bytesPerChunk) {
        final toSend = List<int>.from(_pendingChunkBuffer);
        _pendingChunkBuffer.clear();
        _sendChunk(toSend);
      }
    });
  }

  Future<void> _sendChunk(List<int> pcmBytes) async {
    if (_endpointUrl.isEmpty) return;
    final wav = pcm16ToWav(
      pcmBytes: pcmBytes,
      sampleRate: kSampleRate,
      numChannels: kNumChannels,
    );

    final stopwatch = Stopwatch()..start();
    try {
      final response = await http
          .post(
            Uri.parse(_endpointUrl),
            headers: {'Content-Type': 'audio/wav'},
            body: wav,
          )
          .timeout(const Duration(seconds: 10));
      stopwatch.stop();

      if (response.statusCode != 200) {
        _emitUpdate(ChunkStatus.networkError, stopwatch.elapsedMilliseconds);
        return;
      }

      final body = response.body;
      String transcript = '';
      try {
        final decoded = jsonDecode(body) as Map<String, dynamic>;
        transcript = (decoded['transcript'] as String?) ?? '';
      } catch (_) {
        // Malformed response - treat as an empty transcript for this chunk
        // rather than crashing the session.
      }

      final newWords = tokenize(transcript);
      final nowSeconds = _sessionStopwatch.elapsedMilliseconds / 1000.0;
      for (final w in newWords) {
        _recognizedWords.add(TimedWord(w, nowSeconds));
      }

      final previousResult = _currentResult();
      final updatedResult = _engine.comparePassage(
        expectedAyahs: _expectedAyahs,
        recognizedWords: _recognizedWords,
      );

      final newErrors = updatedResult.errors
          .where((e) => !_loggedErrorIds.contains('${e.ayahNumber}_${e.wordIndexInAyah}_${e.type.name}'))
          .toList();
      final hasNewMistake = newErrors.isNotEmpty &&
          (previousResult == null || updatedResult.errors.length > previousResult.errors.length);

      for (final e in newErrors) {
        _loggedErrorIds.add('${e.ayahNumber}_${e.wordIndexInAyah}_${e.type.name}');
      }

      final latestError = newErrors.isNotEmpty ? newErrors.last : null;
      final feedback = _teacherEngine.generateFeedback(
        result: updatedResult,
        mostRecentError: latestError,
      );

      _emitUpdate(
        ChunkStatus.ok,
        stopwatch.elapsedMilliseconds,
        newMistake: hasNewMistake,
        result: updatedResult,
        latestError: latestError,
        feedback: feedback,
      );
    } catch (_) {
      stopwatch.stop();
      _emitUpdate(ChunkStatus.networkError, stopwatch.elapsedMilliseconds);
    }
  }

  AlignmentResult? _currentResult() {
    if (_expectedAyahs.isEmpty) return null;
    return _engine.comparePassage(expectedAyahs: _expectedAyahs, recognizedWords: _recognizedWords);
  }

  void _emitUpdate(
    ChunkStatus status,
    int latencyMs, {
    bool newMistake = false,
    AlignmentResult? result,
    RecitationError? latestError,
    String feedback = 'Continue.',
  }) {
    final r = result ?? _currentResult();
    if (r == null || _updatesController.isClosed) return;
    _updatesController.add(LiveCheckUpdate(
      alignmentResult: r,
      lastChunkStatus: status,
      lastLatencyMs: latencyMs,
      newMistakeDetectedThisUpdate: newMistake,
      latestError: latestError,
      teacherFeedback: feedback,
    ));
  }

  /// Stops listening, flushes any leftover buffered audio as a final chunk,
  /// saves the full session as a local WAV file, logs mistakes/session to
  /// the database, and returns the complete session result.
  Future<SessionResult> stop() async {
    await _subscription?.cancel();
    await _recorder.stop();
    _sessionStopwatch.stop();
    _isActive = false;

    if (_pendingChunkBuffer.isNotEmpty) {
      await _sendChunk(List<int>.from(_pendingChunkBuffer));
      _pendingChunkBuffer.clear();
    }

    final dir = await getApplicationDocumentsDirectory();
    final recordingsDir = Directory('${dir.path}/recordings');
    if (!await recordingsDir.exists()) {
      await recordingsDir.create(recursive: true);
    }
    final timestamp = DateTime.now().millisecondsSinceEpoch;
    final path = '${recordingsDir.path}/session_$timestamp.wav';
    final wav = pcm16ToWav(
      pcmBytes: _fullSessionBuffer,
      sampleRate: kSampleRate,
      numChannels: kNumChannels,
    );
    await File(path).writeAsBytes(wav);

    var finalResult = _currentResult() ??
        _engine.comparePassage(expectedAyahs: _expectedAyahs, recognizedWords: const []);

    final stoppedEarly = _engine.detectStoppedTooEarly(
      expectedAyahs: _expectedAyahs,
      latestResult: finalResult,
    );
    final allErrors = [...finalResult.errors, if (stoppedEarly != null) stoppedEarly];
    finalResult = AlignmentResult(
      wordStatus: finalResult.wordStatus,
      recognizedForWord: finalResult.recognizedForWord,
      errors: allErrors,
      currentPosition: finalResult.currentPosition,
      correctCount: finalResult.correctCount,
      totalWords: finalResult.totalWords,
      passageComplete: finalResult.passageComplete,
    );

    final fullyCorrectAyahs = _expectedAyahs.isEmpty ? 0 : (finalResult.passageComplete ? _expectedAyahs.length : 0);
    final score = _scoringEngine.calculateScore(
      result: finalResult,
      totalAyahsInPassage: _expectedAyahs.length,
      fullyCorrectAyahs: fullyCorrectAyahs,
    );

    final feedback = _teacherEngine.generateFeedback(result: finalResult);

    // Persist to the Phase 3 memorization-intelligence tables.
    for (final error in finalResult.errors) {
      await DbHelper.instance.recordMistake(
        surah: error.surahNumber,
        ayah: error.ayahNumber,
        wordIndexInAyah: error.wordIndexInAyah,
        errorType: error.type.name,
        expectedWord: error.expectedWord,
        actualWord: error.actualWord,
        severity: error.severity.name,
      );
    }
    if (_expectedAyahs.isNotEmpty) {
      await DbHelper.instance.recordSession(
        surah: _expectedAyahs.first.surah,
        startAyah: _expectedAyahs.first.ayah,
        endAyah: _expectedAyahs.last.ayah,
        wordAccuracy: score.wordAccuracy,
        mistakeCount: score.mistakeCount,
        overallScore: score.overallScore,
      );
    }

    return SessionResult(
      filePath: path,
      alignmentResult: finalResult,
      score: score,
      teacherFeedback: feedback,
    );
  }

  Future<void> stopSafelyIfActive() async {
    if (_isActive) {
      await stop();
    }
  }

  void dispose() {
    _subscription?.cancel();
    _recorder.dispose();
    _updatesController.close();
  }
}
