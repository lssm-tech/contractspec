import type { RoleProfile } from '../types';
import { assertValid } from '../validation/issues';
import { validateRoleProfile } from '../validation/role-profile';

export class RoleProfileRegistry {
	private readonly items = new Map<string, RoleProfile>();

	register(profile: RoleProfile): this {
		assertValid(
			validateRoleProfile(profile),
			`Invalid role profile "${profile.key}"`
		);
		this.items.set(profile.key, profile);
		return this;
	}

	get(key: string): RoleProfile | undefined {
		return this.items.get(key);
	}

	list(): RoleProfile[] {
		return Array.from(this.items.values());
	}

	listForLane(lane: string): RoleProfile[] {
		return this.list().filter((profile) =>
			profile.laneCompatibility.includes(lane as never)
		);
	}

	require(key: string): RoleProfile {
		const profile = this.get(key);
		if (!profile) {
			throw new Error(`Missing role profile "${key}".`);
		}
		return profile;
	}
}

export function defineRoleProfile(profile: RoleProfile): RoleProfile {
	assertValid(
		validateRoleProfile(profile),
		`Invalid role profile "${profile.key}"`
	);
	return profile;
}
