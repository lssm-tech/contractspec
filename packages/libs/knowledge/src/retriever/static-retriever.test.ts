import { describe, expect, it } from 'bun:test';
import { createStaticRetriever, StaticRetriever } from './static-retriever';

describe('StaticRetriever', () => {
	it('returns matching non-empty lines and respects topK/defaultTopK', async () => {
		const retriever = new StaticRetriever({
			content: {
				support: [
					'Rotate keys from Settings.',
					'',
					'Rotate API keys before sharing logs.',
					'Billing lives elsewhere.',
				].join('\n'),
			},
			defaultTopK: 1,
		});

		expect(
			await retriever.retrieve('rotate', {
				spaceKey: 'support',
			})
		).toEqual([
			{
				content: 'Rotate keys from Settings.',
				source: 'support',
				score: 1,
				metadata: { type: 'static' },
			},
		]);
		expect(
			await retriever.retrieve('rotate', {
				spaceKey: 'support',
				topK: 2,
			})
		).toHaveLength(2);
	});

	it('supports both object and Map config plus helper methods', async () => {
		const retriever = createStaticRetriever(
			new Map([
				['canon', 'Canonical answer'],
				['faq', 'FAQ answer'],
			])
		);

		expect(await retriever.getStatic('canon')).toBe('Canonical answer');
		expect(await retriever.getStatic('missing')).toBeNull();
		expect(retriever.supportsSpace('faq')).toBe(true);
		expect(retriever.supportsSpace('missing')).toBe(false);
		expect(retriever.listSpaces()).toEqual(['canon', 'faq']);
		expect(
			await retriever.retrieve('missing', {
				spaceKey: 'unknown',
			})
		).toEqual([]);
	});

	it('applies minScore compatibility checks even with static scores', async () => {
		const retriever = createStaticRetriever({
			support: 'Rotate keys from Settings.',
		});

		expect(
			await retriever.retrieve('rotate', {
				spaceKey: 'support',
				minScore: 1.1,
			})
		).toEqual([]);
	});
});
