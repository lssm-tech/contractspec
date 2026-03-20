import {
	OwnersEnum,
	StabilityEnum,
} from '@contractspec/lib.contracts-spec/ownership';
import type { ThemeSpec } from '@contractspec/lib.contracts-spec/themes';

export const PersonalizationTheme: ThemeSpec = {
	meta: {
		key: 'personalization.theme.guided-onboarding',
		version: '1.0.0',
		title: 'Guided Onboarding Theme',
		description:
			'Theme tokens used when the personalized onboarding experience is active.',
		domain: 'personalization',
		owners: [OwnersEnum.PlatformCore],
		tags: ['personalization', 'theme', 'onboarding'],
		stability: StabilityEnum.Experimental,
		scopes: ['tenant', 'user'],
	},
	tokens: {
		colors: {
			surface: { value: '#FCF6E8' },
			accent: { value: '#C8742A' },
			text: { value: '#2F2419' },
		},
		radii: {
			card: { value: 18 },
		},
		space: {
			panel: { value: 24 },
		},
		typography: {
			body: { value: 16 },
			title: { value: 28 },
		},
		motion: {
			stagger: { value: '180ms' },
		},
	},
	components: [
		{
			component: 'OnboardingChecklist',
			variants: {
				guided: {
					props: {
						emphasis: 'warm',
					},
				},
			},
		},
	],
	overrides: [
		{
			scope: 'tenant',
			target: 'tenant:acme',
			tokens: {
				colors: {
					accent: { value: '#8A4B12' },
				},
			},
		},
	],
};
