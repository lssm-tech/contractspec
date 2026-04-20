export type LandingIconKey =
	| 'arrow-right'
	| 'blocks'
	| 'bot'
	| 'braces'
	| 'chart-column'
	| 'database'
	| 'git-branch'
	| 'shield-check'
	| 'sparkles'
	| 'workflow';

export type LandingCtaKind = 'internal' | 'external';

export type LandingCtaVariant = 'primary' | 'ghost';

export interface LandingCta {
	id: string;
	label: string;
	href: string;
	kind: LandingCtaKind;
	variant: LandingCtaVariant;
}

export interface LandingProofStat {
	value: string;
	label: string;
}

export interface LandingContentCard {
	title: string;
	description: string;
	iconKey?: LandingIconKey;
}

export interface LandingContentSection {
	kicker: string;
	title: string;
	description: string;
	items: LandingContentCard[];
}

export interface LandingPathSection {
	kicker: string;
	title: string;
	steps: string[];
}

export interface LandingStudioSection {
	kicker: string;
	title: string;
	description: string;
	summaries: Array<{
		label: string;
		description: string;
	}>;
}

export interface LandingStoryContent {
	hero: {
		badge: {
			label: string;
			iconKey: LandingIconKey;
		};
		kicker: string;
		title: string;
		subtitle: string;
		ctas: LandingCta[];
		proofStats: LandingProofStat[];
	};
	clarityPanel: {
		kicker: string;
		title: string;
		description: string;
		points: string[];
	};
	failureModes: LandingContentSection;
	systemSurfaces: LandingContentSection;
	outputs: LandingContentSection;
	adoptionPath: LandingPathSection;
	studio: LandingStudioSection;
	finalCta: {
		kicker: string;
		title: string;
		description: string;
		ctas: LandingCta[];
	};
}
