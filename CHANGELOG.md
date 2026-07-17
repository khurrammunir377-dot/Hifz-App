# Changelog

All notable changes to the AI Quran Teacher project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-07-15

### Added

- **Quran Knowledge Engine**
  - Complete Quran database with 114 Surahs and 6,236 Ayahs
  - Word-by-word Uthmani script with English translations
  - Arabic normalization engine for consistent search
  - Drizzle ORM integration with MySQL database

- **Core Features**
  - Dashboard with daily learning targets
  - Learn screen with Juz/Surah/Ayah navigation
  - Progress tracking with visual indicators
  - Settings screen with user preferences
  - Onboarding flow for new users

- **API Endpoints**
  - `quran.getSurahs()` - Retrieve all Surahs
  - `quran.getSurahByNumber()` - Get specific Surah
  - `quran.getAyahsBySurahId()` - Get Ayahs by Surah
  - `quran.searchQuran()` - Search Quranic text
  - `quran.createLesson()` - Create user lesson
  - `quran.createBookmark()` - Bookmark verses
  - `quran.getBookmarksByUserId()` - Retrieve bookmarks

- **Database Schema**
  - `surahs` table with metadata
  - `ayahs` table with Uthmani text and classifications
  - `words` table with word-by-word data
  - `lessons` table for tracking progress
  - `bookmarks` table for user bookmarks

- **Testing**
  - Unit tests for Quran engine
  - Database seeding script
  - Arabic normalization tests

- **Documentation**
  - Comprehensive API documentation
  - Database schema diagrams
  - Deployment guides for web, iOS, and Android
  - App store submission guidelines

- **Deployment Configuration**
  - `app.json` for Expo configuration
  - `eas.json` for EAS Build setup
  - GitHub Actions CI/CD workflow
  - Docker support for local development

### Technical Stack

- **Frontend:** React Native, Expo Router, NativeWind (TailwindCSS)
- **Backend:** Node.js, Express, tRPC
- **Database:** MySQL with Drizzle ORM
- **Language:** TypeScript
- **Build Tools:** esbuild, Expo CLI, EAS Build

### Known Limitations

- Offline support coming in v1.1
- AI-powered Tajweed analysis coming in v1.2
- Pronunciation analysis coming in v1.2
- User authentication coming in v1.1

---

## Future Roadmap

### v1.1.0 (Q3 2026)

- [ ] User authentication and accounts
- [ ] Offline Quran data support
- [ ] Lesson history and analytics
- [ ] Dark mode theme
- [ ] Internationalization (Arabic, Urdu)

### v1.2.0 (Q4 2026)

- [ ] AI-powered Tajweed analysis
- [ ] Pronunciation feedback
- [ ] Advanced search filters
- [ ] Memorization tracking
- [ ] Social features (sharing progress)

### v2.0.0 (2027)

- [ ] Multiple Quranic readings (Riwayahs)
- [ ] Tafsir integration
- [ ] Hadith database
- [ ] Community features
- [ ] Premium subscription features

---

## Version History

| Version | Release Date | Status |
|---------|-------------|--------|
| 1.0.0   | 2026-07-15  | Released |

