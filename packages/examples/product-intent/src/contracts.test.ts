import { describe, expect, test } from 'bun:test';
import { ProductIntentDiscoverySpec, ProductIntentFeature } from './index';

describe('@contractspec/example.product-intent', () => {
	test('exports the canonical product intent spec', () => {
		expect(ProductIntentDiscoverySpec.meta.key).toBe(
			'product-intent.discovery.activation'
		);
		expect(ProductIntentDiscoverySpec.question).toContain('activation');
		expect(ProductIntentDiscoverySpec.tickets?.tickets).toHaveLength(1);
		expect(ProductIntentDiscoverySpec.tasks?.tasks).toHaveLength(2);
		expect(ProductIntentFeature.meta.key).toBe('product-intent');
	});
});
