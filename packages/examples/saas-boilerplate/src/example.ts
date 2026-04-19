import { defineExample } from '@contractspec/lib.contracts-spec/examples';

const ExamplesSaasBoilerplateExample = defineExample({
	meta: {
		key: 'examples.saas-boilerplate',
		version: '1.0.0',
		title: 'Saas Boilerplate',
		description: 'SaaS Boilerplate - Users, Orgs, Projects, Billing, Settings',
		kind: 'template',
		visibility: 'experimental',
		stability: 'experimental',
		owners: ['@contractspec-core'],
		tags: ['package', 'examples', 'saas-boilerplate'],
	},
	surfaces: {
		templates: true,
		sandbox: { enabled: true, modes: ['playground', 'specs'] },
		studio: { enabled: false, installable: false },
		mcp: { enabled: false },
	},
	entrypoints: {
		packageName: '@contractspec/example.saas-boilerplate',
	},
});

export default ExamplesSaasBoilerplateExample;
export { ExamplesSaasBoilerplateExample };
