import type { PolicyDecision } from '@contractspec/lib.contracts-spec';
import {
	checkCombinedPolicy,
	createPolicyContext,
	PolicyEngine,
	PolicyRegistry,
	type PolicyRequirement,
} from '@contractspec/lib.contracts-spec/policy';

/**
 * Standard permissions for identity-rbac module.
 */
export const Permission = {
	// User permissions
	USER_CREATE: 'user.create',
	USER_READ: 'user.read',
	USER_UPDATE: 'user.update',
	USER_DELETE: 'user.delete',
	USER_LIST: 'user.list',
	USER_MANAGE: 'user.manage',

	// Organization permissions
	ORG_CREATE: 'org.create',
	ORG_READ: 'org.read',
	ORG_UPDATE: 'org.update',
	ORG_DELETE: 'org.delete',
	ORG_LIST: 'org.list',

	// Member permissions
	MEMBER_INVITE: 'member.invite',
	MEMBER_REMOVE: 'member.remove',
	MEMBER_UPDATE_ROLE: 'member.update_role',
	MEMBER_LIST: 'member.list',
	MANAGE_MEMBERS: 'org.manage_members',

	// Team permissions
	TEAM_CREATE: 'team.create',
	TEAM_UPDATE: 'team.update',
	TEAM_DELETE: 'team.delete',
	TEAM_MANAGE: 'team.manage',

	// Role permissions
	ROLE_CREATE: 'role.create',
	ROLE_UPDATE: 'role.update',
	ROLE_DELETE: 'role.delete',
	ROLE_ASSIGN: 'role.assign',
	ROLE_REVOKE: 'role.revoke',

	// Billing permissions
	BILLING_VIEW: 'billing.view',
	BILLING_MANAGE: 'billing.manage',

	// Project permissions
	PROJECT_CREATE: 'project.create',
	PROJECT_READ: 'project.read',
	PROJECT_UPDATE: 'project.update',
	PROJECT_DELETE: 'project.delete',
	PROJECT_MANAGE: 'project.manage',

	// Admin permissions
	ADMIN_ACCESS: 'admin.access',
	ADMIN_IMPERSONATE: 'admin.impersonate',
} as const;

export type PermissionKey = (typeof Permission)[keyof typeof Permission];

/**
 * Standard role definitions.
 */
export const StandardRole = {
	OWNER: {
		name: 'owner',
		description: 'Organization owner with full access',
		permissions: Object.values(Permission),
	},
	ADMIN: {
		name: 'admin',
		description: 'Administrator with most permissions',
		permissions: [
			Permission.USER_READ,
			Permission.USER_LIST,
			Permission.ORG_READ,
			Permission.ORG_UPDATE,
			Permission.MEMBER_INVITE,
			Permission.MEMBER_REMOVE,
			Permission.MEMBER_UPDATE_ROLE,
			Permission.MEMBER_LIST,
			Permission.MANAGE_MEMBERS,
			Permission.TEAM_CREATE,
			Permission.TEAM_UPDATE,
			Permission.TEAM_DELETE,
			Permission.TEAM_MANAGE,
			Permission.PROJECT_CREATE,
			Permission.PROJECT_READ,
			Permission.PROJECT_UPDATE,
			Permission.PROJECT_DELETE,
			Permission.PROJECT_MANAGE,
			Permission.BILLING_VIEW,
		],
	},
	MEMBER: {
		name: 'member',
		description: 'Regular organization member',
		permissions: [
			Permission.USER_READ,
			Permission.ORG_READ,
			Permission.MEMBER_LIST,
			Permission.PROJECT_READ,
			Permission.PROJECT_CREATE,
		],
	},
	VIEWER: {
		name: 'viewer',
		description: 'Read-only access',
		permissions: [
			Permission.USER_READ,
			Permission.ORG_READ,
			Permission.MEMBER_LIST,
			Permission.PROJECT_READ,
		],
	},
} as const;

/**
 * Permission check input.
 */
export interface PermissionCheckInput {
	userId: string;
	orgId?: string;
	permission: PermissionKey | string;
}

