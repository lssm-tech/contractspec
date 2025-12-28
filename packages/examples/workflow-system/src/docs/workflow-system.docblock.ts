import type { DocBlock } from '@contractspec/lib.contracts/docs';
import { registerDocBlocks } from '@contractspec/lib.contracts/docs';

const workflowSystemDocBlocks: DocBlock[] = [
  {
    id: 'docs.examples.workflow-system',
    title: 'Workflow / Approval System',
    summary:
      'Reference app showing state-machine driven approvals with RBAC, audit trail, notifications, and jobs.',
    kind: 'reference',
    visibility: 'public',
    route: '/docs/examples/workflow-system',
    tags: ['workflow', 'approval', 'state-machine', 'rbac'],
    body: `## Entities

- WorkflowDefinition, WorkflowStep, WorkflowInstance, Approval.
- State machine expressed in \`src/state-machine\` with allowed transitions and role gates.

## Contracts

- \`workflow.definition.create\`, \`workflow.instance.start\`, \`workflow.step.approve\`, \`workflow.step.reject\`, \`workflow.instance.comment\`.
- Policies enforced via Identity/RBAC module; audit trail emitted on each transition.

## Events & Jobs

- Emits \`workflow.instance.started\`, \`workflow.step.completed\`, \`workflow.step.rejected\`, \`workflow.instance.finished\`.
- Reminder jobs can be scheduled via @contractspec/lib.jobs for pending approvals.

## UI / Presentations

- Dashboard, definition list/editor, instance detail with action buttons derived from state machine.
- Templates registered in Studio Template Registry under \`workflow-system\`.

## Notes

- Keep transitions declarative to enable safe regeneration; role guards live in spec.
- Use Notification Center for approval requests and outcomes; attach files via Files module if needed.
`,
  },
  {
    id: 'docs.examples.workflow-system.goal',
    title: 'Workflow System — Goal',
    summary:
      'Why the workflow/approval template exists and outcomes it targets.',
    kind: 'goal',
    visibility: 'public',
    route: '/docs/examples/workflow-system/goal',
    tags: ['workflow', 'goal'],
    body: `## Why it matters
- Provides a regenerable, role-gated approval engine using declarative state machines.
- Keeps workflow rules consistent across UI/API/events with auditability.

## Business/Product goal
- Enable approvals with clear transitions, reminders, and notifications.
- Support compliance via Audit Trail and Feature Flags for staged changes.

## Success criteria
- State changes are declarative and regenerate cleanly.
- Every transition emits auditable events and respects RBAC guards.`,
  },
  {
    id: 'docs.examples.workflow-system.usage',
    title: 'Workflow System — Usage',
    summary: 'How to configure workflows, transitions, and regenerate safely.',
    kind: 'usage',
    visibility: 'public',
    route: '/docs/examples/workflow-system/usage',
    tags: ['workflow', 'usage'],
    body: `## Setup
1) Define WorkflowDefinition steps and allowed transitions with role gates in spec.
2) Seed sample workflows/instances (if provided) or create via UI; enable reminders via Jobs.

## Extend & regenerate
1) Add steps/transitions or approval conditions in spec; include PII paths if comments/files.
2) Regenerate to sync UI action buttons and API/state machine behavior.
3) Use Feature Flags to trial new transitions or escalation rules.

## Guardrails
- Emit events for every transition; log to Audit Trail.
- Use Notifications for approvals/rejections; schedule reminders for pending steps.
- Keep transitions declarative; avoid imperative branching in handlers.`,
  },
  {
    id: 'docs.examples.workflow-system.constraints',
    title: 'Workflow System — Constraints & Safety',
    summary:
      'Internal guardrails for state machines, RBAC, and regeneration semantics.',
    kind: 'reference',
    visibility: 'internal',
    route: '/docs/examples/workflow-system/constraints',
    tags: ['workflow', 'constraints', 'internal'],
    body: `## Constraints
- State machine (steps/transitions) must stay declarative in spec; no hidden code paths.
- Events to emit: instance.started, step.completed/rejected, instance.finished.
- Regeneration must not change approval logic without explicit spec diff.

## PII & Compliance
- Mark any PII in comments/attachments; redact in markdown/JSON.
- Ensure Audit Trail captures every transition; Notifications for approvals/rejections.

## Verification
- Add fixtures for transition changes and role gates.
- Validate reminders (Jobs) stay aligned with pending states after regeneration.
- Use Feature Flags for new transitions/escalation rules; default safe/off.`,
  },
];

registerDocBlocks(workflowSystemDocBlocks);
