import type { DocBlock } from '@contractspec/lib.contracts/docs';
import { registerDocBlocks } from '@contractspec/lib.contracts/docs';

export const personalization_workflow_composition_DocBlocks: DocBlock[] = [
  {
    id: 'docs.personalization.workflow-composition',
    title: 'Workflow Composition',
    summary:
      '`@contractspec/lib.workflow-composer` composes base WorkflowSpecs with tenant/role/device-specific extensions.',
    kind: 'reference',
    visibility: 'public',
    route: '/docs/personalization/workflow-composition',
    tags: ['personalization', 'workflow-composition'],
    body: "# Workflow Composition\n\n`@contractspec/lib.workflow-composer` composes base WorkflowSpecs with tenant/role/device-specific extensions.\n\n## Extensions\n\n```ts\nimport { WorkflowComposer } from '@contractspec/lib.workflow-composer';\nimport { approvalStepTemplate } from '@contractspec/lib.workflow-composer/templates';\n\nconst composer = new WorkflowComposer();\n\ncomposer.register({\n  workflow: 'billing.invoiceApproval',\n  tenantId: 'acme',\n  priority: 10,\n  customSteps: [\n    {\n      after: 'validate-invoice',\n      inject: approvalStepTemplate({\n        id: 'acme-legal-review',\n        label: 'Legal Review (ACME)',\n        description: 'Tenant-specific compliance step.',\n      }),\n      transitionTo: 'final-approval',\n    },\n  ],\n  hiddenSteps: ['internal-audit'],\n});\n```\n\n## Compose\n\n```ts\nconst runtimeSpec = composer.compose({\n  base: BaseInvoiceWorkflow,\n  tenantId: 'acme',\n});\n\nworkflowRunner.execute(runtimeSpec, ctx);\n```\n\nThe composer uses anchor references (`after`/`before`) to place injected steps and cleans up transitions when steps are hidden.\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n",
  },
];
registerDocBlocks(personalization_workflow_composition_DocBlocks);
