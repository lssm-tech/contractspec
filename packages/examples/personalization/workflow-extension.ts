import type { WorkflowSpec } from '@lssm/lib.contracts/workflow/spec';
import { WorkflowComposer } from '@lssm/lib.workflow-composer';

const BaseWorkflow: WorkflowSpec = {
  meta: {
    name: 'billing.invoiceApproval',
    version: 1,
    title: 'Invoice Approval',
    owners: [],
    tags: [],
    description: '',
    domain: 'billing',
    stability: 'stable',
  },
  definition: {
    steps: [
      { id: 'validate-invoice', type: 'automation', label: 'Validate Invoice' },
      { id: 'final-approval', type: 'human', label: 'Final Approval' },
    ],
    transitions: [
      { from: 'validate-invoice', to: 'final-approval' },
    ],
  },
};

const composer = new WorkflowComposer();
composer.register({
  workflow: 'billing.invoiceApproval',
  tenantId: 'acme',
  customSteps: [
    {
      after: 'validate-invoice',
      inject: {
        id: 'acme-legal',
        type: 'human',
        label: 'ACME Legal Review',
      },
      transitionTo: 'final-approval',
    },
  ],
});

const tenantWorkflow = composer.compose({
  base: BaseWorkflow,
  tenantId: 'acme',
});

console.log(tenantWorkflow.definition.steps.map((step) => step.id));






















