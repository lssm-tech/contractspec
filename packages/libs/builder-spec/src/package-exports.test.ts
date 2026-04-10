import { describe, expect, it } from 'bun:test';

describe('builder-spec package exports', () => {
	it('supports the documented public entry points', async () => {
		const root = await import('@contractspec/lib.builder-spec');
		const capabilities = await import(
			'@contractspec/lib.builder-spec/capabilities'
		);
		const commands = await import('@contractspec/lib.builder-spec/commands');
		const events = await import('@contractspec/lib.builder-spec/events');
		const queries = await import('@contractspec/lib.builder-spec/queries');
		const types = await import('@contractspec/lib.builder-spec/types');
		const validation = await import(
			'@contractspec/lib.builder-spec/validation'
		);

		expect(Array.isArray(root.BUILDER_COMMANDS)).toBe(true);
		expect(Array.isArray(capabilities.BUILDER_CAPABILITIES)).toBe(true);
		expect(Array.isArray(commands.BUILDER_COMMANDS)).toBe(true);
		expect(Array.isArray(events.BUILDER_EVENTS)).toBe(true);
		expect(Array.isArray(queries.BUILDER_QUERIES)).toBe(true);
		expect(typeof types).toBe('object');
		expect(typeof validation.validateBuilderWorkspace).toBe('function');
	});
});
