import 'package:flutter/material.dart';
import 'screens/home_screen.dart';
import 'screens/splash_screen.dart';
import 'screens/welcome_screen.dart';
import 'services/quran_repository.dart';
import 'services/settings_service.dart';
import 'theme/app_theme.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const HifzCompanionApp());
}

class HifzCompanionApp extends StatefulWidget {
  const HifzCompanionApp({super.key});

  @override
  State<HifzCompanionApp> createState() => _HifzCompanionAppState();
}

class _HifzCompanionAppState extends State<HifzCompanionApp> {
  bool _ready = false;
  bool _darkMode = false;
  bool _hasSeenOnboarding = false;

  @override
  void initState() {
    super.initState();
    _bootstrap();
  }

  Future<void> _bootstrap() async {
    await QuranRepository.instance.load();
    final darkMode = await SettingsService.instance.getDarkMode();
    final seenOnboarding = await SettingsService.instance.getHasSeenOnboarding();
    setState(() {
      _darkMode = darkMode;
      _hasSeenOnboarding = seenOnboarding;
      _ready = true;
    });
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Hifz Companion',
      theme: AppTheme.light(),
      darkTheme: AppTheme.dark(),
      themeMode: _darkMode ? ThemeMode.dark : ThemeMode.light,
      home: !_ready
          ? const SplashScreen()
          : (_hasSeenOnboarding ? const HomeScreen() : const WelcomeScreen()),
    );
  }
}
