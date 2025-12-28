import type { DocBlock } from '@contractspec/lib.contracts';
import { registerDocBlocks } from '@contractspec/lib.contracts';

const studioOnboardingDocBlocks: DocBlock[] = [
  {
    id: 'docs.learning-journey.studio-onboarding',
    title: 'Learning Journey — Studio Getting Started',
    summary:
      'Track that guides a new Studio user through template spawn, spec edit, regeneration, playground, and evolution.',
    kind: 'reference',
    visibility: 'public',
    route: '/docs/learning-journey/studio-onboarding',
    tags: ['learning', 'onboarding', 'studio'],
    body: `## Track
- **Key**: \`studio_getting_started\`
- **Persona**: new Studio developer, first 30 minutes
- **Goal**: instantiate template → edit spec → regenerate → play → run evolution

## Steps & Events
1) \`choose_template\` → event \`studio.template.instantiated\`
2) \`edit_spec\` → event \`spec.changed\` (scope: sandbox)
3) \`regenerate_app\` → event \`regeneration.completed\`
4) \`play_in_playground\` → event \`playground.session.started\`
5) \`try_evolution_mode\` → event \`studio.evolution.applied\`

XP: 20/20/20/20/30 with bonus 25 XP if completed within 48h (streak rule). Badge: \`studio_first_30m\`.

## Wiring
- Tracks export from \`@contractspec/example.learning-journey-studio-onboarding/track\`.
- Use onboarding API:
  - \`learning.onboarding.listTracks\` to surface catalog
  - \`learning.onboarding.getProgress\` to render progress
  - \`learning.onboarding.recordEvent\` to advance from bus events
- Events should be emitted by Studio surfaces (template creation, spec save, regeneration, playground session start, evolution apply).`,
  },
];

registerDocBlocks(studioOnboardingDocBlocks);
