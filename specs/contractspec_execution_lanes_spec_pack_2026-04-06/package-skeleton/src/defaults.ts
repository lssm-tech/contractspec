import type { RoleProfile } from './types';

export const DEFAULT_ROLE_KEYS = [
	'planner',
	'architect',
	'critic',
	'executor',
	'verifier',
	'test-engineer',
	'security-reviewer',
	'researcher',
	'writer',
] as const;

export const DEFAULT_TRANSITIONS = {
	clarify: ['plan.consensus'],
	'plan.consensus': ['complete.persistent', 'team.coordinated'],
	'complete.persistent': [],
	'team.coordinated': ['complete.persistent'],
} as const;

export function defineRoleProfile(profile: RoleProfile): RoleProfile {
	return profile;
}
