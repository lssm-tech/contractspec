import { describe, expect, it } from 'bun:test';
import { DEFAULT_LANES, DEFAULT_ROLE_PROFILES } from '../defaults';
import { ExecutionLaneRegistry } from '../registry/execution-lane-registry';
import { RoleProfileRegistry } from '../registry/role-profile-registry';

describe('execution lane defaults', () => {
	it('registers default lanes and roles', () => {
		const lanes = new ExecutionLaneRegistry();
		for (const lane of DEFAULT_LANES) {
			lanes.register(lane);
		}

		const roles = new RoleProfileRegistry();
		for (const role of DEFAULT_ROLE_PROFILES) {
			roles.register(role);
		}

		expect(lanes.canTransition('plan.consensus', 'team.coordinated')).toBe(
			true
		);
		expect(roles.get('verifier')?.writeScope).toBe('artifacts-only');
	});
});
