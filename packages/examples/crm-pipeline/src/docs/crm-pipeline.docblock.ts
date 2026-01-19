import type { DocBlock } from '@contractspec/lib.contracts/docs';
import { registerDocBlocks } from '@contractspec/lib.contracts/docs';

const crmPipelineDocBlocks: DocBlock[] = [
  {
    id: 'docs.examples.crm-pipeline.goal',
    title: 'CRM Pipeline — Goal',
    summary:
      'Deals, stages, contacts, companies, and tasks with auditable stage movement.',
    kind: 'goal',
    visibility: 'public',
    route: '/docs/examples/crm-pipeline/goal',
    tags: ['crm', 'goal'],
    body: `## Why it matters
- Regenerable CRM flow for deals/stages without code drift.
- Ensures stage movement, tasks, and contacts stay aligned across surfaces.

## Business/Product goal
- Give sales teams a governed pipeline with auditable moves and notifications.
- Allow experimentation (feature flags) on stage definitions and task flows.

## Success criteria
- Stage/state changes emit events and remain declarative in spec.
- PII (contacts) is scoped/redacted in presentations.`,
  },
  {
    id: 'docs.examples.crm-pipeline.usage',
    title: 'CRM Pipeline — Usage',
    summary: 'How to seed, extend, and regenerate the CRM pipeline.',
    kind: 'usage',
    visibility: 'public',
    route: '/docs/examples/crm-pipeline/usage',
    tags: ['crm', 'usage'],
    body: `## Setup
1) Seed (if available) or create pipeline stages, deals, contacts, companies, tasks.
2) Configure Notifications for stage changes/tasks; set policy.pii for contact data.

## Extend & regenerate
1) Adjust stage schema/order, deal fields, task fields in the spec.
2) Regenerate to sync UI/API/events; ensure kanban/action buttons update.
3) Use Feature Flags to trial new stages or SLA rules.

## Guardrails
- Emit events for stage moves and task completions; log to Audit Trail.
- Keep required fields enforced in contracts; avoid freeform state.
- Redact contact PII in markdown/JSON outputs.

## Adoption narrative

### Before
- A CRM app with hand-written data models and handler logic.
- Pipeline stage rules live in code and drift across UI/API/events.
- Regeneration is risky because specs and implementations are not aligned.

### After
- Contracts define deals, stages, and tasks as the source of truth.
- Regeneration keeps UI/API/events in sync when stages change.
- Compliance surfaces (audits, notifications) stay consistent with specs.

### Minimal adoption steps
1) Add ContractSpec CLI and core libraries.
2) Define one operation (for example, deal/create).
3) Run contractspec build to generate handlers and types.
4) Wire the generated handler into your existing router.
5) Expand to events and presentations as you add surface areas.
`,
  },
  {
    id: 'docs.examples.crm-pipeline.reference',
    title: 'CRM Pipeline — Reference',
    summary:
      'Entities, contracts, events, and presentations for the CRM template.',
    kind: 'reference',
    visibility: 'public',
    route: '/docs/examples/crm-pipeline',
    tags: ['crm', 'reference'],
    body: `## Entities
- Contact, Company, Deal, Pipeline, Stage, Task.

## Contracts
- deal/create, stage/move, contact/company CRUD, task create/complete.

## Events
- deal.created, stage.moved, task.completed, contact.updated.

## Presentations
- Pipelines/kanban, deal detail, contact/company profiles, task lists.

## Notes
- Stage definitions should be declarative; enforce via spec and regeneration.
- Use Notifications for deal/task updates; Audit Trail for state changes.`,
  },
  {
    id: 'docs.examples.crm-pipeline.constraints',
    title: 'CRM Pipeline — Constraints & Safety',
    summary:
      'Internal guardrails for stages, PII, and regeneration semantics in the CRM template.',
    kind: 'reference',
    visibility: 'internal',
    route: '/docs/examples/crm-pipeline/constraints',
    tags: ['crm', 'constraints', 'internal'],
    body: `## Constraints
- Stage definitions/order must remain declarative; no imperative overrides in code.
- Events to emit: deal.created, stage.moved, task.completed, contact.updated (minimum).
- Regeneration should not alter stage semantics without explicit spec change.

## PII
- Mark contact/company PII (emails, phones) for redaction in presentations.
- Ensure MCP/web outputs avoid raw PII when not needed.

## Verification
- Add fixtures for stage move rules and SLA/task changes.
- Ensure Audit/Notifications remain wired for stage and task events.
- Use Feature Flags for experimental stages/SLAs; default safe/off.`,
  },
];

registerDocBlocks(crmPipelineDocBlocks);
