import { defineExample } from '@contractspec/lib.contracts-spec/examples';

const ExamplesLearningJourneyUiSharedExample = defineExample({
	meta: {
		key: 'examples.learning-journey-ui-shared',
		version: '1.0.0',
		title: 'Learning Journey Ui Shared',
		description:
			'Shared UI components and hooks for learning journey mini-apps.',
		kind: 'template',
		visibility: 'experimental',
		stability: 'experimental',
		owners: ['@contractspec-core'],
		tags: ['package', 'examples', 'learning-journey-ui-shared'],
	},
	surfaces: {
		templates: true,
		sandbox: { enabled: true, modes: ['playground', 'specs'] },
		studio: { enabled: false, installable: false },
		mcp: { enabled: false },
	},
	entrypoints: {
		packageName: '@contractspec/example.learning-journey-ui-shared',
	},
});

export default ExamplesLearningJourneyUiSharedExample;
export { ExamplesLearningJourneyUiSharedExample };
