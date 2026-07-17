# Phase 1 Application Architecture

## Architectural Direction

The project follows a feature-oriented clean architecture within Expo Router. Presentation code is organized by route and reusable components, product state is exposed through a dedicated context and reducer, domain types remain framework-independent, and integration services are represented by typed ports. This keeps the Phase 1 experience lightweight while avoiding UI coupling to future cloud or AI vendors.

| Layer | Phase 1 responsibility | Future extension |
|---|---|---|
| Presentation | Screens, navigation, accessible components, visual state, and validation feedback. | Live recitation timeline, correction overlays, Tajweed coaching, parental and teacher views. |
| Application state | Onboarding status, student profile, learning plan, interface settings, and progress summary. | Synced learner state, revision scheduler, entitlements, organization context. |
| Domain | Student, memorization target, Ayah range, progress, preferences, and AI result contracts. | Verified Quran references, attempt evidence, mistake taxonomy, Tajweed rule evidence. |
| Service ports | Interfaces for Quran data, audio capture, alignment, Tajweed analysis, and teaching guidance. | Concrete FastAPI clients, streaming transport, offline queues, telemetry, and retries. |
| Infrastructure | Local AsyncStorage persistence and deterministic mock-neutral seed state. | Secure authentication, encrypted storage, PostgreSQL sync, object storage, feature flags. |

## Trust Boundary

Only a verified Quran repository may provide Quran text. Speech recognition output is treated as an observation rather than Quran content. Alignment and Tajweed engines must attach confidence and evidence to each result. The teaching assistant may explain validated results but may not author replacement Quran text. The UI will distinguish pending, uncertain, verified, and unavailable states rather than converting low-confidence analysis into definitive correction.

