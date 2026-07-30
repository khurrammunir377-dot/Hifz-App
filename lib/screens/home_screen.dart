import 'package:flutter/material.dart';
import '../models/quran_models.dart';
import '../services/db_helper.dart';
import '../services/quran_repository.dart';
import '../services/settings_service.dart';
import 'recitation_screen.dart';
import 'review_screen.dart';
import 'settings_screen.dart';
import 'surah_list_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  (int, int)? _lastSession;
  Map<String, dynamic> _stats = {'versesAttempted': 0, 'averageAccuracy': 0.0, 'versesLearned': 0};

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    final last = await SettingsService.instance.getLastSession();
    final stats = await DbHelper.instance.overallStats();
    if (!mounted) return;
    setState(() {
      _lastSession = last;
      _stats = stats;
    });
  }

  @override
  Widget build(BuildContext context) {
    final juzList = QuranRepository.instance.allJuz;
    final scheme = Theme.of(context).colorScheme;

    return Scaffold(
      body: SafeArea(
        child: RefreshIndicator(
          onRefresh: _load,
          child: CustomScrollView(
            slivers: [
              SliverToBoxAdapter(child: _buildHeader(scheme)),
              if (_lastSession != null) SliverToBoxAdapter(child: _continueCard(context, _lastSession!)),
              SliverToBoxAdapter(child: _buildStatsRow(scheme)),
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(16, 20, 16, 8),
                  child: Text('Browse by Juz', style: Theme.of(context).textTheme.titleMedium),
                ),
              ),
              SliverList(
                delegate: SliverChildBuilderDelegate(
                  (context, index) {
                    final JuzInfo juz = juzList[index];
                    return Card(
                      child: ListTile(
                        leading: CircleAvatar(
                          backgroundColor: scheme.primaryContainer,
                          child: Text('${juz.number}', style: TextStyle(color: scheme.primary, fontWeight: FontWeight.bold)),
                        ),
                        title: Text('Juz ${juz.number}'),
                        subtitle: Text('Starts at ${juz.startSurahName}'),
                        trailing: const Icon(Icons.chevron_right),
                        onTap: () {
                          Navigator.of(context).push(
                            MaterialPageRoute(builder: (_) => SurahListScreen(juzNumber: juz.number)),
                          ).then((_) => _load());
                        },
                      ),
                    );
                  },
                  childCount: juzList.length,
                ),
              ),
              const SliverToBoxAdapter(child: SizedBox(height: 24)),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildHeader(ColorScheme scheme) {
    return Container(
      padding: const EdgeInsets.fromLTRB(20, 12, 20, 24),
      decoration: BoxDecoration(
        color: scheme.primary,
        borderRadius: const BorderRadius.only(bottomLeft: Radius.circular(28), bottomRight: Radius.circular(28)),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          const Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Hifz Companion', style: TextStyle(color: Colors.white, fontSize: 22, fontWeight: FontWeight.bold)),
              SizedBox(height: 4),
              Text('Assalamu alaikum — ready to recite?', style: TextStyle(color: Colors.white70, fontSize: 13)),
            ],
          ),
          Row(
            children: [
              IconButton(
                icon: const Icon(Icons.insights_rounded, color: Colors.white),
                tooltip: 'Review',
                onPressed: () {
                  Navigator.of(context).push(MaterialPageRoute(builder: (_) => const ReviewScreen()));
                },
              ),
              IconButton(
                icon: const Icon(Icons.settings_rounded, color: Colors.white),
                tooltip: 'Settings',
                onPressed: () {
                  Navigator.of(context)
                      .push(MaterialPageRoute(builder: (_) => const SettingsScreen()))
                      .then((_) => _load());
                },
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildStatsRow(ColorScheme scheme) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 16, 16, 0),
      child: Card(
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 16),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              _statColumn('${_stats['versesAttempted']}', 'Verses\nAttempted'),
              _divider(),
              _statColumn('${((_stats['averageAccuracy'] as double) * 100).toStringAsFixed(0)}%', 'Avg.\nAccuracy'),
              _divider(),
              _statColumn('${_stats['versesLearned']}', 'Verses\nLearned'),
            ],
          ),
        ),
      ),
    );
  }

  Widget _divider() => Container(width: 1, height: 36, color: Colors.grey.shade300);

  Widget _statColumn(String value, String label) {
    return Column(
      children: [
        Text(value, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
        const SizedBox(height: 4),
        Text(label, textAlign: TextAlign.center, style: const TextStyle(fontSize: 11, color: Colors.grey)),
      ],
    );
  }

  Widget _continueCard(BuildContext context, (int, int) lastSession) {
    final (surah, ayah) = lastSession;
    final surahInfo = QuranRepository.instance.surahByNumber(surah);
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 16, 16, 0),
      child: Card(
        child: ListTile(
          leading: CircleAvatar(
            backgroundColor: Theme.of(context).colorScheme.primary,
            child: const Icon(Icons.play_arrow_rounded, color: Colors.white),
          ),
          title: const Text('Continue Last Session'),
          subtitle: Text('${surahInfo.nameTransliteration} — Ayah $ayah'),
          trailing: const Icon(Icons.chevron_right),
          onTap: () {
            Navigator.of(context).push(
              MaterialPageRoute(builder: (_) => RecitationScreen(surahNumber: surah, initialAyah: ayah)),
            ).then((_) => _load());
          },
        ),
      ),
    );
  }
}
