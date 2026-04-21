import { defineExample } from '@contractspec/lib.contracts-spec/examples';

const ExamplesPersonalizationExample = defineExample({
	meta: {
		key: 'examples.personalization',
		version: '1.0.0',
		title: 'Personalization',
		description:
			'Personalization examples: behavior tracking, overlay customization, workflow extension.',
		kind: 'template',
		visibility: 'experimental',
		stability: 'experimental',
		owners: ['@contractspec-core'],
		tags: ['package', 'examples', 'personalization'],
	},
	surfaces: {
		templates: true,
		sandbox: { enabled: true, modes: ['playground', 'specs'] },
		studio: { enabled: false, installable: false },
		mcp: { enabled: false },
	},
	entrypoints: {
		packageName: '@contractspec/example.personalization',
	},
});

export default ExamplesPersonalizationExample;
export { ExamplesPersonalizationExample };
