import { defineFeature } from '@contractspec/lib.contracts-spec/features';

export const WorkflowComposerFeature = defineFeature({
	meta: {
		key: 'libs.workflow-composer',
		version: '1.0.0',
		title: 'Workflow Composer',
		description: 'Tenant-aware workflow composition helpers for ContractSpec.',
		domain: 'workflow-composer',
		owners: ['@contractspec-core'],
		tags: ['package', 'libs', 'workflow-composer'],
		stability: 'experimental',
	},
});
