import 'package:flutter/material.dart';

/// Shown while the Quran text dataset loads at app start. Kept as its own
/// widget (rather than inline in main.dart) so it's easy to enrich later
/// (animation, version text, etc.) without touching the bootstrap logic.
class SplashScreen extends StatelessWidget {
  const SplashScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    return Scaffold(
      backgroundColor: scheme.primary,
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              width: 96,
              height: 96,
              decoration: const BoxDecoration(
                color: Colors.white,
                shape: BoxShape.circle,
              ),
              child: Icon(Icons.menu_book_rounded, size: 48, color: scheme.primary),
            ),
            const SizedBox(height: 24),
            const Text(
              'Hifz Companion',
              style: TextStyle(
                color: Colors.white,
                fontSize: 24,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'Free, for every student, everywhere',
              style: TextStyle(color: Colors.white.withOpacity(0.85), fontSize: 13),
            ),
            const SizedBox(height: 40),
            const SizedBox(
              width: 28,
              height: 28,
              child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2.5),
            ),
          ],
        ),
      ),
    );
  }
}