/**
 * Permission check result.
 */
export interface PermissionCheckResult {
	allowed: boolean;
	reason?: string;
	matchedRole?: string;
}

export type AuthorizationMode = 'static' | 'dynamic' | 'hybrid';
export type AuthorizationSource = 'static' | 'dynamic' | 'template';
export type AuthorizationEffect = 'grant' | 'deny';
export type AuthorizationScopeType =
	| 'global'
	| 'tenant'
	| 'workspace'
	| 'organization'
	| 'user';

/**
 * Role with permissions.
 */
export interface RoleWithPermissions {
	id: string;
	name: string;
	permissions: string[];
	description?: string;
	source?: AuthorizationSource;
	templateKey?: string;
	templateVersion?: string;
	disabledAt?: Date | null;
}

/**
 * Policy binding for permission evaluation.
 */
export interface PolicyBindingForEval {
	roleId: string;
	role: RoleWithPermissions;
	targetType: 'user' | 'organization' | 'workspace' | 'tenant';
	targetId: string;
	expiresAt?: Date | null;
	scopeType?: AuthorizationScopeType;
	scopeId?: string;
	tenantId?: string;
	workspaceId?: string;
	source?: AuthorizationSource;
	templateKey?: string;
	templateVersion?: string;
	effect?: AuthorizationEffect;
	disabledAt?: Date | null;
	reason?: string;
}

export interface AuthorizationSubjectContext {
	userId: string;
	orgId?: string;
	organizationId?: string;
	tenantId?: string;
	workspaceId?: string;
	roles?: string[];
	permissions?: string[];
	attributes?: Record<string, unknown>;
	flags?: string[];
}

export interface EffectiveAccess {
	permissions: Set<string>;
	roles: RoleWithPermissions[];
	deniedPermissions: Set<string>;
	deniedRoles: Set<string>;
	source: AuthorizationMode | AuthorizationSource;
	reasons: string[];
	sourceUnavailable?: boolean;
}

export interface RolePermissionSource {
	resolveEffectiveAccess(
		context: AuthorizationSubjectContext
	): Promise<EffectiveAccess> | EffectiveAccess;
}

export interface RequirementEvaluationInput {
	requirement: PolicyRequirement;
	subject: AuthorizationSubjectContext;
	bindings?: PolicyBindingForEval[];
	mode?: AuthorizationMode;
	policyRegistry?: PolicyRegistry;
	source?: RolePermissionSource;
	failClosedOnSourceUnavailable?: boolean;
}

export interface RequirementEvaluationResult extends PolicyDecision {
	effect: 'allow' | 'deny';
	mode: AuthorizationMode;
	roles: RoleWithPermissions[];
	permissions: string[];
	deniedPermissions?: string[];
	deniedRoles?: string[];
}

export class StaticRolePermissionSource implements RolePermissionSource {
	constructor(private readonly bindings: PolicyBindingForEval[] = []) {}

	resolveEffectiveAccess(
		context: AuthorizationSubjectContext
	): EffectiveAccess {
		return resolveEffectiveAccessFromBindings(context, this.bindings, 'static');
	}
}

/**
 * RBAC Policy Engine for permission checks.
 */
export class RBACPolicyEngine {
	/**
	 * Check if a user has a specific permission.
	 */
	async checkPermission(
		input: PermissionCheckInput,
		bindings: PolicyBindingForEval[]
	): Promise<PermissionCheckResult> {
		const { userId, orgId, permission } = input;
		const access = resolveEffectiveAccessFromBindings(
			{ userId, orgId },
			bindings,
			'static'
		);

		if (access.deniedPermissions.has(permission)) {
			return {
				allowed: false,
				reason: `Explicit deny for the "${permission}" permission`,
			};
		}

		if (access.permissions.has(permission)) {
			return {
				allowed: true,
				matchedRole: access.roles.find((role) =>
					role.permissions.includes(permission)
				)?.name,
			};
		}

		return {
			allowed: false,
			reason: access.roles.length
				? `No role grants the "${permission}" permission`
				: 'No active role bindings found',
		};
	}

