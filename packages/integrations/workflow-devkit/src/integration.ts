import { defineIntegration } from '@contractspec/lib.contracts-integrations';
import { defineSchemaModel } from '@contractspec/lib.schema';

const WorkflowDevkitIntegrationSpecConfig = defineSchemaModel({
	name: 'WorkflowDevkitIntegrationConfig',
	description:
		'Managed configuration for @contractspec/integration.workflow-devkit.',
	fields: {},
});

const WorkflowDevkitIntegrationSpecSecrets = defineSchemaModel({
	name: 'WorkflowDevkitIntegrationSecret',
	description: 'Secret material for @contractspec/integration.workflow-devkit.',
	fields: {},
});

export const WorkflowDevkitIntegrationSpec = defineIntegration({
	meta: {
		...{
			key: 'integrations.workflow-devkit',
			version: '1.0.0',
			title: 'Workflow Devkit',
			description:
				'Workflow DevKit compiler and runtime bridges for ContractSpec workflows',
			domain: 'workflow-devkit',
			owners: ['@contractspec-core'],
			tags: ['package', 'integrations', 'workflow-devkit'],
			stability: 'experimental',
		},
		category: 'custom',
	},
	supportedModes: ['managed'],
	capabilities: {
		provides: [
			// Add capability refs here
		],
	},
	configSchema: { schema: WorkflowDevkitIntegrationSpecConfig, example: {} },
	secretSchema: { schema: WorkflowDevkitIntegrationSpecSecrets, example: {} },
	healthCheck: { method: 'ping', timeoutMs: 5000 },
});
