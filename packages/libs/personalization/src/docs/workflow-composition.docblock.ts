import type { DocBlock } from '@contractspec/lib.contracts-spec/docs';
import { registerDocBlocks } from '@contractspec/lib.contracts-spec/docs';

export const personalization_workflow_composition_DocBlocks: DocBlock[] = [
	{
		id: 'docs.personalization.workflow-composition',
		title: 'Workflow Composition',
		summary:
			'`@contractspec/lib.workflow-composer` composes base WorkflowSpecs with tenant/role/device-specific extensions, strict validation, deterministic merge ordering, metadata/annotation overlays, and orphan-graph protection for hidden-step rewrites.',
		kind: 'reference',
		visibility: 'public',
		route: '/docs/personalization/workflow-composition',
		tags: ['personalization', 'workflow-composition'],
		body: "# Workflow Composition\n\n`@contractspec/lib.workflow-composer` composes base WorkflowSpecs with tenant/role/device-specific extensions.\n\n## Extensions\n\n```ts\nimport { WorkflowComposer } from '@contractspec/lib.workflow-composer';\nimport { approvalStepTemplate } from '@contractspec/lib.workflow-composer/templates';\n\nconst composer = new WorkflowComposer();\n\ncomposer.register({\n  workflow: 'billing.invoiceApproval',\n  tenantId: 'acme',\n  priority: 10,\n  customSteps: [\n    {\n      after: 'validate-invoice',\n      inject: approvalStepTemplate({\n        id: 'acme-legal-review',\n        label: 'Legal Review (ACME)',\n        description: 'Tenant-specific compliance step.',\n      }),\n      transitionFrom: 'validate-invoice',\n      transitionTo: 'final-approval',\n    },\n  ],\n  hiddenSteps: ['internal-audit'],\n  metadata: { rollout: 'tenant-acme' },\n});\n```\n\n## Compose\n\n```ts\nconst runtimeSpec = composer.compose({\n  base: BaseInvoiceWorkflow,\n  tenantId: 'acme',\n});\n\nworkflowRunner.execute(runtimeSpec, ctx);\n```\n\n## Guarantees\n\n- Extensions are normalized in deterministic priority order before composition.\n- Duplicate injected step ids, invalid anchors, and invalid transition endpoints are rejected early.\n- Hidden-step rewrites are validated so remaining steps stay reachable from the workflow entry step.\n- `metadata` and `annotations` overlays are merged into the composed runtime workflow for downstream observability and rollout tracing.\n\nThis keeps tenant overlays additive, auditable, and replay-safe.\n",
	},
];
registerDocBlocks(personalization_workflow_composition_DocBlocks);
