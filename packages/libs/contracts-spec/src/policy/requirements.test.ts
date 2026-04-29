import { describe, expect, it } from 'bun:test';
import { StabilityEnum } from '../ownership';
import { PolicyRegistry } from './registry';
import {
	normalizePolicyRequirement,
	validatePolicyRequirement,
} from './requirements';
import type { PolicySpec } from './spec';

const policy: PolicySpec = {
	meta: {
		key: 'test.policy',
		version: '1.0.0',
		description: 'Test policy',
		owners: ['@team.test'],
		stability: StabilityEnum.Experimental,
		tags: ['test'],
	},
	rules: [{ effect: 'allow', actions: ['read'] }],
};

describe('policy requirements', () => {
	it('accepts legacy light flags and pii policies', () => {
		const requirement = normalizePolicyRequirement({
			flags: ['beta'],
			pii: ['email'],
		});

		expect(requirement).toEqual({ flags: ['beta'], pii: ['email'] });
		expect(validatePolicyRequirement(requirement).valid).toBe(true);
	});

	it('validates role, permission, flag, and policy references', () => {
		const registry = new PolicyRegistry([policy]);
		const result = validatePolicyRequirement(
			{
				auth: 'user',
				roles: ['manager'],
				anyRole: ['owner', 'admin'],
				permissions: ['invoice.read'],
				anyPermission: ['invoice.approve', 'invoice.review'],
				flags: ['finance'],
				policies: [{ key: 'test.policy', version: '1.0.0' }],
				fieldPolicies: [
					{
						field: 'email',
						actions: ['read'],
						policy: { key: 'test.policy', version: '1.0.0' },
					},
				],
			},
			{ registry }
		);

		expect(result).toEqual({ valid: true, issues: [] });
	});

	it('rejects empty arrays, duplicate values, and missing policy refs', () => {
		const result = validatePolicyRequirement(
			{
				roles: [],
				permissions: ['invoice.read', 'invoice.read'],
				policies: [{ key: 'missing.policy', version: '1.0.0' }],
				fieldPolicies: [{ field: '', actions: [] }],
			},
			{ registry: new PolicyRegistry([policy]) }
		);

		expect(result.valid).toBe(false);
		expect(result.issues.map((issue) => issue.path)).toEqual(
			expect.arrayContaining([
				'roles',
				'permissions',
				'policies[0]',
				'fieldPolicies[0].field',
				'fieldPolicies[0].actions',
			])
		);
	});

	it('warns when anonymous auth is combined with protected requirements', () => {
		const result = validatePolicyRequirement({
			auth: 'anonymous',
			permissions: ['admin.access'],
		});

		expect(result.valid).toBe(true);
		expect(result.issues).toContainEqual(
			expect.objectContaining({ level: 'warning', path: 'auth' })
		);
	});
});
