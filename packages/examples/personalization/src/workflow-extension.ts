import type { WorkflowSpec } from '@lssm/lib.contracts/workflow/spec';
import { WorkflowComposer } from '@lssm/lib.workflow-composer';
import { Logger, LogLevel } from '@lssm/lib.logger';

const logger = new Logger({
  level: process.env.NODE_ENV === 'production' ? LogLevel.INFO : LogLevel.DEBUG,
  environment: process.env.NODE_ENV || 'development',
  enableColors: process.env.NODE_ENV !== 'production',
});

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
    transitions: [{ from: 'validate-invoice', to: 'final-approval' }],
  },
};

export function composeTenantWorkflowExample(): WorkflowSpec {
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

  return composer.compose({
    base: BaseWorkflow,
    tenantId: 'acme',
  });
}

export function logTenantWorkflowSteps(workflow: WorkflowSpec): void {
  logger.info('Tenant workflow composed', {
    workflow: workflow.meta.name,
    steps: workflow.definition.steps.map((step) => step.id),
  });
}


