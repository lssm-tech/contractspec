import { defineExample } from '@contractspec/lib.contracts-spec/examples';

const ExamplesLearningJourneyStudioOnboardingExample = defineExample({
	meta: {
		key: 'examples.learning-journey-studio-onboarding',
		version: '1.0.0',
		title: 'Learning Journey Studio Onboarding',
		description:
			'Learning journey track for first 30 minutes in ContractSpec Studio.',
		kind: 'template',
		visibility: 'experimental',
		stability: 'experimental',
		owners: ['@contractspec-core'],
		tags: ['package', 'examples', 'learning-journey-studio-onboarding'],
	},
	surfaces: {
		templates: true,
		sandbox: { enabled: true, modes: ['playground', 'specs'] },
		studio: { enabled: false, installable: false },
		mcp: { enabled: false },
	},
	entrypoints: {
		packageName: '@contractspec/example.learning-journey-studio-onboarding',
	},
});

export default ExamplesLearningJourneyStudioOnboardingExample;
export { ExamplesLearningJourneyStudioOnboardingExample };
