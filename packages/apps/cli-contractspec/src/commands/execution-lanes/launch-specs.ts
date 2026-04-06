import {
	assertValidCompletionLoopSpec,
	assertValidTeamRunSpec,
	type CompletionLoopSpec,
	createLaneSelector,
	type ExecutionPlanPack,
	type TeamRunSpec,
	type VerificationPolicy,
} from '@contractspec/lib.execution-lanes';
import type { CompletionLoopSpecInput, TeamRunSpecInput } from './input';
import type { PlanningMode } from './shared';

type ResolvedCompletionLoopSpec = Omit<
	CompletionLoopSpec,
	'verificationPolicy'
> & {
	verificationPolicy: VerificationPolicy;
};

export function buildExecutionPlanPack(input: {
	request: string;
	objective: string;
	constraints: string[];
	assumptions: string[];
	authorityContext: ExecutionPlanPack['authorityContext'];
	mode: PlanningMode;
	nextLane?: 'complete.persistent' | 'team.coordinated';
}): ExecutionPlanPack {
	const selector = createLaneSelector();
	const selectedLane = selector.select({
		preferredLane: input.nextLane,
		hasPlanPack: true,
		parallelizableTaskCount:
			input.nextLane === 'team.coordinated' ? 3 : undefined,
	});
	const createdAt = new Date().toISOString();
	const planSteps = [
		{
			id: 'understand',
			title: 'Clarify scope',
			description: 'Confirm the task boundaries, invariants, and constraints.',
			acceptanceCriteria: ['Objective and constraints are explicit.'],
			roleHints: ['planner'],
		},
		{
			id: 'implement',
			title:
				selectedLane === 'team.coordinated' ? 'Fan out work' : 'Execute work',
			description:
				selectedLane === 'team.coordinated'
					? 'Split the work into coordinated execution tasks.'
					: 'Run the persistent completion loop until evidence exists.',
			acceptanceCriteria: ['Implementation work is complete.'],
			dependencies: ['understand'],
			roleHints:
				selectedLane === 'team.coordinated'
					? ['executor', 'verifier']
					: ['executor'],
		},
		{
			id: 'verify',
			title: 'Verify and package evidence',
			description: 'Collect approvals, evidence, and replay-safe output.',
			acceptanceCriteria: [
				'Verification results are attached.',
				'Regression tests pass.',
				'Rollback proof is captured for high-risk work.',
			],
			dependencies: ['implement'],
			roleHints: ['verifier'],
		},
	];

	return {
		meta: {
			id: `plan-${Date.now()}`,
			createdAt,
			sourceRequest: input.request,
			scopeClass: input.mode === 'deliberate' ? 'high-risk' : 'medium',
		},
		objective: input.objective,
		constraints: mergeList(
			input.constraints,
			input.mode === 'deliberate' ? ['Preserve auditability and rollback.'] : []
		),
		assumptions: mergeList(
			input.assumptions,
			input.mode === 'deliberate'
				? [
						'High-risk path requires stronger approvals.',
						'Replay-safe evidence is mandatory.',
					]
				: ['Standard planning mode is sufficient.']
		),
		nonGoals: ['Do not bypass policy or approval gates.'],
		tradeoffs: [
			{
				topic: 'Execution lane choice',
				tension: 'Throughput vs closure quality',
				chosenDirection: selectedLane,
				rejectedAlternatives:
					selectedLane === 'team.coordinated'
						? ['complete.persistent']
						: ['team.coordinated'],
			},
		],
		staffing: {
			availableRoleProfiles: [
				'planner',
				'architect',
				'critic',
				'executor',
				'verifier',
				'test-engineer',
				'writer',
			],
			recommendedLanes: [
				{ lane: selectedLane, why: 'Matches the requested execution shape.' },
			],
			handoffRecommendation: {
				nextLane: selectedLane,
				launchHints:
					selectedLane === 'team.coordinated'
						? ['Start team workers and verification lane together.']
						: ['Start persistent completion with verifier sign-off enabled.'],
			},
		},
		planSteps,
		verification: {
			requiredEvidence: ['verification_results'],
			requiredApprovals:
				input.mode === 'deliberate'
					? ['verifier', 'architect', 'human']
					: ['verifier'],
			blockingRisks:
				input.mode === 'deliberate'
					? ['Policy-sensitive or destructive changes require strict sign-off.']
					: [],
		},
		authorityContext: input.authorityContext,
	};
}

