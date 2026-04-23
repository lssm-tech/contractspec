import { describe, expect, test } from 'bun:test';
import {
	answerWithKnowledge,
	artisanKnowledgeBlueprint,
	artisanKnowledgeTenantConfig,
	KnowledgeCanonFeature,
	ProductCanonKnowledgeSpace,
} from './index';

describe('@contractspec/example.knowledge-canon', () => {
	test('exports the canonical knowledge space and app config', () => {
		expect(ProductCanonKnowledgeSpace.meta.key).toBe('knowledge.product-canon');
		expect(artisanKnowledgeBlueprint.meta.key).toBe(
			'artisan.knowledge.product'
		);
		expect(artisanKnowledgeTenantConfig.knowledge).toHaveLength(1);
		expect(artisanKnowledgeTenantConfig.knowledge?.[0]).toMatchObject({
			spaceKey: ProductCanonKnowledgeSpace.meta.key,
			spaceVersion: ProductCanonKnowledgeSpace.meta.version,
		});
		expect(KnowledgeCanonFeature.knowledge).toEqual([
			{
				key: ProductCanonKnowledgeSpace.meta.key,
				version: ProductCanonKnowledgeSpace.meta.version,
			},
		]);
	});

	test('answers with concrete retrieved knowledge content', async () => {
		const binding = artisanKnowledgeTenantConfig.knowledge?.[0];
		if (!binding) {
			throw new Error('Expected a tenant knowledge binding for the example.');
		}
		const resolved = {
			appId: 'artisan',
			tenantId: 'artisan-co',
			blueprintName: artisanKnowledgeBlueprint.meta.key,
			blueprintVersion: artisanKnowledgeBlueprint.meta.version,
			configVersion: artisanKnowledgeTenantConfig.meta.version,
			capabilities: { enabled: [], disabled: [] },
			features: { include: [], exclude: [] },
			dataViews: {},
			workflows: {},
			jobs: {},
			policies: [],
			experiments: { catalog: [], active: [], paused: [] },
			featureFlags: [],
			routes: [],
			integrations: [],
			knowledge: [
				{
					binding,
					space: ProductCanonKnowledgeSpace,
					sources: [],
				},
			],
			translation: {
				defaultLocale: 'en',
				supportedLocales: ['en'],
				tenantOverrides: [],
			},
			branding: {
				appName: 'Artisan',
				assets: {},
				colors: {
					primary: '#111111',
					secondary: '#222222',
				},
				domain: 'artisan.example.com',
			},
		};

		const answer = await answerWithKnowledge(
			resolved,
			'How do I rotate a key?',
			{
				workflowId: 'answerFaq',
			}
		);

		expect(answer).toContain('Retrieved evidence:');
		expect(answer).toContain('Rotate API keys from Settings > API.');
	});
});
