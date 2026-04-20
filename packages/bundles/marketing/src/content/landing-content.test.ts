import { describe, expect, it } from 'bun:test';
import {
	contractspecLandingStory,
	findContractspecLandingCta,
	resolveContractspecLandingCtaUrl,
} from './landing-content';

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
});
