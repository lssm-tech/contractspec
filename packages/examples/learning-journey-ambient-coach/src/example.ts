import { defineExample } from '@contractspec/lib.contracts-spec/examples';

const ExamplesLearningJourneyAmbientCoachExample = defineExample({
	meta: {
		key: 'examples.learning-journey-ambient-coach',
		version: '1.0.0',
		title: 'Learning Journey Ambient Coach',
		description:
			'Ambient coach learning journey example with contextual tips and follow-up actions.',
		kind: 'template',
		visibility: 'experimental',
		stability: 'experimental',
		owners: ['@contractspec-core'],
		tags: ['package', 'examples', 'learning-journey-ambient-coach'],
	},
	surfaces: {
		templates: true,
		sandbox: { enabled: true, modes: ['playground', 'specs'] },
		studio: { enabled: false, installable: false },
		mcp: { enabled: false },
	},
	entrypoints: {
		packageName: '@contractspec/example.learning-journey-ambient-coach',
	},
});

export default ExamplesLearningJourneyAmbientCoachExample;
export { ExamplesLearningJourneyAmbientCoachExample };
