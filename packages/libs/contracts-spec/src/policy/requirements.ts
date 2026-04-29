import type { PolicyRegistry } from './registry';
import type { PolicyRef } from './spec';

export type PolicyAuthLevel = 'anonymous' | 'user' | 'admin';
export type PolicyFieldAction = 'read' | 'write';

/**
 * Role, permission, and flag requirements shared by guards and declarative
 * contract policy metadata.
 */
export interface CombinedPolicyRequirements {
	/** All listed roles are required. */
	roles?: string[];
	/** At least one listed role is required. */
	anyRole?: string[];
	/** All listed permissions are required. */
	permissions?: string[];
	/** At least one listed permission is required. */
	anyPermission?: string[];
	/** Active feature flags required for access. */
	flags?: string[];
}

/** Field-level policy requirement attached to a declarative surface. */
export interface PolicyFieldRequirement extends CombinedPolicyRequirements {
	field: string;
	actions: PolicyFieldAction[];
	policy?: PolicyRef;
}

/** Generic resource hint passed to policy deciders/evaluators. */
export interface PolicyResourceRequirement {
	type?: string;
	idPath?: string;
	fields?: string[];
}

/**
 * Additive, shared policy requirement shape for ContractSpec surfaces.
 *
 * It intentionally composes the existing guard vocabulary (roles,
 * permissions, flags) with existing policy references. Surface-specific UX
 * behavior (for example hide/disable navigation) belongs in the consuming
 * package, not in this shared type.
 */
export interface PolicyRequirement extends CombinedPolicyRequirements {
	auth?: PolicyAuthLevel;
	policies?: PolicyRef[];
	pii?: string[];
	fieldPolicies?: PolicyFieldRequirement[];
	resource?: PolicyResourceRequirement;
}

/** Policy shape suitable for presentation/data-view/form style surfaces. */
export type SurfacePolicyRequirement = PolicyRequirement;

export interface PolicyRequirementValidationIssue {
	level: 'error' | 'warning' | 'info';
	message: string;
	path?: string;
}

export interface PolicyRequirementValidationResult {
	valid: boolean;
	issues: PolicyRequirementValidationIssue[];
}

export interface PolicyRequirementValidationOptions {
	registry?: PolicyRegistry;
}

const NON_EMPTY_ARRAY_KEYS = [
	'roles',
	'anyRole',
	'permissions',
	'anyPermission',
	'flags',
	'policies',
] as const;

/** Normalize legacy/light policy objects into the shared requirement shape. */
export function normalizePolicyRequirement(
	policy: PolicyRequirement | undefined
): PolicyRequirement | undefined {
	if (!policy) return undefined;
	return { ...policy };
}

export function validatePolicyRequirement(
	requirement: PolicyRequirement | undefined,
	options: PolicyRequirementValidationOptions = {}
): PolicyRequirementValidationResult {
	const issues: PolicyRequirementValidationIssue[] = [];
	if (!requirement) {
		return { valid: true, issues };
	}

	for (const key of NON_EMPTY_ARRAY_KEYS) {
		const value = requirement[key];
		if (Array.isArray(value) && value.length === 0) {
			issues.push({
				level: 'error',
				message: `${key} must be omitted instead of provided as an empty array`,
				path: key,
			});
		}
	}

	checkDuplicates(requirement.roles, 'roles', issues);
	checkDuplicates(requirement.anyRole, 'anyRole', issues);
	checkDuplicates(requirement.permissions, 'permissions', issues);
	checkDuplicates(requirement.anyPermission, 'anyPermission', issues);
	checkDuplicates(requirement.flags, 'flags', issues);
	checkPolicyRefs(requirement.policies, 'policies', options.registry, issues);

	if (
		requirement.auth === 'anonymous' &&
		Boolean(
			requirement.roles?.length ||
				requirement.anyRole?.length ||
				requirement.permissions?.length ||
				requirement.anyPermission?.length ||
				requirement.policies?.length
		)
	) {
		issues.push({
			level: 'warning',
			message:
				'anonymous auth combined with roles, permissions, or policies may be ambiguous',
			path: 'auth',
		});
	}

	requirement.fieldPolicies?.forEach((fieldPolicy, index) => {
		const path = `fieldPolicies[${index}]`;
		if (!fieldPolicy.field?.trim()) {
			issues.push({
				level: 'error',
				message: 'Field policy must specify a field',
				path: `${path}.field`,
			});
		}
		if (!fieldPolicy.actions?.length) {
			issues.push({
				level: 'error',
				message: 'Field policy must specify at least one action',
				path: `${path}.actions`,
			});
		}
		fieldPolicy.actions?.forEach((action, actionIndex) => {
			if (action !== 'read' && action !== 'write') {
				issues.push({
					level: 'error',
					message: `Invalid field policy action: ${String(action)}`,
					path: `${path}.actions[${actionIndex}]`,
				});
			}
		});
		checkDuplicates(fieldPolicy.roles, `${path}.roles`, issues);
		checkDuplicates(fieldPolicy.anyRole, `${path}.anyRole`, issues);
		checkDuplicates(fieldPolicy.permissions, `${path}.permissions`, issues);
		checkDuplicates(fieldPolicy.anyPermission, `${path}.anyPermission`, issues);
		checkDuplicates(fieldPolicy.flags, `${path}.flags`, issues);
		checkPolicyRefs(
			fieldPolicy.policy ? [fieldPolicy.policy] : undefined,
			`${path}.policy`,
			options.registry,
			issues
		);
	});

	return {
		valid: !issues.some((issue) => issue.level === 'error'),
		issues,
	};
}

function checkDuplicates(
	values: string[] | undefined,
	path: string,
	issues: PolicyRequirementValidationIssue[]
): void {
	if (!values?.length) return;
	const seen = new Set<string>();
	for (const value of values) {
		if (seen.has(value)) {
			issues.push({
				level: 'error',
				message: `Duplicate ${path} value: ${value}`,
				path,
			});
			continue;
		}
		seen.add(value);
	}
}

function checkPolicyRefs(
	refs: PolicyRef[] | undefined,
	path: string,
	registry: PolicyRegistry | undefined,
	issues: PolicyRequirementValidationIssue[]
): void {
	if (!refs?.length || !registry) return;
	refs.forEach((ref, index) => {
		if (!registry.get(ref.key, ref.version)) {
			issues.push({
				level: 'error',
				message: `Policy reference not found: ${ref.key}.v${ref.version}`,
				path: `${path}[${index}]`,
			});
		}
	});
}
