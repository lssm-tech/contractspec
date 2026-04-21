import { defineExample } from '@contractspec/lib.contracts-spec/examples';

const ExamplesCrmPipelineExample = defineExample({
	meta: {
		key: 'examples.crm-pipeline',
		version: '1.0.0',
		title: 'Crm Pipeline',
		description: 'CRM Pipeline - Contacts, Companies, Deals, Tasks',
		kind: 'template',
		visibility: 'experimental',
		stability: 'experimental',
		owners: ['@contractspec-core'],
		tags: ['package', 'examples', 'crm-pipeline'],
	},
	surfaces: {
		templates: true,
		sandbox: { enabled: true, modes: ['playground', 'specs'] },
		studio: { enabled: false, installable: false },
		mcp: { enabled: false },
	},
	entrypoints: {
		packageName: '@contractspec/example.crm-pipeline',
	},
});

export default ExamplesCrmPipelineExample;
export { ExamplesCrmPipelineExample };
