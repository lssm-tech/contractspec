import { defineExample } from '@contractspec/lib.contracts-spec/examples';

const ExamplesLearningJourneyPlatformTourExample = defineExample({
	meta: {
		key: 'examples.learning-journey-platform-tour',
		version: '1.0.0',
		title: 'Learning Journey Platform Tour',
		description:
			'Learning journey track covering ContractSpec platform primitives.',
		kind: 'template',
		visibility: 'experimental',
		stability: 'experimental',
		owners: ['@contractspec-core'],
		tags: ['package', 'examples', 'learning-journey-platform-tour'],
	},
	surfaces: {
		templates: true,
		sandbox: { enabled: true, modes: ['playground', 'specs'] },
		studio: { enabled: false, installable: false },
		mcp: { enabled: false },
	},
	entrypoints: {
		packageName: '@contractspec/example.learning-journey-platform-tour',
	},
});

export default ExamplesLearningJourneyPlatformTourExample;
export { ExamplesLearningJourneyPlatformTourExample };
