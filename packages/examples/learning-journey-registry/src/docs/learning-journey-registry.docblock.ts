import type { DocBlock } from '@contractspec/lib.contracts-spec/docs';
import { registerDocBlocks } from '@contractspec/lib.contracts-spec/docs';

const registryDocBlocks: DocBlock[] = [
  {
    id: 'docs.learning-journey.registry',
    title: 'Learning Journey — Example Track Registry',
    summary:
      'Aggregates learning journey example tracks (Studio onboarding, Platform tour, CRM first win, Drills, Ambient Coach, Quest challenges).',
    kind: 'usage',
    visibility: 'public',
    route: '/docs/learning-journey/registry',
    tags: ['learning', 'registry', 'onboarding'],
    body: `## Tracks
- \`studio_getting_started\` (Studio onboarding)
- \`platform_primitives_tour\` (Platform primitives)
- \`crm_first_win\` (CRM pipeline onboarding)
- \`drills_language_basics\` (Drills & SRS)
- \`money_ambient_coach\`, \`coliving_ambient_coach\` (Ambient tips)
- \`money_reset_7day\` (Quest/challenge)

## Exports
- \`learningJourneyTracks\` — raw specs
- \`onboardingTrackCatalog\` — DTOs aligned with onboarding API
- \`mapTrackSpecToDto\` — helper to map individual tracks

## Wiring
- Use with onboarding API contracts:
  - \`learning.onboarding.listTracks\`
  - \`learning.onboarding.getProgress\`
  - \`learning.onboarding.recordEvent\`
- Intended for registry/adapters in Studio UI or services that surface tracks.`,
  },
];

registerDocBlocks(registryDocBlocks);