export function buildCompletionLoopSpecFromPlanPack(input: {
	runId: string;
	planPack: ExecutionPlanPack;
	completionSpec?: CompletionLoopSpecInput;
}): ResolvedCompletionLoopSpec {
	const requiredApprovals = dedupeRoles(
		input.planPack.verification.requiredApprovals.length > 0
			? input.planPack.verification.requiredApprovals
			: ['verifier']
	);
	const defaults: ResolvedCompletionLoopSpec = {
		id: input.runId,
		ownerRole: 'executor',
		sourcePlanPackId: input.planPack.meta.id,
		snapshotRef: `snapshot://${input.runId}`,
		delegateRoles: dedupeRoles([
			'verifier',
			...(requiredApprovals.includes('architect') ? ['architect'] : []),
			...(input.planPack.staffing.availableRoleProfiles.includes(
				'test-engineer'
			)
				? ['test-engineer']
				: []),
		]),
		progressLedgerRef: `ledger://${input.runId}`,
		verificationPolicy: createVerificationPolicy(
			input.runId,
			input.planPack,
			requiredApprovals
		),
		signoff: {
			verifierRole: 'verifier',
			requireArchitectReview: requiredApprovals.includes('architect'),
			requireHumanApproval: requiredApprovals.includes('human'),
		},
		terminalConditions: ['done', 'blocked', 'failed', 'aborted'],
	};

	return assertValidCompletionLoopSpec({
		...defaults,
		ownerRole: input.completionSpec?.ownerRole ?? defaults.ownerRole,
		snapshotRef: input.completionSpec?.snapshotRef ?? defaults.snapshotRef,
		iterationLimit:
			input.completionSpec?.iterationLimit ?? defaults.iterationLimit,
		delegateRoles:
			input.completionSpec?.delegateRoles ?? defaults.delegateRoles,
		progressLedgerRef:
			input.completionSpec?.progressLedgerRef ?? defaults.progressLedgerRef,
		verificationPolicy: mergeVerificationPolicy(
			defaults.verificationPolicy,
			input.completionSpec?.verificationPolicy
		),
		signoff: {
			...defaults.signoff,
			...(input.completionSpec?.signoff ?? {}),
		},
		terminalConditions:
			input.completionSpec?.terminalConditions ?? defaults.terminalConditions,
	}) as ResolvedCompletionLoopSpec;
}

export function buildTeamRunSpecFromPlanPack(input: {
	runId: string;
	planPack: ExecutionPlanPack;
	teamSpec?: TeamRunSpecInput;
}): TeamRunSpec {
	const defaultWorkers = createDefaultWorkers(input.planPack);
	const defaultSpec: TeamRunSpec = {
		id: input.runId,
		sourcePlanPackId: input.planPack.meta.id,
		objective: input.planPack.objective,
		backendKey: 'in-process',
		workers: defaultWorkers,
		backlog: input.planPack.planSteps.map((step) => ({
			taskId: step.id,
			title: step.title,
			description: step.description,
			roleHint: step.roleHints?.[0],
			dependencies: step.dependencies,
		})),
		coordination: {
			mailbox: true,
			taskLeasing: true,
			heartbeats: true,
			rebalancing: true,
		},
		verificationLane: {
			required: true,
			ownerRole: defaultWorkers.some(
				(worker) => worker.roleProfile === 'verifier'
			)
				? 'verifier'
				: 'human',
		},
		shutdownPolicy: {
			requireTerminalTasks: true,
			requireEvidenceGate: true,
		},
	};

	return assertValidTeamRunSpec({
		...defaultSpec,
		backendKey: input.teamSpec?.backendKey ?? defaultSpec.backendKey,
		workers: input.teamSpec?.workers ?? defaultSpec.workers,
		backlog: input.teamSpec?.backlog ?? defaultSpec.backlog,
		coordination: {
			...defaultSpec.coordination,
			...(input.teamSpec?.coordination ?? {}),
		},
		verificationLane: {
			...defaultSpec.verificationLane,
			...(input.teamSpec?.verificationLane ?? {}),
		},
		shutdownPolicy: {
			...defaultSpec.shutdownPolicy,
			...(input.teamSpec?.shutdownPolicy ?? {}),
		},
	});
}

function createVerificationPolicy(
	runId: string,
	planPack: ExecutionPlanPack,
	requiredApprovals: string[]
): VerificationPolicy {
	const requiredEvidence =
		planPack.verification.requiredEvidence.length > 0
			? [...planPack.verification.requiredEvidence]
			: ['verification_results'];

	return {
		key: `completion.${runId}`,
		requiredEvidence,
		minimumApprovals: requiredApprovals.map((role) => ({
			role,
			verdict: 'approve' as const,
		})),
		failOnMissingEvidence: true,
		allowConditionalCompletion: false,
	};
}

function createDefaultWorkers(
	planPack: ExecutionPlanPack
): TeamRunSpec['workers'] {
	const roles = dedupeRoles([
		...planPack.planSteps.flatMap((step) => step.roleHints ?? []),
		'verifier',
	]);
	const counts = new Map<string, number>();
	return roles.map((role) => {
		const nextCount = (counts.get(role) ?? 0) + 1;
		counts.set(role, nextCount);
		return {
			workerId: `${role}-${nextCount}`,
			roleProfile: role,
			concurrencyClass:
				role === 'planner' ? ('single' as const) : ('parallel' as const),
		};
	});
}

function mergeVerificationPolicy(
	defaults: VerificationPolicy,
	input: CompletionLoopSpecInput['verificationPolicy']
): VerificationPolicy {
	if (!input) {
		return defaults;
	}
	return {
		...defaults,
		...input,
		requiredEvidence: input.requiredEvidence ?? defaults.requiredEvidence,
		minimumApprovals: input.minimumApprovals ?? defaults.minimumApprovals,
	};
}

function dedupeRoles(roles: string[]): string[] {
	return Array.from(new Set(roles.filter(Boolean)));
}

function mergeList(base: string[], fallback: string[]): string[] {
	return Array.from(new Set([...base, ...fallback]));
}
