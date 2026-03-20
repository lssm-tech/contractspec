import { describe, expect, test } from 'bun:test';
import {
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
});
