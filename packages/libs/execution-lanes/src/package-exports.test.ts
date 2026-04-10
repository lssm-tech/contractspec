import { describe, expect, it } from 'bun:test';

describe('package exports', () => {
	it('supports the documented public entry points', async () => {
		const root = await import('@contractspec/lib.execution-lanes');
		const defaults = await import('@contractspec/lib.execution-lanes/defaults');
		const interop = await import('@contractspec/lib.execution-lanes/interop');
		const types = await import('@contractspec/lib.execution-lanes/types');

		expect(typeof root.createLaneRuntime).toBe('function');
		expect(typeof root.parseExecutionLaneCommand).toBe('function');
		expect(Array.isArray(defaults.DEFAULT_LANES)).toBe(true);
		expect(Array.isArray(interop.EXECUTION_LANE_COMMANDS)).toBe(true);
		expect(typeof types.normalizeExecutionLaneArtifactType).toBe('function');
		expect(typeof types.normalizeExecutionLaneFailureClass).toBe('function');
	});
});
