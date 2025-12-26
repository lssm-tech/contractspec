# @lssm/example.learning-journey-crm-onboarding

Website: https://contractspec.io/


Learning Journey example that guides a CRM user to first closed-won deal.

## Track

- **Key**: `crm_first_win`
- **Persona**: CRM adopter
- **XP**: 15/20/20/20/30/30 + 25 bonus
- **Badge**: `crm_first_win`

## Steps & Events

1. `create_pipeline` → `pipeline.created`
2. `create_contact_and_company` → `contact.created`
3. `create_first_deal` → `deal.created`
4. `move_deal_in_pipeline` → `deal.moved`
5. `close_deal_won` → `deal.won`
6. `setup_follow_up` → `task.completed` (type: follow_up)

## Usage

- Import track specs:  
  `import { crmLearningTracks } from '@lssm/example.learning-journey-crm-onboarding/track'`
- Contracts/handlers for demos:  
  `import { GetCrmOnboardingTrack, RecordCrmOnboardingEvent } from '@lssm/example.learning-journey-crm-onboarding/contracts'`  
  `import { emitCrmOnboardingEvent } from '@lssm/example.learning-journey-crm-onboarding/handlers/demo.handlers'`
- Presentations (react/markdown/json targets):  
  `import { crmOnboardingPresentations } from '@lssm/example.learning-journey-crm-onboarding/presentations'`
- Register via onboarding API:
  - `learning.onboarding.listTracks`
  - `learning.onboarding.getProgress`
  - `learning.onboarding.recordEvent` wired from CRM events
- Requires CRM pipeline example events to be emitted for completion.

## Docs

- Docblock: `src/docs/crm-onboarding.docblock.ts`
- Route suggestion: `/docs/learning-journey/crm-onboarding`
