import { defineExample } from '@contractspec/lib.contracts-spec/examples';

const ExamplesLearningJourneyUiCoachingExample = defineExample({
	meta: {
		key: 'examples.learning-journey-ui-coaching',
		version: '1.0.0',
		title: 'Learning Journey Ui Coaching',
		description:
			'Contextual coaching UI with tip cards and engagement tracking.',
		kind: 'template',
		visibility: 'experimental',
		stability: 'experimental',
		owners: ['@contractspec-core'],
		tags: ['package', 'examples', 'learning-journey-ui-coaching'],
	},
	surfaces: {
		templates: true,
		sandbox: { enabled: true, modes: ['playground', 'specs'] },
		studio: { enabled: false, installable: false },
		mcp: { enabled: false },
	},
	entrypoints: {
		packageName: '@contractspec/example.learning-journey-ui-coaching',
	},
});

export default ExamplesLearningJourneyUiCoachingExample;
export { ExamplesLearningJourneyUiCoachingExample };