	/**
	 * Get all permissions for a user in a context.
	 */
	async getPermissions(
		userId: string,
		orgId: string | undefined,
		bindings: PolicyBindingForEval[]
	): Promise<{
		permissions: Set<string>;
		roles: RoleWithPermissions[];
	}> {
		const access = resolveEffectiveAccessFromBindings(
			{ userId, orgId },
			bindings,
			'static'
		);
		return { permissions: access.permissions, roles: access.roles };
	}

	/**
	 * Check if user has any of the specified permissions.
	 */
	async hasAnyPermission(
		userId: string,
		orgId: string | undefined,
		permissions: string[],
		bindings: PolicyBindingForEval[]
	): Promise<boolean> {
		const { permissions: userPerms } = await this.getPermissions(
			userId,
			orgId,
			bindings
		);

		return permissions.some((p) => userPerms.has(p));
	}

	/**
	 * Check if user has all of the specified permissions.
	 */
	async hasAllPermissions(
		userId: string,
		orgId: string | undefined,
		permissions: string[],
		bindings: PolicyBindingForEval[]
	): Promise<boolean> {
		const { permissions: userPerms } = await this.getPermissions(
			userId,
			orgId,
			bindings
		);

		return permissions.every((p) => userPerms.has(p));
	}

	/**
	 * Evaluate a shared ContractSpec policy requirement against RBAC bindings or a
	 * caller-provided source. Uses contracts-spec PolicyContext/combined guards
	 * for role/permission/flag checks instead of duplicating guard semantics.
	 */
	async evaluateRequirement(
		input: RequirementEvaluationInput
	): Promise<RequirementEvaluationResult> {
		const mode = input.mode ?? (input.source ? 'dynamic' : 'static');
		let access: EffectiveAccess;
		try {
			access = input.source
				? await input.source.resolveEffectiveAccess(input.subject)
				: resolveEffectiveAccessFromBindings(
						input.subject,
						input.bindings ?? [],
						mode
					);
		} catch (error) {
			if (input.failClosedOnSourceUnavailable ?? true) {
				return {
					effect: 'deny',
					mode,
					reason: 'source_unavailable',
					source: mode,
					roles: [],
					permissions: [],
					missing: collectMissing(input.requirement),
				};
			}
			throw error;
		}

		if (
			access.sourceUnavailable &&
			(input.failClosedOnSourceUnavailable ?? true)
		) {
			return {
				effect: 'deny',
				mode,
				reason: 'source_unavailable',
				source: mode,
				roles: access.roles,
				permissions: [...access.permissions],
				missing: collectMissing(input.requirement),
			};
		}

		access = normalizeEffectiveAccessDenials(access);
		const subjectRoles = (input.subject.roles ?? []).filter(
			(role) => !access.deniedRoles.has(role)
		);
		const explicitDenial = findExplicitDenial(
			input.requirement,
			access,
			subjectRoles
		);
		if (explicitDenial.permissions.length || explicitDenial.roles.length) {
			return {
				effect: 'deny',
				mode,
				reason: explicitDenialReason(explicitDenial),
				source: mode,
				roles: access.roles,
				permissions: [...access.permissions],
				deniedPermissions: explicitDenial.permissions,
				deniedRoles: explicitDenial.roles,
				missing: {
					permissions: explicitDenial.permissions,
					roles: explicitDenial.roles,
				},
			};
		}

		const policyContext = createPolicyContext({
			id: input.subject.userId,
			tenantId: input.subject.tenantId,
			roles: [...subjectRoles, ...access.roles.map((role) => role.name)],
			permissions: [
				...(input.subject.permissions ?? []),
				...access.permissions,
			],
			attributes: input.subject.attributes ?? {},
		});

		const combined = checkCombinedPolicy(
			policyContext,
			input.requirement,
			input.subject.flags ?? []
		);
		if (!combined.allowed) {
			return {
				effect: 'deny',
				mode,
				reason: combined.reason,
				source: mode,
				roles: access.roles,
				permissions: [...access.permissions],
				missing: combined.missing,
			};
		}

		if (input.requirement.policies?.length && input.policyRegistry) {
			const decision = new PolicyEngine(input.policyRegistry).decide({
				action: 'access',
				subject: {
					roles: [...policyContext.roles],
					attributes: input.subject.attributes,
				},
				resource: {
					type: input.requirement.resource?.type ?? 'contractspec.surface',
					fields: input.requirement.resource?.fields,
				},
				policies: input.requirement.policies,
			});
			if (decision.effect === 'deny') {
				return {
					...decision,
					mode,
					source: mode,
					roles: access.roles,
					permissions: [...access.permissions],
				};
			}
		}

		return {
			effect: 'allow',
			mode,
			reason: access.reasons[0],
			source: mode,
			roles: access.roles,
			permissions: [...access.permissions],
			matched: matchGrant(input.requirement, access, subjectRoles),
		};
	}
}

