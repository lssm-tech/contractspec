import { defineExample } from '@contractspec/lib.contracts-spec/examples';

const ExamplesLearningJourneyUiOnboardingExample = defineExample({
	meta: {
		key: 'examples.learning-journey-ui-onboarding',
		version: '1.0.0',
		title: 'Learning Journey Ui Onboarding',
		description: 'Developer onboarding UI with checklists and journey maps.',
		kind: 'template',
		visibility: 'experimental',
		stability: 'experimental',
		owners: ['@contractspec-core'],
		tags: ['package', 'examples', 'learning-journey-ui-onboarding'],
	},
	surfaces: {
		templates: true,
		sandbox: { enabled: true, modes: ['playground', 'specs'] },
		studio: { enabled: false, installable: false },
		mcp: { enabled: false },
	},
	entrypoints: {
		packageName: '@contractspec/example.learning-journey-ui-onboarding',
	},
});

export default ExamplesLearningJourneyUiOnboardingExample;
export { ExamplesLearningJourneyUiOnboardingExample };
