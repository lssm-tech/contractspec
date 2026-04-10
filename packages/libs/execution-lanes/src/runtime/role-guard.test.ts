import { describe, expect, it } from 'bun:test';
import { DEFAULT_ROLE_PROFILES } from '../defaults';
import { RoleProfileRegistry } from '../registry/role-profile-registry';
import { createRoleGuard } from './role-guard';

describe('createRoleGuard', () => {
	it('rejects lane-incompatible roles and disallowed write scopes', () => {
		const registry = new RoleProfileRegistry();
		for (const profile of DEFAULT_ROLE_PROFILES) {
			registry.register(profile);
		}
		const guard = createRoleGuard(registry);

		expect(() =>
			guard.assert({
				roleKey: 'architect',
				lane: 'team.coordinated',
			})
		).toThrow(/not compatible/);

		expect(() =>
			guard.assert({
				roleKey: 'executor',
				lane: 'complete.persistent',
				allowedWriteScopes: ['artifacts-only'],
			})
		).toThrow(/write scope/);
	});

	it('accepts valid lane/tool combinations', () => {
		const registry = new RoleProfileRegistry();
		for (const profile of DEFAULT_ROLE_PROFILES) {
			registry.register(profile);
		}
		const guard = createRoleGuard(registry);
		const profile = guard.assert({
			roleKey: 'verifier',
			lane: 'complete.persistent',
			requiredTools: ['review'],
		});
		expect(profile.key).toBe('verifier');
	});
});
