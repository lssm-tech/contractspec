import type { DocBlock } from '@lssm/lib.contracts/docs';
import { registerDocBlocks } from '@lssm/lib.contracts/docs';

const crmOnboardingDocBlocks: DocBlock[] = [
  {
    id: 'docs.learning-journey.crm-onboarding',
    title: 'Learning Journey — CRM First Win',
    summary:
      'Onboarding track for the CRM Pipeline example that drives users to first closed-won deal.',
    kind: 'reference',
    visibility: 'public',
    route: '/docs/learning-journey/crm-onboarding',
    tags: ['learning', 'crm', 'onboarding'],
    body: `## Track
- **Key**: \`crm_first_win\`
- **Persona**: CRM adopter
- **Goal**: From empty CRM to first closed-won deal with follow-up

## Steps & Events
1) \`create_pipeline\` → \`pipeline.created\`
2) \`create_contact_and_company\` → \`contact.created\`
3) \`create_first_deal\` → \`deal.created\`
4) \`move_deal_in_pipeline\` → \`deal.moved\`
5) \`close_deal_won\` → \`deal.won\`
6) \`setup_follow_up\` → \`task.completed\` (type: follow_up)

XP: 15/20/20/20/30/30 with 25 bonus within 72h. Badge: \`crm_first_win\`.

## Wiring
- Depends on \`@lssm/example.crm-pipeline\` events.
- Tracks export from \`@lssm/example.learning-journey-crm-onboarding/track\`.
- Use onboarding API:
  - \`learning.onboarding.listTracks\`
  - \`learning.onboarding.getProgress\`
  - \`learning.onboarding.recordEvent\` wired from CRM event bus handlers.
- Surface in CRM dashboard/pipeline UI to guide new users.`,
  },
];

registerDocBlocks(crmOnboardingDocBlocks);
