import { describe, expect, it } from 'bun:test';
import { resizablePanelsAdapterStub } from './resizable-panels-stub';

describe('resizablePanelsAdapterStub', () => {
	it('restores null when no saved layout', async () => {
		const result =
			await resizablePanelsAdapterStub.restoreLayout('test-no-saved');
		expect(result).toBeNull();
	});

	it('saveLayout and restoreLayout do not throw', async () => {
		const persistKey = 'test-save-restore-' + Date.now();
		await expect(
			resizablePanelsAdapterStub.saveLayout(persistKey, [25, 50, 25])
		).resolves.toBeUndefined();
		const restored = await resizablePanelsAdapterStub.restoreLayout(persistKey);
		expect(restored === null || Array.isArray(restored)).toBe(true);
	});
});