function resolveEffectiveAccessFromBindings(
	context: AuthorizationSubjectContext,
	bindings: PolicyBindingForEval[],
	source: AuthorizationMode | AuthorizationSource
): EffectiveAccess {
	const permissions = new Set(context.permissions ?? []);
	const deniedPermissions = new Set<string>();
	const deniedRoles = new Set<string>();
	let roles: RoleWithPermissions[] = [];
	const reasons: string[] = [];
	const now = new Date();

	for (const binding of bindings) {
		if (!bindingAppliesToSubject(binding, context)) continue;
		if (!bindingInScope(binding, context)) continue;
		if (binding.expiresAt && binding.expiresAt <= now) continue;
		if (binding.disabledAt || binding.role.disabledAt) {
			for (const permission of binding.role.permissions) {
				deniedPermissions.add(permission);
			}
			deniedRoles.add(binding.role.name);
			reasons.push(binding.reason ?? `Disabled role ${binding.role.name}`);
			continue;
		}

		if (binding.effect === 'deny') {
			for (const permission of binding.role.permissions) {
				deniedPermissions.add(permission);
			}
			deniedRoles.add(binding.role.name);
			reasons.push(binding.reason ?? `Denied role ${binding.role.name}`);
			continue;
		}

		roles.push(binding.role);
		for (const permission of binding.role.permissions) {
			permissions.add(permission);
		}
	}

	for (const permission of deniedPermissions) {
		permissions.delete(permission);
	}
	if (deniedRoles.size) {
		roles = roles.filter((role) => !deniedRoles.has(role.name));
	}

	return {
		permissions,
		roles,
		deniedPermissions,
		deniedRoles,
		source,
		reasons,
	};
}

function normalizeEffectiveAccessDenials(
	access: EffectiveAccess
): EffectiveAccess {
	if (!access.deniedPermissions.size && !access.deniedRoles.size) {
		return access;
	}
	const permissions = new Set(access.permissions);
	const deniedRolePermissions = access.roles
		.filter((role) => access.deniedRoles.has(role.name))
		.flatMap((role) => role.permissions);
	for (const permission of [
		...access.deniedPermissions,
		...deniedRolePermissions,
	]) {
		permissions.delete(permission);
	}
	return {
		...access,
		permissions,
		roles: access.roles.filter((role) => !access.deniedRoles.has(role.name)),
	};
}

function bindingAppliesToSubject(
	binding: PolicyBindingForEval,
	context: AuthorizationSubjectContext
): boolean {
	if (binding.targetType === 'user') return binding.targetId === context.userId;
	if (binding.targetType === 'organization') {
		return binding.targetId === (context.organizationId ?? context.orgId);
	}
	if (binding.targetType === 'workspace') {
		return binding.targetId === context.workspaceId;
	}
	if (binding.targetType === 'tenant') {
		return binding.targetId === context.tenantId;
	}
	return false;
}

