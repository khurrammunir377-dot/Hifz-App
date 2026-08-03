import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'package:audioplayers/audioplayers.dart' as ap;
import 'package:flutter/services.dart' show rootBundle;
import 'package:http/http.dart' as http;
import 'package:path_provider/path_provider.dart';

class WordTiming {
  final int surah;
  final int ayah;
  final int wordIndex;
  final int startMs;
  final int endMs;

  WordTiming({
    required this.surah,
    required this.ayah,
    required this.wordIndex,
    required this.startMs,
    required this.endMs,
  });
}

/// Plays the real reciter's audio for a single word, isolated by precise
/// start/end timestamps - so a mistake correction sounds like an actual
/// Qari saying the word, not a synthesized voice.
///
/// Pilot scope: Juz Amma only (Surah 78-114). The timing data is bundled
/// with the app (small - timestamps only); the actual ayah audio is
/// downloaded on first use from everyayah.com and cached locally, since
/// full-Quran audio is far too large to bundle in the app itself.
class QariAudioService {
  QariAudioService._internal();
  static final QariAudioService instance = QariAudioService._internal();

  static const String _timingAssetPath = 'assets/data/qari_word_timings_juz_amma.json';
  static const String _everyAyahBaseUrl = 'https://everyayah.com/data';

  String _reciterFolder = 'Alafasy_128kbps';
  final Map<String, WordTiming> _timingIndex = {};
  bool _loaded = false;
  bool get isAvailable => _loaded && _timingIndex.isNotEmpty;

  final ap.AudioPlayer _player = ap.AudioPlayer();
  Timer? _stopTimer;

  String _key(int surah, int ayah, int wordIndex) => '${surah}_${ayah}_$wordIndex';

  /// Loads the bundled timing data. Safe to call multiple times - only
  /// loads once. If the asset is missing (e.g. the one-time data-prep
  /// script hasn't been run yet), this fails gracefully and isAvailable
  /// stays false rather than crashing the app.
  Future<void> load() async {
    if (_loaded) return;
    try {
      final raw = await rootBundle.loadString(_timingAssetPath);
      final data = json.decode(raw) as Map<String, dynamic>;
      _reciterFolder = data['reciter_folder'] as String? ?? _reciterFolder;
      final words = data['words'] as List;
      for (final w in words) {
        final timing = WordTiming(
          surah: w['surah'] as int,
          ayah: w['ayah'] as int,
          wordIndex: w['word_index'] as int,
          startMs: w['start_ms'] as int,
          endMs: w['end_ms'] as int,
        );
        _timingIndex[_key(timing.surah, timing.ayah, timing.wordIndex)] = timing;
      }
      _loaded = true;
    } catch (_) {
      // Timing data not present yet (data-prep script not run, or this
      // Surah is outside the Juz Amma pilot) - fail gracefully.
      _loaded = true; // don't keep retrying every call
    }
  }

  bool hasTimingFor(int surah, int ayah, int wordIndex) {
    return _timingIndex.containsKey(_key(surah, ayah, wordIndex));
  }

  Future<String> _cachedAyahAudioPath(int surah, int ayah) async {
    final dir = await getApplicationDocumentsDirectory();
    final cacheDir = Directory('${dir.path}/qari_audio_cache/$_reciterFolder');
    if (!await cacheDir.exists()) {
      await cacheDir.create(recursive: true);
    }
    final fileName = '${surah.toString().padLeft(3, '0')}${ayah.toString().padLeft(3, '0')}.mp3';
    return '${cacheDir.path}/$fileName';
  }

  Future<String?> _ensureAyahAudioDownloaded(int surah, int ayah) async {
    final path = await _cachedAyahAudioPath(surah, ayah);
    final file = File(path);
    if (await file.exists() && await file.length() > 0) {
      return path;
    }

    final fileName = '${surah.toString().padLeft(3, '0')}${ayah.toString().padLeft(3, '0')}.mp3';
    final url = '$_everyAyahBaseUrl/$_reciterFolder/$fileName';
    try {
      final response = await http.get(Uri.parse(url)).timeout(const Duration(seconds: 20));
      if (response.statusCode != 200 || response.bodyBytes.isEmpty) return null;
      await file.writeAsBytes(response.bodyBytes);
      return path;
    } catch (_) {
      return null;
    }
  }

  /// Plays just the correct word's audio, isolated from the full ayah
  /// recording using its precise start/end timestamps. Downloads and
  /// caches the ayah audio on first use for that ayah; subsequent
  /// mistakes on the same ayah play instantly from the local cache.
  ///
  /// Returns true if playback started, false if this word/ayah isn't
  /// covered yet (outside the Juz Amma pilot, or download failed) - the
  /// caller should fall back to the generic tone cue in that case.
  Future<bool> playWord({
    required int surah,
    required int ayah,
    required int wordIndex,
  }) async {
    await load();
    final timing = _timingIndex[_key(surah, ayah, wordIndex)];
    if (timing == null) return false;

    final audioPath = await _ensureAyahAudioDownloaded(surah, ayah);
    if (audioPath == null) return false;

    _stopTimer?.cancel();
    await _player.stop();
    await _player.seek(Duration(milliseconds: timing.startMs));
    await _player.play(ap.DeviceFileSource(audioPath));

    final clipDuration = timing.endMs - timing.startMs;
    _stopTimer = Timer(Duration(milliseconds: clipDuration.clamp(150, 10000)), () {
      _player.pause();
    });

    return true;
  }

  void dispose() {
    _stopTimer?.cancel();
    _player.dispose();
  }
}
