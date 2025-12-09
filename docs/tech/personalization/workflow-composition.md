# Workflow Composition

`@lssm/lib.workflow-composer` composes base WorkflowSpecs with tenant/role/device-specific extensions.

## Extensions

```ts
import { WorkflowComposer } from '@lssm/lib.workflow-composer';
import { approvalStepTemplate } from '@lssm/lib.workflow-composer/templates';

const composer = new WorkflowComposer();

composer.register({
  workflow: 'billing.invoiceApproval',
  tenantId: 'acme',
  priority: 10,
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
  hiddenSteps: ['internal-audit'],
});
```

## Compose

```ts
const runtimeSpec = composer.compose({
  base: BaseInvoiceWorkflow,
  tenantId: 'acme',
});

workflowRunner.execute(runtimeSpec, ctx);
```

The composer uses anchor references (`after`/`before`) to place injected steps and cleans up transitions when steps are hidden.






















