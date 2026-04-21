import { describe, expect, it } from 'bun:test';
import { mobileLandingRegistry } from './mobile-landing.handlers';

describe('mobile-landing.handlers', () => {
	it('returns the shared landing story', async () => {
		const result = (await mobileLandingRegistry.execute(
			'mobileLanding.story.get',
			'1.0.0',
			{},
			{}
		)) as { story: { hero: { title: string } } };

		expect(result.story.hero.title).toContain('explicit contracts');
	});

	it('resolves internal CTA ids to public web URLs', async () => {
		const result = await mobileLandingRegistry.execute(
			'mobileLanding.cta.resolve',
			'1.0.0',
			{ id: 'start-oss' },
			{}
		);

		expect(result).toEqual({
			id: 'start-oss',
			label: 'Start with OSS',
			href: '/install',
			url: 'https://www.contractspec.io/install',
			kind: 'internal',
		});
	});

	it('lists native public navigation routes', async () => {
		const result = (await mobileLandingRegistry.execute(
			'mobileLanding.navigation.list',
			'1.0.0',
			{},
			{}
		)) as { navigation: { items: Array<{ pageKey?: string }> } };

		expect(
			result.navigation.items.map((item) => item.pageKey).filter(Boolean)
		).toEqual(['home', 'product', 'templates', 'pricing', 'docs', 'changelog']);
	});

	it('returns route page content by key', async () => {
		const result = (await mobileLandingRegistry.execute(
			'mobileLanding.page.get',
			'1.0.0',
			{ key: 'product' },
			{}
		)) as { page: { key: string; path: string } };

		expect(result.page).toMatchObject({ key: 'product', path: '/product' });
	});

	it('resolves native CTA ids to native routes plus web fallback URLs', async () => {
		const result = await mobileLandingRegistry.execute(
			'mobileLanding.cta.resolve',
			'1.0.0',
			{ id: 'nav-product' },
			{}
		);

		expect(result).toEqual({
			id: 'nav-product',
			label: 'Product',
			href: '/product',
			url: 'https://www.contractspec.io/product',
			kind: 'native',
			route: '/product',
		});
	});

	it('rejects unknown CTA ids', async () => {
		await expect(
			mobileLandingRegistry.execute(
				'mobileLanding.cta.resolve',
				'1.0.0',
				{ id: 'missing' },
				{}
			)
		).rejects.toThrow('Unknown landing CTA: missing');
	});
});
