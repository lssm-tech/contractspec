import { afterEach, describe, expect, it } from 'bun:test';

import { createControlPlaneRuntimeContext } from './runtime-context';

const originalStorage = process.env.CHANNEL_RUNTIME_STORAGE;

afterEach(() => {
	process.env.CHANNEL_RUNTIME_STORAGE = originalStorage;
});

describe('control-plane runtime context', () => {
	it('rejects unsupported storage modes', async () => {
		process.env.CHANNEL_RUNTIME_STORAGE = 'postgress';
		await expect(createControlPlaneRuntimeContext()).rejects.toThrow(
			'Unsupported CHANNEL_RUNTIME_STORAGE value'
		);
	});
});
