import { defineFeature } from '@contractspec/lib.contracts-spec/features';

export const WorkspaceFeature = defineFeature({
	meta: {
		key: 'modules.workspace',
		version: '1.0.0',
		title: 'Workspace',
		description: 'Workspace discovery and management module',
		domain: 'workspace',
		owners: ['@contractspec-core'],
		tags: ['package', 'modules', 'workspace'],
		stability: 'experimental',
	},
});
