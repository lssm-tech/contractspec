# @contractspec/example.learning-journey-studio-onboarding

Website: https://contractspec.io/


Learning Journey example focused on the first 30 minutes inside ContractSpec Studio.

## Track

- **Key**: `studio_getting_started`
- **Persona**: new Studio developer
- **XP**: 20/20/20/20/30 + 25 bonus within 48h
- **Badge**: `studio_first_30m`

## Steps & Events

1. `choose_template` → `studio.template.instantiated`
2. `edit_spec` → `spec.changed` (scope: sandbox)
3. `regenerate_app` → `regeneration.completed`
4. `play_in_playground` → `playground.session.started`
5. `try_evolution_mode` → `studio.evolution.applied`

## Usage

- Import track specs:  
  `import { studioLearningTracks } from '@contractspec/example.learning-journey-studio-onboarding/track'`
- Contracts/handlers for demos:  
  `import { GetStudioOnboardingTrack, RecordStudioOnboardingEvent } from '@contractspec/example.learning-journey-studio-onboarding/contracts'`  
  `import { emitStudioOnboardingEvent } from '@contractspec/example.learning-journey-studio-onboarding/handlers/demo.handlers'`
- Presentations (react/markdown/json targets):  
  `import { studioOnboardingPresentations } from '@contractspec/example.learning-journey-studio-onboarding/presentations'`
- Register with Learning Journey surfaces via onboarding API:
  - `learning.onboarding.listTracks` to surface catalog
  - `learning.onboarding.getProgress` to show status
  - `learning.onboarding.recordEvent` in event-bus handlers to advance steps
- Wire events from Studio surfaces (template spawn, spec save, regeneration, playground session start, evolution apply) to `recordEvent`.

## Docs

- Docblock: `src/docs/studio-onboarding.docblock.ts`
- Route suggestion: `/docs/learning-journey/studio-onboarding`
