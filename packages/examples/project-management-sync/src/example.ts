import { defineExample } from '@contractspec/lib.contracts-spec/examples';

const ExamplesProjectManagementSyncExample = defineExample({
	meta: {
		key: 'examples.project-management-sync',
		version: '1.0.0',
		title: 'Project Management Sync',
		description:
			'Project management sync example: Linear, Jira, and Notion work item creation.',
		kind: 'template',
		visibility: 'experimental',
		stability: 'experimental',
		owners: ['@contractspec-core'],
		tags: ['package', 'examples', 'project-management-sync'],
	},
	surfaces: {
		templates: true,
		sandbox: { enabled: true, modes: ['playground', 'specs'] },
		studio: { enabled: false, installable: false },
		mcp: { enabled: false },
	},
	entrypoints: {
		packageName: '@contractspec/example.project-management-sync',
	},
});

export default ExamplesProjectManagementSyncExample;
export { ExamplesProjectManagementSyncExample };
