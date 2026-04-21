import { defineExample } from '@contractspec/lib.contracts-spec/examples';

const ExamplesPocketFamilyOfficeExample = defineExample({
	meta: {
		key: 'examples.pocket-family-office',
		version: '1.0.0',
		title: 'Pocket Family Office',
		description:
			'Pocket Family Office example - personal finance automation with open banking',
		kind: 'template',
		visibility: 'experimental',
		stability: 'experimental',
		owners: ['@contractspec-core'],
		tags: ['package', 'examples', 'pocket-family-office'],
	},
	surfaces: {
		templates: true,
		sandbox: { enabled: true, modes: ['playground', 'specs'] },
		studio: { enabled: false, installable: false },
		mcp: { enabled: false },
	},
	entrypoints: {
		packageName: '@contractspec/example.pocket-family-office',
	},
});

export default ExamplesPocketFamilyOfficeExample;
export { ExamplesPocketFamilyOfficeExample };
