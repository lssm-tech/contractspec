import {
	type AuthorityContextRefs,
	createRoleGuard,
	DEFAULT_LANES,
	DEFAULT_ROLE_PROFILES,
	ExecutionLaneRegistry,
	type ExecutionScopeClass,
	type LaneRunState,
	RoleProfileRegistry,
} from '@contractspec/lib.execution-lanes';

export type PlanningMode = 'short' | 'deliberate';

export function createLaneRunState(input: {
	runId: string;
	lane: LaneRunState['lane'];
	objective: string;
	sourceRequest: string;
	ownerRole: string;
	scopeClass: ExecutionScopeClass;
	authorityContext: AuthorityContextRefs;
	options?: Record<string, unknown>;
	verificationPolicyKey?: string;
	blockingRisks?: string[];
	pendingApprovalRoles?: string[];
	recommendedNextLane?: LaneRunState['recommendedNextLane'];
}): LaneRunState {
	return {
		runId: input.runId,
		lane: input.lane,
		objective: input.objective,
		sourceRequest: input.sourceRequest,
		scopeClass: input.scopeClass,
		status: 'initialized',
		currentPhase: 'initialized',
		ownerRole: input.ownerRole,
		authorityContext: input.authorityContext,
		verificationPolicyKey: input.verificationPolicyKey ?? input.lane,
		blockingRisks: [...(input.blockingRisks ?? [])],
		pendingApprovalRoles: [...(input.pendingApprovalRoles ?? [])],
		evidenceBundleIds: [],
		recommendedNextLane: input.recommendedNextLane,
		runtimeContext: {
			sessionId:
				typeof input.options?.sessionId === 'string'
					? input.options.sessionId
					: undefined,
			workflowId:
				typeof input.options?.workflowId === 'string'
					? input.options.workflowId
					: undefined,
			traceId:
				typeof input.options?.traceId === 'string'
					? input.options.traceId
					: undefined,
		},
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
	};
}

export function normalizeMode(value: string | undefined): PlanningMode {
	return value === 'deliberate' ? 'deliberate' : 'short';
}

export function normalizeNextLane(
	value: string | undefined
): 'complete.persistent' | 'team.coordinated' {
	return value === 'team.coordinated'
		? 'team.coordinated'
		: 'complete.persistent';
}

export function readStringList(
	value: unknown,
	fallback: string[] = []
): string[] {
	if (!Array.isArray(value)) {
		return [...fallback];
	}
	return value
		.filter((entry): entry is string => typeof entry === 'string')
		.map((entry) => entry.trim())
		.filter(Boolean);
}

export function resolveAuthorityContext(
	options: Record<string, unknown> | undefined,
	fallback?: Partial<AuthorityContextRefs>
): AuthorityContextRefs {
	return {
		policyRefs: readStringList(
			options?.policyRef,
			fallback?.policyRefs ?? ['control-plane.core']
		),
		ruleContextRefs: readStringList(
			options?.ruleRef,
			fallback?.ruleContextRefs ?? ['execution-lanes']
		),
		approvalRefs: readStringList(
			options?.approvalRef,
			fallback?.approvalRefs ?? []
		),
	};
}

export const roleRegistry = new RoleProfileRegistry();
for (const profile of DEFAULT_ROLE_PROFILES) {
	roleRegistry.register(profile);
}

export const roleGuard = createRoleGuard(roleRegistry);

export const laneRegistry = new ExecutionLaneRegistry();
for (const lane of DEFAULT_LANES) {
	laneRegistry.register(lane);
}
