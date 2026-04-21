import { describe, expect, it } from 'bun:test';
import { listDiscoverableExamples } from '@contractspec/module.examples/catalog';
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
		)) as { navigation: { items: Array<{ href: string; pageKey?: string }> } };

		expect(
			result.navigation.items.map((item) => item.pageKey).filter(Boolean)
		).toEqual([
			'home',
			'product',
			'templates',
			'examples',
			'pricing',
			'docs',
			'changelog',
		]);
		for (const hiddenRoute of ['/examples-preview', '/example-preview']) {
			expect(
				result.navigation.items.some((item) => item.href === hiddenRoute)
			).toBe(false);
		}
	});

	it('lists every discoverable example for the mobile examples route', async () => {
		const result = (await mobileLandingRegistry.execute(
			'mobileLanding.examples.list',
			'1.0.0',
			{},
			{}
		)) as {
			examples: Array<{
				key: string;
				docsUrl: string;
				llmsUrl: string | null;
				sandboxUrl: string | null;
				sourceUrl: string | null;
				supportsInlinePreview: boolean;
			}>;
		};
		const keys = result.examples.map((example) => example.key).sort();
		const expectedKeys = listDiscoverableExamples()
			.map((example) => example.meta.key)
			.sort();

		expect(result.examples).toHaveLength(listDiscoverableExamples().length);
		expect(keys).toEqual(expectedKeys);
		expect(keys).toContain('opencode-cli');
		expect(keys).toContain('agent-console');
		expect(
			result.examples.find((example) => example.key === 'agent-console')
				?.supportsInlinePreview
		).toBe(true);
		expect(
			result.examples.find((example) => example.key === 'opencode-cli')?.docsUrl
		).toBe('https://www.contractspec.io/docs/examples/opencode-cli');
		expect(
			result.examples.find((example) => example.key === 'opencode-cli')
				?.sandboxUrl
		).toBe('https://www.contractspec.io/sandbox?template=opencode-cli');
		expect(
			result.examples.find((example) => example.key === 'opencode-cli')?.llmsUrl
		).toBe('https://www.contractspec.io/llms/example.opencode-cli');
		expect(
			result.examples.find((example) => example.key === 'opencode-cli')
				?.sourceUrl
		).toContain('/packages/examples/opencode-cli');
	});

	it('returns route page content by key', async () => {
		const result = (await mobileLandingRegistry.execute(
			'mobileLanding.page.get',
			'1.0.0',
			{ key: 'examples' },
			{}
		)) as { page: { key: string; path: string } };

		expect(result.page).toMatchObject({ key: 'examples', path: '/examples' });
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
