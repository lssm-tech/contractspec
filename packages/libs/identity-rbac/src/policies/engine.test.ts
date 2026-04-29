import { describe, expect, it } from 'bun:test';
import {
	type PolicyBindingForEval,
	RBACPolicyEngine,
	type RolePermissionSource,
	StaticRolePermissionSource,
} from './engine';

const viewerRole = {
	id: 'role-viewer',
	name: 'viewer',
	permissions: ['project.read'],
};
const adminRole = {
	id: 'role-admin',
	name: 'admin',
	permissions: ['project.read', 'project.update'],
};
const denyUpdateRole = {
	id: 'role-deny-update',
	name: 'deny-update',
	permissions: ['project.update'],
};

function binding(
	role: typeof viewerRole,
	overrides: Partial<PolicyBindingForEval> = {}
): PolicyBindingForEval {
	return {
		roleId: role.id,
		role,
		targetType: 'user',
		targetId: 'user-1',
		...overrides,
	};
}

describe('RBACPolicyEngine requirement evaluation', () => {
	it('allows static role grants', async () => {
		const result = await new RBACPolicyEngine().evaluateRequirement({
			requirement: { permissions: ['project.read'] },
			subject: { userId: 'user-1' },
			bindings: [binding(viewerRole)],
			mode: 'static',
		});

		expect(result.effect).toBe('allow');
		expect(result.matched?.permission).toBe('project.read');
	});

	it('denies missing static permissions with missing reason', async () => {
		const result = await new RBACPolicyEngine().evaluateRequirement({
			requirement: { permissions: ['project.update'] },
			subject: { userId: 'user-1' },
			bindings: [binding(viewerRole)],
		});

		expect(result.effect).toBe('deny');
		expect(result.missing?.permissions).toEqual(['project.update']);
	});

	it('denies when a dynamic source is unavailable', async () => {
		const source: RolePermissionSource = {
			resolveEffectiveAccess() {
				throw new Error('db unavailable');
			},
		};

		const result = await new RBACPolicyEngine().evaluateRequirement({
			requirement: { permissions: ['project.read'] },
			subject: { userId: 'user-1' },
			source,
			mode: 'dynamic',
		});

		expect(result.effect).toBe('deny');
		expect(result.reason).toBe('source_unavailable');
	});

	it('ignores expired and out-of-scope bindings', async () => {
		const result = await new RBACPolicyEngine().evaluateRequirement({
			requirement: { permissions: ['project.read'] },
			subject: { userId: 'user-1', workspaceId: 'workspace-allowed' },
			bindings: [
				binding(viewerRole, { expiresAt: new Date(Date.now() - 1000) }),
				binding(viewerRole, { workspaceId: 'workspace-other' }),
			],
			mode: 'dynamic',
		});

		expect(result.effect).toBe('deny');
		expect(result.missing?.permissions).toEqual(['project.read']);
	});

	it('keeps legacy permission helpers deny-first', async () => {
		const engine = new RBACPolicyEngine();
		const bindings = [
			binding(adminRole, { source: 'template' }),
			binding(adminRole, {
				source: 'dynamic',
				effect: 'deny',
				reason: 'Workspace removed admin role',
			}),
		];

		await expect(
			engine.checkPermission(
				{ userId: 'user-1', permission: 'project.update' },
				bindings
			)
		).resolves.toMatchObject({ allowed: false });

		const access = await engine.getPermissions('user-1', undefined, bindings);
		expect(access.permissions.has('project.update')).toBe(false);
		expect(access.roles.map((role) => role.name)).not.toContain('admin');
		await expect(
			engine.hasAnyPermission('user-1', undefined, ['project.update'], bindings)
		).resolves.toBe(false);
		await expect(
			engine.hasAllPermissions(
				'user-1',
				undefined,
				['project.update'],
				bindings
			)
		).resolves.toBe(false);
	});

	it('applies hybrid explicit deny before static or dynamic grants', async () => {
		const result = await new RBACPolicyEngine().evaluateRequirement({
			requirement: { permissions: ['project.update'] },
			subject: { userId: 'user-1' },
			bindings: [
				binding(adminRole, { source: 'template' }),
				binding(denyUpdateRole, {
					source: 'dynamic',
					effect: 'deny',
					reason: 'Workspace disabled project updates',
				}),
			],
			mode: 'hybrid',
		});

		expect(result.effect).toBe('deny');
		expect(result.deniedPermissions).toEqual(['project.update']);
	});

	it('applies hybrid explicit role deny before static role grants', async () => {
		const result = await new RBACPolicyEngine().evaluateRequirement({
			requirement: { roles: ['admin'] },
			subject: { userId: 'user-1' },
			bindings: [
				binding(adminRole, { source: 'template' }),
				binding(adminRole, {
					source: 'dynamic',
					effect: 'deny',
					reason: 'Workspace removed admin role',
				}),
			],
			mode: 'hybrid',
		});

		expect(result.effect).toBe('deny');
		expect(result.deniedRoles).toEqual(['admin']);
		expect(result.roles.map((role) => role.name)).not.toContain('admin');
	});

	it('applies explicit role deny from custom dynamic sources', async () => {
		const source: RolePermissionSource = {
			resolveEffectiveAccess() {
				return {
					permissions: new Set(adminRole.permissions),
					roles: [adminRole],
					deniedPermissions: new Set<string>(),
					deniedRoles: new Set(['admin']),
					source: 'dynamic',
					reasons: ['Workspace removed admin role'],
				};
			},
		};

		const result = await new RBACPolicyEngine().evaluateRequirement({
			requirement: { roles: ['admin'] },
			subject: { userId: 'user-1' },
			source,
			mode: 'dynamic',
		});

		expect(result.effect).toBe('deny');
		expect(result.deniedRoles).toEqual(['admin']);
		expect(result.roles.map((role) => role.name)).not.toContain('admin');
	});

	it('removes permissions carried by denied roles from custom dynamic sources', async () => {
		const source: RolePermissionSource = {
			resolveEffectiveAccess() {
				return {
					permissions: new Set(adminRole.permissions),
					roles: [adminRole],
					deniedPermissions: new Set<string>(),
					deniedRoles: new Set(['admin']),
					source: 'dynamic',
					reasons: ['Workspace removed admin role'],
				};
			},
		};

		const result = await new RBACPolicyEngine().evaluateRequirement({
			requirement: { permissions: ['project.update'] },
			subject: { userId: 'user-1' },
			source,
			mode: 'dynamic',
		});

		expect(result.effect).toBe('deny');
		expect(result.permissions).not.toContain('project.update');
	});

	it('keeps non-denied anyRole alternatives available from subject roles', async () => {
		const result = await new RBACPolicyEngine().evaluateRequirement({
			requirement: { anyRole: ['admin', 'viewer'] },
			subject: { userId: 'user-1', roles: ['admin', 'viewer'] },
			bindings: [
				binding(adminRole, {
					source: 'dynamic',
					effect: 'deny',
				}),
			],
			mode: 'hybrid',
		});

		expect(result.effect).toBe('allow');
		expect(result.matched?.role).toBe('viewer');
	});

	it('allows dynamic grants to extend static absence', async () => {
		const result = await new RBACPolicyEngine().evaluateRequirement({
			requirement: { permissions: ['project.update'] },
			subject: { userId: 'user-1' },
			bindings: [
				binding(viewerRole, { source: 'template' }),
				binding(adminRole, { source: 'dynamic' }),
			],
			mode: 'hybrid',
		});

		expect(result.effect).toBe('allow');
		expect(result.permissions).toContain('project.update');
	});

	it('supports static source helper', async () => {
		const source = new StaticRolePermissionSource([binding(viewerRole)]);
		const result = await new RBACPolicyEngine().evaluateRequirement({
			requirement: { permissions: ['project.read'] },
			subject: { userId: 'user-1' },
			source,
			mode: 'static',
		});

		expect(result.effect).toBe('allow');
	});
});
