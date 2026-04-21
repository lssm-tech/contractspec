import { describe, expect, it } from 'bun:test';
import {
	contractspecLandingStory,
	findContractspecLandingCta,
	findContractspecLandingCtaById,
	findContractspecLandingPage,
	listContractspecLandingNavigation,
	nativeLandingPageKeys,
	resolveContractspecLandingCta,
	resolveContractspecLandingCtaUrl,
} from './index';

describe('contractspec landing content', () => {
	it('keeps the OSS-first positioning available as platform-neutral data', () => {
		expect(contractspecLandingStory.hero.title).toContain('explicit contracts');
		expect(contractspecLandingStory.hero.ctas[0]?.id).toBe('start-oss');
		expect(contractspecLandingStory.systemSurfaces.items).toHaveLength(4);
		expect(contractspecLandingStory.outputs.items).toHaveLength(4);
	});

	it('resolves internal and external CTA targets for mobile shells', () => {
		const ossCta = findContractspecLandingCta('start-oss');
		const studioCta = findContractspecLandingCta('explore-studio');

		expect(ossCta).not.toBeNull();
		expect(studioCta).not.toBeNull();
		expect(resolveContractspecLandingCtaUrl(ossCta!)).toBe(
			'https://www.contractspec.io/install'
		);
		expect(resolveContractspecLandingCtaUrl(studioCta!)).toBe(
			'https://www.contractspec.studio'
		);
	});

	it('covers the full public native navigation scope', () => {
		const navigation = listContractspecLandingNavigation();
		expect(
			navigation.items
				.filter((item) => item.kind === 'native')
				.map((item) => item.pageKey)
		).toEqual([
			'home',
			'product',
			'templates',
			'examples',
			'pricing',
			'docs',
			'changelog',
		]);
		expect(nativeLandingPageKeys).toEqual([
			'product',
			'templates',
			'examples',
			'pricing',
			'docs',
			'changelog',
		]);
	});

	it('resolves native CTA targets separately from browser URLs', () => {
		const nativeCta = findContractspecLandingCtaById('nav-examples');
		const page = findContractspecLandingPage('examples');

		expect(page?.path).toBe('/examples');
		expect(nativeCta).not.toBeNull();
		expect(resolveContractspecLandingCta(nativeCta!)).toMatchObject({
			kind: 'native',
			route: '/examples',
			url: 'https://www.contractspec.io/examples',
		});
	});
});
