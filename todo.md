# Project TODO - Phase 1.5

## Architecture Refactoring
- [ ] Refactor into feature-based Clean Architecture
- [ ] Organize project into specified modules (core/, shared/, features/, services/, repositories/, models/, providers/, hooks/, utils/, constants/, theme/, localization/, navigation/)
- [ ] Separate Presentation Layer
- [ ] Separate Business Logic Layer
- [ ] Separate Data Layer
- [ ] Separate Infrastructure Layer
- [ ] Prepare for AI Layer (future)

## Future AI Service Interfaces
- [ ] Create typed interfaces for SpeechRecognitionService
- [ ] Create typed interfaces for AudioStreamingService
- [ ] Create typed interfaces for QuranAlignmentService
- [ ] Create typed interfaces for MemorizationEngine
- [ ] Create typed interfaces for TajweedAnalysisService
- [ ] Create typed interfaces for PronunciationAnalysisService
- [ ] Create typed interfaces for RevisionScheduler
- [ ] Create typed interfaces for AITeacherService
- [ ] Create typed interfaces for NotificationService
- [ ] Create typed interfaces for AnalyticsService
- [ ] Implement dependency injection for all services

## Quran Database Model
- [ ] Design database models for Surah
- [ ] Design database models for Ayah
- [ ] Design database models for Word
- [ ] Design database models for Juz
- [ ] Design database models for Hizb
- [ ] Design database models for Rub
- [ ] Design database models for Page
- [ ] Ensure every Quran word model supports: wordId, surahNumber, ayahNumber, wordIndex, Uthmani script, Plain Arabic, optional transliteration, optional translation key, page number, Juz, Hizb, Rub, Waqf symbol, Sajdah indicator, word position, future pronunciation metadata, future Tajweed metadata

## Riwayah Support
- [ ] Design architecture to support multiple Riwayat
- [ ] Initially enable Hafs 'an Asim
- [ ] Ensure future-readiness for Warsh, Qalun, Shu'bah
- [ ] Implement configurable Riwayah selection throughout the application

## Session Data Model
- [ ] Create production-grade session model
- [ ] Ensure each memorization session stores: Session ID, Student ID, Date, Start Time, End Time, Duration, Selected Riwayah, Selected Surah, Ayah Range, Current Page, Current Juz, Mistakes, Correction History, Confidence Score, Completion %, Teacher Mode, Revision Status, Future AI Score, Future Tajweed Score, Future Pronunciation Score

## Offline Support
- [ ] Implement architecture for Offline Quran database
- [ ] Implement architecture for Downloaded Juz
- [ ] Implement architecture for Downloaded Surahs
- [ ] Implement architecture for Offline lesson cache
- [ ] Implement architecture for Offline progress
- [ ] Implement architecture for Automatic synchronization
- [ ] Implement architecture for Conflict resolution

## Security
- [ ] Prepare for Encrypted local storage
- [ ] Prepare for Secure authentication
- [ ] Prepare for JWT ready implementation
- [ ] Prepare for Token refresh mechanism
- [ ] Prepare for Secure API layer
- [ ] Prepare for Protected routes
- [ ] Prepare for Role-based permissions

## Internationalization
- [ ] Implement localization architecture
- [ ] Support Arabic
- [ ] Support English
- [ ] Support Urdu
- [ ] Prepare for Future language packs
- [ ] Implement RTL support
- [ ] Implement LTR support

## Theme System
- [ ] Create enterprise theme support
- [ ] Support Light theme
- [ ] Support Dark theme
- [ ] Support High Contrast theme
- [ ] Support Large Font Accessibility
- [ ] Support Islamic Green Theme

## Analytics Foundation
- [ ] Prepare analytics events for Lesson Started
- [ ] Prepare analytics events for Lesson Completed
- [ ] Prepare analytics events for Revision Completed
- [ ] Prepare analytics events for Mistake Detected
- [ ] Prepare analytics events for Achievement Earned
- [ ] Prepare analytics events for Streak Updated
- [ ] Prepare analytics events for Session Finished
- [ ] Ensure no analytics provider is hardcoded

## Error Handling
- [ ] Create centralized Exception handling
- [ ] Create centralized Logging
- [ ] Create centralized Crash reporting interface
- [ ] Create centralized Network retry mechanism
- [ ] Create centralized Offline recovery mechanism

## Testing
- [ ] Generate Unit tests
- [ ] Generate Repository tests
- [ ] Generate Provider tests
- [ ] Generate Navigation tests
- [ ] Generate Architecture validation tests

## Documentation
- [ ] Generate Architecture diagrams
- [ ] Generate Folder structure documentation
- [ ] Generate Service documentation
- [ ] Generate API contracts
- [ ] Generate Future AI integration guide
- [ ] Generate Developer onboarding guide
