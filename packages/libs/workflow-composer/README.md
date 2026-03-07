# @contractspec/lib.workflow-composer

Website: https://contractspec.io/

Compose base `WorkflowSpec` definitions with tenant-, role-, and device-scoped extensions.

This package is designed for deterministic workflow personalization without duplicating core specs.

## Highlights

- Deterministic extension merge ordering with stable tie-breaking.
- Strict extension validation for anchors, transition endpoints, and duplicate injected step IDs.
- Safe hidden-step handling with entry-step protections.
- Metadata and annotations merge support on composed workflow outputs.
- Post-composition validation using `validateWorkflowSpec` from `@contractspec/lib.contracts-spec/workflow`.

## Usage

```ts
import { WorkflowComposer, approvalStepTemplate } from '@contractspec/lib.workflow-composer';

const composer = new WorkflowComposer();

composer.register({
  workflow: 'billing.invoiceApproval',
  tenantId: 'acme',
  priority: 10,
  metadata: {
    tenant: 'acme',
  },
  annotations: {
    source: 'tenant-extension',
  },
  customSteps: [
    {
      after: 'validate-invoice',
      inject: approvalStepTemplate({
        id: 'acme-legal-review',
        label: 'Legal Review (ACME)',
        description: 'Tenant-specific compliance step.',
      }),
      transitionTo: 'final-approval',
    },
  ],
});

const runtimeSpec = composer.compose({
  base: BaseInvoiceWorkflow,
  tenantId: 'acme',
});
```

## Notes

- Extensions are additive and validated before application.
- Composition throws with explicit error codes/messages when extension constraints are violated.
- Runtime behavior remains controlled by `@contractspec/lib.contracts-spec/workflow` runner and validation.
