import type { DocBlock } from '@lssm/lib.contracts/docs';
import { registerDocBlocks } from '@lssm/lib.contracts/docs';

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
- Reminder jobs can be scheduled via @lssm/lib.jobs for pending approvals.

## UI / Presentations

- Dashboard, definition list/editor, instance detail with action buttons derived from state machine.
- Templates registered in Studio Template Registry under \`workflow-system\`.

## Notes

- Keep transitions declarative to enable safe regeneration; role guards live in spec.
- Use Notification Center for approval requests and outcomes; attach files via Files module if needed.
`,
  },
];

registerDocBlocks(workflowSystemDocBlocks);
