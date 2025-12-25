# @lssm/example.learning-journey-registry

Website: https://contractspec.lssm.tech/


Aggregated registry for learning journey example tracks.

## Contents

- `learningJourneyTracks`: all track specs
- `onboardingTrackCatalog`: DTOs aligned with onboarding API outputs
- `mapTrackSpecToDto`: helper for adapters
- Re-exports per-track arrays: Studio onboarding, Platform tour, CRM first win

## Usage

```ts
import { onboardingTrackCatalog } from '@lssm/example.learning-journey-registry';
// Feed into API/service that implements learning.onboarding.listTracks
```

## Docs

- Docblock: `src/docs/learning-journey-registry.docblock.ts`
- Route suggestion: `/docs/learning-journey/registry`
