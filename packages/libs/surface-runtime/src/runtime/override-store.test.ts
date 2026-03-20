import { describe, expect, it } from 'bun:test';
import {
	buildOverrideTargetKey,
	createInMemoryOverrideStore,
	createOverrideStoreWithApprovalGate,
} from './override-store';

describe('createInMemoryOverrideStore', () => {
	it('saves and lists overlays', async () => {
		const store = createInMemoryOverrideStore();
		const targetKey = buildOverrideTargetKey(
			'pm',
			'issue-detail',
			'issue-detail'
		);
		const id = await store.save('user', targetKey, [
			{
				op: 'insert-node',
				slotId: 'primary',
				node: { nodeId: 'n1', kind: 'entity-card' },
			},
		]);
		expect(id).not.toBe('');
		const list = await store.list('user', targetKey);
		expect(list).toHaveLength(1);
		expect(list[0]?.overrideId).toBe(id);
		expect(list[0]?.patch).toHaveLength(1);
	});

	it('remove deletes overlay', async () => {
		const store = createInMemoryOverrideStore();
		const targetKey = 'pm:issue-detail';
		const id = await store.save('user', targetKey, []);
		await store.remove(id);
		const list = await store.list('user', targetKey);
		expect(list).toHaveLength(0);
	});
});

describe('createOverrideStoreWithApprovalGate', () => {
	it('allows workspace save when requestApproval returns true', async () => {
		const base = createInMemoryOverrideStore();
		const store = createOverrideStoreWithApprovalGate(base, {
			requireApprovalForWorkspacePatches: true,
			requestApproval: async () => true,
		});
		const id = await store.save('workspace', 'pm:issue-detail', [
			{
				op: 'insert-node',
				slotId: 'primary',
				node: { nodeId: 'n1', kind: 'entity-card' },
			},
		]);
		expect(id).not.toBe('');
	});

	it('rejects workspace save when requestApproval returns false', async () => {
		const base = createInMemoryOverrideStore();
		const store = createOverrideStoreWithApprovalGate(base, {
			requireApprovalForWorkspacePatches: true,
			requestApproval: async () => false,
		});
		await expect(
			store.save('workspace', 'pm:issue-detail', [
				{
					op: 'insert-node',
					slotId: 'primary',
					node: { nodeId: 'n1', kind: 'entity-card' },
				},
			])
		).rejects.toThrow('approval required and not granted');
	});

	it('allows user save without approval when gate is for workspace only', async () => {
		const base = createInMemoryOverrideStore();
		const store = createOverrideStoreWithApprovalGate(base, {
			requireApprovalForWorkspacePatches: true,
			requestApproval: async () => false,
		});
		const id = await store.save('user', 'pm:issue-detail', []);
		expect(id).not.toBe('');
	});
});

describe('buildOverrideTargetKey', () => {
	it('builds key with routeId', () => {
		expect(buildOverrideTargetKey('pm', 'issue-detail', 'issue-detail')).toBe(
			'pm:issue-detail:issue-detail'
		);
	});
	it('builds key without routeId', () => {
		expect(buildOverrideTargetKey('pm', 'issue-detail')).toBe(
			'pm:issue-detail'
		);
	});
});
