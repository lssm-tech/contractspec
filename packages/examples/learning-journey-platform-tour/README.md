# @lssm/example.learning-journey-platform-tour

Learning Journey example that tours platform primitives.

## Track

- **Key**: `platform_primitives_tour`
- **Persona**: platform developer
- **XP**: 7 steps × 20 XP + 20 bonus
- **Badge**: `platform_primitives`

## Steps & Events

1. `identity_rbac` → `org.member.added`
2. `event_bus_audit` → `audit_log.created`
3. `notifications` → `notification.sent`
4. `jobs_scheduler` → `job.completed`
5. `feature_flags` → `flag.toggled`
6. `files_attachments` → `attachment.attached`
7. `usage_metering` → `usage.recorded`

## Usage

- Import track specs:  
  `import { platformLearningTracks } from '@lssm/example.learning-journey-platform-tour/track'`
- Contracts/handlers for demos:  
  `import { GetPlatformTourTrack, RecordPlatformTourEvent } from '@lssm/example.learning-journey-platform-tour/contracts'`  
  `import { emitPlatformTourEvent } from '@lssm/example.learning-journey-platform-tour/handlers/demo.handlers'`
- Presentations (react/markdown/json targets):  
  `import { platformTourPresentations } from '@lssm/example.learning-journey-platform-tour/presentations'`
- Register via onboarding API:
  - `learning.onboarding.listTracks`
  - `learning.onboarding.getProgress`
  - `learning.onboarding.recordEvent` wired from each module’s events
- Map module events (identity, audit-trail, notifications, jobs, feature-flags, files, metering) into `recordEvent`.

## Docs

- Docblock: `src/docs/platform-tour.docblock.ts`
- Route suggestion: `/docs/learning-journey/platform-tour`
