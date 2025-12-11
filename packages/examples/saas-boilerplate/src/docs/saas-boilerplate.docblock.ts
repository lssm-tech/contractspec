import type { DocBlock } from '@lssm/lib.contracts/docs';
import { registerDocBlocks } from '@lssm/lib.contracts/docs';

const saasBoilerplateDocBlocks: DocBlock[] = [
  {
    id: 'docs.examples.saas-boilerplate.goal',
    title: 'SaaS Boilerplate — Goal',
    summary:
      'Multi-tenant SaaS foundation with orgs, members, projects, settings, and usage.',
    kind: 'goal',
    visibility: 'public',
    route: '/docs/examples/saas-boilerplate/goal',
    tags: ['saas', 'goal'],
    body: `## Why it matters
- Provides a regenerable SaaS base: orgs, members, projects, settings, usage/billing.
- Avoids drift across identity, settings, and usage capture.

## Business/Product goal
- Ship SaaS faster with tenant isolation, RBAC, and usage metering baked in.
- Keep audit/notifications ready for compliance and customer comms.

## Success criteria
- Spec changes to org/project/settings/usage regenerate UI/API/events cleanly.
- Tenant isolation and RBAC stay enforced; usage data is captured with PII scopes.`,
  },
  {
    id: 'docs.examples.saas-boilerplate.usage',
    title: 'SaaS Boilerplate — Usage',
    summary: 'How to seed, extend, and regenerate the SaaS base.',
    kind: 'usage',
    visibility: 'public',
    route: '/docs/examples/saas-boilerplate/usage',
    tags: ['saas', 'usage'],
    body: `## Setup
1) Seed (if available) or create orgs, members, and projects via UI.
2) Configure Notifications for invites and project events; set policy.pii for sensitive fields.

## Extend & regenerate
1) Adjust schemas (project metadata, settings, usage records) in spec.
2) Regenerate to sync UI/API/events and usage metering.
3) Use Feature Flags to roll out new settings or billing fields gradually.

## Guardrails
- Keep tenant/role context explicit in contracts and presentations.
- Emit events for invites, project changes, and usage records; log in Audit Trail.
- Redact sensitive user/org data in markdown/JSON outputs.`,
  },
  {
    id: 'docs.examples.saas-boilerplate.reference',
    title: 'SaaS Boilerplate — Reference',
    summary:
      'Entities, contracts, events, and presentations for the SaaS starter.',
    kind: 'reference',
    visibility: 'public',
    route: '/docs/examples/saas-boilerplate',
    tags: ['saas', 'reference'],
    body: `## Entities
- Organization, Member, Role, Project, AppSettings, UserSettings, BillingUsage.

## Contracts
- org/project CRUD, invites, role assignment, usage recording.

## Events
- org.created, member.invited/accepted, project.created/updated, usage.recorded.

## Presentations
- Org/project dashboards, member management, settings screens, usage views.

## Notes
- Tenant isolation is mandatory; enforce via RBAC/policies.
- Usage/Metering drives billing/limits; keep units explicit.`,
  },
  {
    id: 'docs.examples.saas-boilerplate.constraints',
    title: 'SaaS Boilerplate — Constraints & Safety',
    summary:
      'Internal guardrails for tenancy, RBAC, usage metering, and regeneration.',
    kind: 'reference',
    visibility: 'internal',
    route: '/docs/examples/saas-boilerplate/constraints',
    tags: ['saas', 'constraints', 'internal'],
    body: `## Constraints
- Tenant isolation and RBAC must remain explicit in spec; no implicit defaults in code.
- Events to emit: org.created, member.invited/accepted, project.created/updated, usage.recorded.
- Regeneration must not change billing/usage semantics without spec diffs.

## PII & Settings
- Mark PII (user emails, names) for redaction; keep settings scoped to org/member.
- Avoid leaking secrets/config in markdown/JSON presentations.

## Verification
- Add fixtures for usage recording and role changes.
- Ensure Audit/Notifications remain wired for invites/project updates.
- Use Feature Flags for new settings/billing fields; default safe/off.`,
  },
];

registerDocBlocks(saasBoilerplateDocBlocks);
