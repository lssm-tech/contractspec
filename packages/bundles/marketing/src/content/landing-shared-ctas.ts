import type { LandingCta } from './landing-content.types';

export const startOssCta: LandingCta = {
	id: 'start-oss',
	label: 'Start with OSS',
	href: '/install',
	kind: 'internal',
	variant: 'primary',
};

export const studioCta: LandingCta = {
	id: 'explore-studio',
	label: 'Explore Studio',
	href: 'https://www.contractspec.studio',
	kind: 'external',
	variant: 'ghost',
};