function bindingInScope(
	binding: PolicyBindingForEval,
	context: AuthorizationSubjectContext
): boolean {
	if (binding.tenantId && binding.tenantId !== context.tenantId) return false;
	if (binding.workspaceId && binding.workspaceId !== context.workspaceId) {
		return false;
	}
	if (
		!binding.scopeType ||
		!binding.scopeId ||
		binding.scopeType === 'global'
	) {
		return true;
	}
	if (binding.scopeType === 'tenant')
		return binding.scopeId === context.tenantId;
	if (binding.scopeType === 'workspace') {
		return binding.scopeId === context.workspaceId;
	}
	if (binding.scopeType === 'organization') {
		return binding.scopeId === (context.organizationId ?? context.orgId);
	}
	if (binding.scopeType === 'user') return binding.scopeId === context.userId;
	return false;
}

interface ExplicitDenialMatch {
	permissions: string[];
	roles: string[];
}

function findExplicitDenial(
	requirement: PolicyRequirement,
	access: EffectiveAccess,
	subjectRoles: string[]
): ExplicitDenialMatch {
	return {
		permissions: findDeniedPermissions(requirement, access),
		roles: findDeniedRoles(requirement, access, subjectRoles),
	};
}

function findDeniedPermissions(
	requirement: PolicyRequirement,
	access: EffectiveAccess
): string[] {
	const requiredAll = requirement.permissions ?? [];
	const requiredAny = requirement.anyPermission ?? [];
	const deniedAll = requiredAll.filter((permission) =>
		access.deniedPermissions.has(permission)
	);
	const grantedAny = requiredAny.some((permission) =>
		access.permissions.has(permission)
	);
	const deniedAny = grantedAny
		? []
		: requiredAny.filter((permission) =>
				access.deniedPermissions.has(permission)
			);
	return [...deniedAll, ...deniedAny];
}

function findDeniedRoles(
	requirement: PolicyRequirement,
	access: EffectiveAccess,
	subjectRoles: string[]
): string[] {
	const requiredAll = requirement.roles ?? [];
	const requiredAny = requirement.anyRole ?? [];
	const grantedRoleNames = new Set([
		...subjectRoles,
		...access.roles.map((role) => role.name),
	]);
	const deniedAll = requiredAll.filter((role) => access.deniedRoles.has(role));
	const grantedAny = requiredAny.some((role) => grantedRoleNames.has(role));
	const deniedAny = grantedAny
		? []
		: requiredAny.filter((role) => access.deniedRoles.has(role));
	return [...deniedAll, ...deniedAny];
}

function explicitDenialReason(denial: ExplicitDenialMatch): string {
	const parts: string[] = [];
	if (denial.permissions.length) {
		parts.push(`permissions: ${denial.permissions.join(', ')}`);
	}
	if (denial.roles.length) {
		parts.push(`roles: ${denial.roles.join(', ')}`);
	}
	return `Explicit deny for ${parts.join('; ')}`;
}

function collectMissing(
	requirement: PolicyRequirement
): PolicyDecision['missing'] {
	return {
		roles: [...(requirement.roles ?? []), ...(requirement.anyRole ?? [])],
		permissions: [
			...(requirement.permissions ?? []),
			...(requirement.anyPermission ?? []),
		],
		flags: requirement.flags,
		policies: requirement.policies?.map(
			(policy) => `${policy.key}.v${policy.version}`
		),
	};
}

function matchGrant(
	requirement: PolicyRequirement,
	access: EffectiveAccess,
	subjectRoles: string[] = []
): PolicyDecision['matched'] {
	const requiredRoles = [
		...(requirement.roles ?? []),
		...(requirement.anyRole ?? []),
	];
	const role =
		access.roles.find((candidate) => requiredRoles.includes(candidate.name))
			?.name ??
		subjectRoles.find((candidate) => requiredRoles.includes(candidate));
	const permission = [
		...(requirement.permissions ?? []),
		...(requirement.anyPermission ?? []),
	].find((candidate) => access.permissions.has(candidate));
	const policy = requirement.policies?.[0];
	return {
		role,
		permission,
		policy: policy ? `${policy.key}.v${policy.version}` : undefined,
	};
}

/**
 * Create a new RBAC policy engine instance.
 */
export function createRBACEngine(): RBACPolicyEngine {
	return new RBACPolicyEngine();
}
