import { defineExample } from '@contractspec/lib.contracts-spec/examples';

const ExamplesServiceBusinessOsExample = defineExample({
	meta: {
		key: 'examples.service-business-os',
		version: '1.0.0',
		title: 'Service Business Os',
		description:
			'Service Business OS example (clients, quotes, jobs, invoices) for ContractSpec',
		kind: 'template',
		visibility: 'experimental',
		stability: 'experimental',
		owners: ['@contractspec-core'],
		tags: ['package', 'examples', 'service-business-os'],
	},
	surfaces: {
		templates: true,
		sandbox: { enabled: true, modes: ['playground', 'specs'] },
		studio: { enabled: false, installable: false },
		mcp: { enabled: false },
	},
	entrypoints: {
		packageName: '@contractspec/example.service-business-os',
	},
});

export default ExamplesServiceBusinessOsExample;
export { ExamplesServiceBusinessOsExample };
