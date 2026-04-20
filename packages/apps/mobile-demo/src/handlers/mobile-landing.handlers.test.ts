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
			url: 'https://www.contractspec.io/install',
			kind: 'internal',
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
