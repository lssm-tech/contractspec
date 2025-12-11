import { registerDocBlocks } from '@lssm/lib.contracts/docs';
import type { DocBlock } from '@lssm/lib.contracts/docs';

const templateQuickstarts: DocBlock[] = [
  {
    id: 'docs.templates.todos-app.quickstart',
    title: 'To-dos App Quickstart',
    summary: 'Seed and explore the to-dos starter with CRUD and priorities.',
    route: '/docs/templates/todos-app',
    visibility: 'public',
    kind: 'usage',
    tags: ['template', 'quickstart', 'todos'],
    body: `## Goal
- Explore the to-dos template and regenerate UI/API from the spec.

## Steps
1) Open Studio Sandbox → Templates → "To-dos List App".
2) Seed the template (preloads categories and tasks) and open the Builder.
3) Tweak the spec (e.g., add a priority enum value) and regenerate; forms and lists update automatically.

## Notes
- Spec-first: edit the spec, not generated code.
- Multi-surface: tasks/entities drive UI and API.`,
  },
  {
    id: 'docs.templates.messaging-app.quickstart',
    title: 'Messaging App Quickstart',
    summary:
      'Conversation roster with messages, typing indicators, and read receipts.',
    route: '/docs/templates/messaging-app',
    visibility: 'public',
    kind: 'usage',
    tags: ['template', 'quickstart', 'messaging'],
    body: `## Goal
- Spin up the messaging template and validate conversation/message flows.

## Steps
1) In Sandbox Templates, select "Messaging Application".
2) Seed the template to create sample conversations and participants.
3) Regenerate after editing the message schema (e.g., add attachments) to see UI + API update.

## Notes
- Uses events for read/typing indicators.
- Keep payloads PII-safe; use policy.pii in presentations when needed.`,
  },
  {
    id: 'docs.templates.recipe-app-i18n.quickstart',
    title: 'Recipe App (i18n) Quickstart',
    summary:
      'Localized recipe browser with categories, ingredients, and instructions.',
    route: '/docs/templates/recipe-app-i18n',
    visibility: 'public',
    kind: 'usage',
    tags: ['template', 'quickstart', 'recipes', 'i18n'],
    body: `## Goal
- Demonstrate an i18n-ready content app with schema-driven lists and details.

## Steps
1) Pick "Recipe App (i18n)" in Sandbox Templates.
2) Seed sample recipes; open Markdown mode to view schema-driven docs.
3) Change the schema (e.g., add nutrition fields) and regenerate to update forms/views.

## Notes
- Keep localized strings external; descriptors carry keys/defaults only.
- Use presentation targets react/markdown to preview both surfaces.`,
  },
  {
    id: 'docs.templates.saas-boilerplate.quickstart',
    title: 'SaaS Boilerplate Quickstart',
    summary:
      'Multi-tenant SaaS starter with orgs, projects, settings, and usage.',
    route: '/docs/templates/saas-boilerplate',
    visibility: 'public',
    kind: 'usage',
    tags: ['template', 'quickstart', 'saas'],
    body: `## Goal
- Stand up the SaaS base: orgs, members, projects, settings, and billing usage.

## Steps
1) Choose "SaaS Boilerplate" in Sandbox Templates.
2) Seed sample org/projects; inspect RBAC policies in the spec.
3) Edit the Project schema (e.g., add an env label) and regenerate to sync API/UI/events.

## Notes
- Uses Identity/RBAC, Audit Trail, Notifications, and Usage/Metering.
- Keep tenant isolation in mind; schemas are multi-tenant by default.`,
  },
  {
    id: 'docs.templates.crm-pipeline.quickstart',
    title: 'CRM Pipeline Quickstart',
    summary:
      'Deals, pipeline stages, contacts, companies, and tasks with Kanban.',
    route: '/docs/templates/crm-pipeline',
    visibility: 'public',
    kind: 'usage',
    tags: ['template', 'quickstart', 'crm'],
    body: `## Goal
- Explore the CRM template with deals, stages, contacts, and tasks.

## Steps
1) Select "CRM Pipeline" in Sandbox Templates.
2) Seed pipeline + sample deals; open Builder to view stage-driven UI.
3) Modify the Deal schema or stages and regenerate to see forms/kanban update.

## Notes
- Emits events (deal.created, stage.moved, task.completed) for analytics/notifications.
- Keep required fields in the spec to enforce validation across surfaces.`,
  },
  {
    id: 'docs.templates.agent-console.quickstart',
    title: 'Agent Console Quickstart',
    summary: 'AI agent ops: tools, agents, runs, logs, and metrics.',
    route: '/docs/templates/agent-console',
    visibility: 'public',
    kind: 'usage',
    tags: ['template', 'quickstart', 'ai', 'agents'],
    body: `## Goal
- Inspect tool/agent/run specs and see multi-surface generation.

## Steps
1) Open "Agent Console" template in Sandbox.
2) Seed sample tools/agents/runs; view dashboards/presentations.
3) Add a tool schema or run metric in the spec and regenerate; UI + API align automatically.

## Notes
- Uses Jobs, Audit Trail, Notifications for run lifecycle.
- Keep tool schemas strict to avoid unsafe tool calls.`,
  },
  {
    id: 'docs.templates.workflow-system.quickstart',
    title: 'Workflow / Approval Quickstart',
    summary: 'State-machine-driven workflows with role-based approvals.',
    route: '/docs/templates/workflow-system',
    visibility: 'public',
    kind: 'usage',
    tags: ['template', 'quickstart', 'workflow'],
    body: `## Goal
- Configure and test approval workflows with role-gated transitions.

## Steps
1) Pick "Workflow / Approval System" in Sandbox Templates.
2) Seed sample definitions/instances; inspect state machine in the spec.
3) Change allowed transitions or add an approval step; regenerate to update UI/actions.

## Notes
- Integrates RBAC, Audit Trail, Notifications, and Feature Flags for rollouts.
- Keep state changes auditable; emit events for approvals and rejections.`,
  },
  {
    id: 'docs.templates.marketplace.quickstart',
    title: 'Marketplace Quickstart',
    summary:
      'Two-sided marketplace with stores, products, orders, payouts, reviews.',
    route: '/docs/templates/marketplace',
    visibility: 'public',
    kind: 'usage',
    tags: ['template', 'quickstart', 'marketplace'],
    body: `## Goal
- Demonstrate provider/client flows, orders, and payouts.

## Steps
1) Choose "Marketplace" template in Sandbox.
2) Seed sample stores/products/orders; browse dashboards.
3) Adjust commission or review schema and regenerate to keep UI/API/events consistent.

## Notes
- Uses Files for media, Metering for usage, Audit/Notifications for lifecycle events.
- Be explicit about payout rules and validation in the spec.`,
  },
  {
    id: 'docs.templates.integration-hub.quickstart',
    title: 'Integration Hub Quickstart',
    summary:
      'Integration center with connections, sync configs, field mappings, logs.',
    route: '/docs/templates/integration-hub',
    visibility: 'public',
    kind: 'usage',
    tags: ['template', 'quickstart', 'integrations'],
    body: `## Goal
- Model connectors, connections, and sync jobs with mappings.

## Steps
1) Select "Integration Hub" in Sandbox Templates.
2) Seed sample integrations/connections; inspect sync config + mappings.
3) Add a mapping field or sync job type in the spec and regenerate; adapters stay aligned.

## Notes
- Uses Jobs for scheduled syncs, Files for payloads, Flags for staged rollouts.
- Keep provider-agnostic schemas; map external fields declaratively.`,
  },
  {
    id: 'docs.templates.learning-journey-studio-onboarding.quickstart',
    title: 'Learning Journey — Studio Getting Started',
    summary:
      'Guide new Studio users through template spawn, spec edit, regeneration, playground, and evolution.',
    route: '/docs/templates/learning-journey-studio-onboarding',
    visibility: 'public',
    kind: 'usage',
    tags: ['template', 'quickstart', 'learning', 'onboarding'],
    body: `## Goal
- Complete the Studio onboarding journey and see progress tracked automatically.

## Steps
1) Open Sandbox Templates → "Learning Journey — Studio Getting Started".
2) Seed the sandbox; events: template.instantiated, spec.changed, regeneration.completed.
3) Start Playground session and run Evolution once; observe steps complete in progress widget.

## Notes
- Tracks use learning.onboarding.* contracts; events are tied to Studio actions.
- XP/streak bonuses apply when completed within the streak window.`,
  },
  {
    id: 'docs.templates.learning-journey-platform-tour.quickstart',
    title: 'Learning Journey — Platform Primitives Tour',
    summary:
      'Hands-on tour across identity, audit, notifications, jobs, feature flags, files, and metering.',
    route: '/docs/templates/learning-journey-platform-tour',
    visibility: 'public',
    kind: 'usage',
    tags: ['template', 'quickstart', 'learning', 'platform'],
    body: `## Goal
- Touch each cross-cutting module once with event-driven completion.

## Steps
1) Sandbox Template → "Learning Journey — Platform Primitives Tour".
2) Perform actions that emit: org.member.added, audit_log.created, notification.sent, job.completed, flag.toggled, attachment.attached, usage.recorded.
3) View progress widget to confirm step completion and XP.

## Notes
- Uses learning.onboarding.recordEvent bound to module events.
- Great for platform teams validating cross-module wiring.`,
  },
  {
    id: 'docs.templates.learning-journey-crm-onboarding.quickstart',
    title: 'Learning Journey — CRM First Win',
    summary:
      'Onboard CRM users from empty pipeline to first closed-won deal with follow-up.',
    route: '/docs/templates/learning-journey-crm-onboarding',
    visibility: 'public',
    kind: 'usage',
    tags: ['template', 'quickstart', 'learning', 'crm'],
    body: `## Goal
- Drive users to first closed-won deal and follow-up task.

## Steps
1) Sandbox Template → "Learning Journey — CRM First Win".
2) Emit events: pipeline.created, contact.created, deal.created, deal.moved, deal.won, task.completed (follow_up).
3) Confirm track completion and XP in progress widget.

## Notes
- Depends on CRM Pipeline example events.
- Badge and streak bonus apply when finished within the window.`,
  },
  {
    id: 'docs.templates.analytics-dashboard.quickstart',
    title: 'Analytics Dashboard Quickstart',
    summary: 'Dashboards, widgets, query builder, and scheduled reports.',
    route: '/docs/templates/analytics-dashboard',
    visibility: 'public',
    kind: 'usage',
    tags: ['template', 'quickstart', 'analytics'],
    body: `## Goal
- Build and view dashboards sourced from event/usage data.

## Steps
1) Pick "Analytics Dashboard" in Sandbox.
2) Seed sample dashboards/widgets; run example queries.
3) Add a widget/query schema change and regenerate; presentations update accordingly.

## Notes
- Uses Metering for usage, Audit/Notifications for report delivery.
- Ensure query inputs are validated in the spec to avoid unsafe queries.`,
  },
  {
    id: 'docs.templates.service-business-os.quickstart',
    title: 'Service Business OS Quickstart',
    summary:
      'Clients → quotes → jobs → invoices → payments for field services.',
    route: '/docs/templates/service-business-os',
    visibility: 'public',
    kind: 'usage',
    tags: ['template', 'quickstart', 'services'],
    body: `## Goal
- Walk the service lifecycle from quote to payment.

## Steps
1) In Sandbox Templates, select "Service Business OS".
2) (No auto-seed yet) Create a client, quote, job, and invoice via the spec-driven UI.
3) Regenerate after adjusting quote/job/invoice fields to keep flows consistent.

## Notes
- Uses Files (attachments), Jobs (reminders), Audit/Notifications for lifecycle events.
- Keep payment/quote rules explicit in the spec to avoid drift.`,
  },
  {
    id: 'docs.templates.team-hub.quickstart',
    title: 'Team Hub Quickstart',
    summary: 'Spaces, tasks, rituals, and announcements with ceremonies.',
    route: '/docs/templates/team-hub',
    visibility: 'public',
    kind: 'usage',
    tags: ['template', 'quickstart', 'collaboration'],
    body: `## Goal
- Run internal rituals and tasks in a shared space.

## Steps
1) Pick "Team Hub" template.
2) (No auto-seed yet) Create a space, add tasks, schedule rituals, post announcements.
3) Edit task/ritual schemas (e.g., add priority or cadence) and regenerate; boards/calendars refresh.

## Notes
- Uses Jobs for ritual scheduling, Notifications for reminders, Audit Trail for changes.
- Respect a11y: ensure announcements carry titles/descriptions.`,
  },
  {
    id: 'docs.templates.wealth-snapshot.quickstart',
    title: 'Wealth Snapshot Quickstart',
    summary: 'Accounts, assets, liabilities, goals, and net-worth snapshots.',
    route: '/docs/templates/wealth-snapshot',
    visibility: 'public',
    kind: 'usage',
    tags: ['template', 'quickstart', 'finance'],
    body: `## Goal
- Capture a simple personal/household wealth view.

## Steps
1) Select "Wealth Snapshot" template.
2) (No auto-seed yet) Add accounts/assets/liabilities/goals; view dashboard.
3) Regenerate after adding indicators or goal fields to keep dashboards aligned.

## Notes
- Emits events for assets/liabilities/goals; ensure PII redaction where needed.
- Keep currency/units explicit in the spec for consistency.`,
  },
];

registerDocBlocks(templateQuickstarts);
