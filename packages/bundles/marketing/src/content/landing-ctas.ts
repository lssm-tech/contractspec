import {
	CONTRACTSPEC_SITE_BASE_URL,
	contractspecLandingStory,
} from './landing-content';
import type { LandingCta, LandingResolvedCta } from './landing-content.types';
import { contractspecPublicNavigation } from './landing-navigation';
import { listContractspecLandingPages } from './landing-pages';

export function listContractspecLandingCtas(): LandingCta[] {
	return [
		...contractspecLandingStory.hero.ctas,
		...contractspecLandingStory.finalCta.ctas,
		...listContractspecLandingPages().flatMap((page) => [
			...page.heroCtas,
			...(page.finalCta?.ctas ?? []),
		]),
		...contractspecPublicNavigation.map((item) => ({
			id: item.id,
			label: item.label,
			href: item.href,
			kind: item.kind,
			variant: 'ghost' as const,
			webHref: item.webHref,
		})),
	];
}

export function findContractspecLandingCtaById(id: string): LandingCta | null {
	return listContractspecLandingCtas().find((cta) => cta.id === id) ?? null;
}

export function resolveContractspecLandingCta(
	cta: LandingCta
): LandingResolvedCta {
	const url =
		cta.kind === 'external'
			? cta.href
			: new URL(cta.webHref ?? cta.href, CONTRACTSPEC_SITE_BASE_URL).toString();
	return {
		id: cta.id,
		label: cta.label,
		href: cta.href,
		kind: cta.kind,
		url,
		route: cta.kind === 'native' ? cta.href : undefined,
	};
}
