import { describe, expect, it } from 'bun:test';

describe('provider-spec package exports', () => {
	it('supports the documented public entry points', async () => {
		const root = await import('@contractspec/lib.provider-spec');
		const types = await import('@contractspec/lib.provider-spec/types');
		const validation = await import(
			'@contractspec/lib.provider-spec/validation'
		);

		expect(typeof root).toBe('object');
		expect(typeof types).toBe('object');
		expect(typeof validation.validateProviderRoutingPolicy).toBe('function');
	});
});
