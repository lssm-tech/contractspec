import { defineFeature } from '@contractspec/lib.contracts-spec/features';

export const LearningJourneyUiOnboardingFeature = defineFeature({
	meta: {
		key: 'learning-journey-ui-onboarding',
		version: '1.0.0',
		title: 'Learning Journey UI: Onboarding',
		description:
			'Developer onboarding UI with checklists, journey maps, and step-by-step progress',
		domain: 'learning-journey',
		owners: ['@examples'],
		tags: ['learning', 'ui', 'onboarding', 'checklists'],
		stability: 'experimental',
	},

	docs: ['docs.examples.learning-journey-ui-onboarding'],
});
