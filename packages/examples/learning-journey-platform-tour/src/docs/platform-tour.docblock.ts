import type { DocBlock } from '@lssm/lib.contracts/docs';
import { registerDocBlocks } from '@lssm/lib.contracts/docs';

const platformTourDocBlocks: DocBlock[] = [
  {
    id: 'docs.learning-journey.platform-tour',
    title: 'Learning Journey — Platform Primitives Tour',
    summary:
      'Cross-module tour that touches identity, audit, notifications, jobs, feature flags, files, and metering.',
    kind: 'reference',
    visibility: 'public',
    route: '/docs/learning-journey/platform-tour',
    tags: ['learning', 'platform', 'onboarding'],
    body: `## Track
- **Key**: \`platform_primitives_tour\`
- **Persona**: platform developer exploring primitives
- **Goal**: Touch each cross-cutting module once, event-driven completion

## Steps & Events
1) \`identity_rbac\` → \`org.member.added\`
2) \`event_bus_audit\` → \`audit_log.created\`
3) \`notifications\` → \`notification.sent\`
4) \`jobs_scheduler\` → \`job.completed\`
5) \`feature_flags\` → \`flag.toggled\`
6) \`files_attachments\` → \`attachment.attached\`
7) \`usage_metering\` → \`usage.recorded\`

XP: 20 per step, 20 bonus XP upon completion.

## Wiring
- Tracks export from \`@lssm/example.learning-journey.platform-tour/track\`.
- Use onboarding API to surface progress:
  - \`learning.onboarding.listTracks\`
  - \`learning.onboarding.getProgress\`
  - \`learning.onboarding.recordEvent\` wired from each module's event bus handlers.
- Align event payloads with modules: identity-rbac, audit-trail, notifications, jobs, feature-flags, files, metering.`,
  },
];

registerDocBlocks(platformTourDocBlocks);
