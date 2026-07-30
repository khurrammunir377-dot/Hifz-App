import 'package:flutter/material.dart';
import '../services/db_helper.dart';
import '../services/quran_repository.dart';
import 'recitation_screen.dart';

class ReviewScreen extends StatefulWidget {
  const ReviewScreen({super.key});

  @override
  State<ReviewScreen> createState() => _ReviewScreenState();
}

class _ReviewScreenState extends State<ReviewScreen> {
  bool _loading = true;
  List<Map<String, dynamic>> _missedWords = [];
  List<Map<String, dynamic>> _weakAyahs = [];
  List<Map<String, dynamic>> _weakSurahs = [];

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    final words = await DbHelper.instance.frequentlyMissedWords(limit: 10);
    final ayahs = await DbHelper.instance.weakAyahs(limit: 10);
    final surahs = await DbHelper.instance.weakSurahs(limit: 5);
    if (!mounted) return;
    setState(() {
      _missedWords = words;
      _weakAyahs = ayahs;
      _weakSurahs = surahs;
      _loading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Review')),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : (_missedWords.isEmpty && _weakAyahs.isEmpty)
              ? _buildEmptyState()
              : RefreshIndicator(
                  onRefresh: _load,
                  child: ListView(
                    padding: const EdgeInsets.all(16),
                    children: [
                      if (_weakSurahs.isNotEmpty) ...[
                        _sectionTitle('Surahs to Focus On'),
                        ..._weakSurahs.map((row) => _weakSurahTile(row)),
                        const SizedBox(height: 16),
                      ],
                      if (_weakAyahs.isNotEmpty) ...[
                        _sectionTitle('Ayahs With the Most Mistakes'),
                        ..._weakAyahs.map((row) => _weakAyahTile(row)),
                        const SizedBox(height: 16),
                      ],
                      if (_missedWords.isNotEmpty) ...[
                        _sectionTitle('Frequently Missed Words'),
                        ..._missedWords.map((row) => _missedWordTile(row)),
                      ],
                    ],
                  ),
                ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.check_circle_outline, size: 56, color: Colors.grey.shade400),
            const SizedBox(height: 16),
            const Text(
              'No mistakes logged yet',
              style: TextStyle(fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            Text(
              'Once you start checking your recitation, weak spots you should '
              'revisit will show up here automatically.',
              textAlign: TextAlign.center,
              style: TextStyle(color: Colors.grey.shade600, fontSize: 13),
            ),
          ],
        ),
      ),
    );
  }

  Widget _sectionTitle(String text) => Padding(
        padding: const EdgeInsets.only(bottom: 8),
        child: Text(text, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
      );

  Widget _weakSurahTile(Map<String, dynamic> row) {
    final surahNum = row['surah'] as int;
    final count = row['mistake_count'] as int;
    final info = QuranRepository.instance.surahByNumber(surahNum);
    return Card(
      child: ListTile(
        leading: const Icon(Icons.menu_book_outlined),
        title: Text(info.nameTransliteration),
        trailing: Text('$count mistake${count == 1 ? '' : 's'}', style: const TextStyle(color: Colors.grey)),
      ),
    );
  }

  Widget _weakAyahTile(Map<String, dynamic> row) {
    final surahNum = row['surah'] as int;
    final ayahNum = row['ayah'] as int;
    final count = row['mistake_count'] as int;
    final info = QuranRepository.instance.surahByNumber(surahNum);
    return Card(
      child: ListTile(
        leading: const Icon(Icons.bookmark_border),
        title: Text('${info.nameTransliteration} — Ayah $ayahNum'),
        trailing: Text('$count', style: const TextStyle(color: Colors.grey)),
        onTap: () {
          Navigator.of(context).push(
            MaterialPageRoute(
              builder: (_) => RecitationScreen(surahNumber: surahNum, initialAyah: ayahNum),
            ),
          ).then((_) => _load());
        },
      ),
    );
  }

  Widget _missedWordTile(Map<String, dynamic> row) {
    final word = row['expected_word'] as String? ?? '';
    final surahNum = row['surah'] as int;
    final ayahNum = row['ayah'] as int;
    final count = row['mistake_count'] as int;
    final info = QuranRepository.instance.surahByNumber(surahNum);
    return Card(
      child: ListTile(
        title: Text(word, textDirection: TextDirection.rtl, style: const TextStyle(fontSize: 18)),
        subtitle: Text('${info.nameTransliteration}, Ayah $ayahNum'),
        trailing: Text('×$count', style: const TextStyle(color: Colors.grey)),
        onTap: () {
          Navigator.of(context).push(
            MaterialPageRoute(
              builder: (_) => RecitationScreen(surahNumber: surahNum, initialAyah: ayahNum),
            ),
          ).then((_) => _load());
        },
      ),
    );
  }
}
