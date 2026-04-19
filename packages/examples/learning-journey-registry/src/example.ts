import { defineExample } from '@contractspec/lib.contracts-spec/examples';

const ExamplesLearningJourneyRegistryExample = defineExample({
	meta: {
		key: 'examples.learning-journey-registry',
		version: '1.0.0',
		title: 'Learning Journey Registry',
		description: 'Registry that aggregates learning journey example tracks.',
		kind: 'template',
		visibility: 'experimental',
		stability: 'experimental',
		owners: ['@contractspec-core'],
		tags: ['package', 'examples', 'learning-journey-registry'],
	},
	surfaces: {
		templates: true,
		sandbox: { enabled: true, modes: ['playground', 'specs'] },
		studio: { enabled: false, installable: false },
		mcp: { enabled: false },
	},
	entrypoints: {
		packageName: '@contractspec/example.learning-journey-registry',
	},
});

export default ExamplesLearningJourneyRegistryExample;
export { ExamplesLearningJourneyRegistryExample };
