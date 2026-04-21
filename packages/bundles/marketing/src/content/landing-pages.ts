import type {
	LandingPageContent,
	LandingPageKey,
} from './landing-content.types';
import { marketingLandingPages } from './landing-marketing-pages';
import { referenceLandingPages } from './landing-reference-pages';

export const contractspecLandingPages: readonly LandingPageContent[] = [
	...marketingLandingPages,
	...referenceLandingPages,
] as const;

export function listContractspecLandingPages(): readonly LandingPageContent[] {
	return contractspecLandingPages;
}

export function findContractspecLandingPage(
	key: string
): LandingPageContent | null {
	return contractspecLandingPages.find((page) => page.key === key) ?? null;
}

export const nativeLandingPageKeys = contractspecLandingPages.map(
	(page) => page.key
) satisfies LandingPageKey[];
