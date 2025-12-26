# @lssm/example.workflow-system

Website: https://contractspec.io/


A comprehensive workflow and approval system example demonstrating ContractSpec principles.

## Features

- **State Machine Engine**: Define workflows as state machines with typed transitions
- **Role-Based Approvals**: Configure approval chains with multiple modes (ANY, ALL, MAJORITY, SEQUENTIAL)
- **Delegation**: Allow approvers to delegate to others
- **Escalation**: Automatic escalation on timeout
- **Feature Flag Integration**: Control workflow availability via feature flags
- **Full Audit Trail**: Track all workflow actions and decisions
- **Multi-Surface Presentations**: React components + Markdown renderers

## Entities

### Workflow Definition
- `WorkflowDefinition` - Blueprint for a workflow
- `WorkflowStep` - Steps within a workflow (START, APPROVAL, TASK, CONDITION, PARALLEL, WAIT, ACTION, END)

### Workflow Instance
- `WorkflowInstance` - Running instance of a workflow
- `StepExecution` - Execution record for each step

### Approval
- `ApprovalRequest` - Pending approval request
- `ApprovalComment` - Comments on approvals

## Contracts

### Workflow Definition Management
- `workflow.definition.create` - Create a new workflow
- `workflow.definition.update` - Update workflow
- `workflow.step.add` - Add step to workflow
- `workflow.definition.publish` - Activate workflow
- `workflow.definition.list` - List workflows
- `workflow.definition.get` - Get workflow details

### Workflow Instance Operations
- `workflow.instance.start` - Start a new workflow
- `workflow.instance.transition` - Transition to next step
- `workflow.instance.pause` - Pause workflow
- `workflow.instance.resume` - Resume workflow
- `workflow.instance.cancel` - Cancel workflow
- `workflow.instance.list` - List instances
- `workflow.instance.get` - Get instance details

### Approval Operations
- `workflow.approval.decide` - Submit approval decision
- `workflow.approval.delegate` - Delegate to another user
- `workflow.approval.comment.add` - Add comment
- `workflow.approval.list.mine` - List my pending approvals
- `workflow.approval.get` - Get approval details

## State Machine

The workflow engine uses a state machine model where:

1. Each step defines available actions and their target steps
2. Transitions are validated against:
   - Current workflow status
   - User roles (role-based access control)
   - Step-specific conditions
3. Actions trigger events for audit trail and notifications

Example step definition:

```typescript
{
  key: 'manager_approval',
  type: 'APPROVAL',
  transitions: {
    approve: 'finance_review',
    reject: 'rejected',
    request_changes: 'revision_needed'
  },
  approvalMode: 'ANY',
  approverRoles: ['manager', 'director'],
  timeoutSeconds: 86400, // 24 hours
}
```

## Events

- `workflow.definition.created/updated/published`
- `workflow.step.added`
- `workflow.instance.started/completed/cancelled/paused/resumed/failed/timeout`
- `workflow.step.entered/exited`
- `workflow.approval.requested/decided/delegated/escalated`

## Usage

```typescript
import { 
  StartWorkflowContract,
  TransitionWorkflowContract,
  workflowSystemSchemaContribution 
} from '@lssm/example.workflow-system';

// Start a workflow
const instance = await executeContract(StartWorkflowContract, {
  workflowKey: 'purchase_approval',
  contextData: { amount: 5000, vendor: 'ACME Corp' },
  referenceId: 'PO-12345',
  referenceType: 'PurchaseOrder',
});

// Make a transition
const result = await executeContract(TransitionWorkflowContract, {
  instanceId: instance.id,
  action: 'approve',
  comment: 'Approved for standard purchase',
});
```

## Dependencies

- `@lssm/lib.identity-rbac` - User identity and roles
- `@lssm/lib.feature-flags` - Feature flag evaluation
- `@lssm/module.audit-trail` - Action auditing
- `@lssm/module.notifications` - Approval notifications
