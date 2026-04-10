import { RoleProfileRegistry } from '../registry/role-profile-registry';
import type {
	LaneKey,
	RoleProfile,
	RoleToolPermission,
	RoleWriteScope,
} from '../types';

export interface RoleGuardInput {
	roleKey: string;
	lane: LaneKey;
	requiredTools?: RoleToolPermission[];
	allowedWriteScopes?: RoleWriteScope[];
}

export function createRoleGuard(registry: RoleProfileRegistry) {
	return {
		get(roleKey: string): RoleProfile {
			return registry.require(roleKey);
		},
		assert(input: RoleGuardInput): RoleProfile {
			const profile = registry.require(input.roleKey);
			if (!profile.laneCompatibility.includes(input.lane)) {
				throw new Error(
					`Role "${input.roleKey}" is not compatible with lane "${input.lane}".`
				);
			}
			for (const tool of input.requiredTools ?? []) {
				if (!profile.allowedTools.includes(tool)) {
					throw new Error(
						`Role "${input.roleKey}" does not allow required tool "${tool}".`
					);
				}
			}
			if (
				input.allowedWriteScopes &&
				!input.allowedWriteScopes.includes(profile.writeScope)
			) {
				throw new Error(
					`Role "${input.roleKey}" write scope "${profile.writeScope}" is not allowed here.`
				);
			}
			return profile;
		},
	};
}
