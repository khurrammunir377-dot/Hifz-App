# Future AI Service Boundary

Phase 1 ships **typed ports and deliberately unavailable adapters**. Screens may describe future capabilities, but they cannot silently invoke an unverified Quran source or simulate a correction result. Concrete implementations must satisfy the contracts in `services/ports` and replace the corresponding entry in `service-container.ts` only after Quran governance, privacy, security, evaluation, and operational requirements have been approved.

| Port | Required production behavior |
|---|---|
| `QuranRepository` | Return immutable Uthmani-script content from an approved edition, expose source authority and version, and verify cached content by checksum. |
| `RecitationCaptureService` | Request microphone permission at point of use, make recording state explicit, support discard, and produce integrity metadata. |
| `RecitationAlignmentService` | Compare observations to the verified reference, return timestamped evidence and calibrated confidence, and mark uncertain results for review. |
| `TajweedAnalysisService` | Attach each observation to audio evidence, a verified Ayah, a defined rule category, an engine version, and a confidence score. |
| `TeachingAssistantService` | Explain validated observations for the learner's age and selected mode without creating or modifying Quran text. |

The mobile client should treat all service output as untrusted until schemas, signatures, version compatibility, and Quran reference identifiers are validated. Low-confidence correction must be shown as uncertain and must never replace the verified reference.
