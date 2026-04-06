import type { ExecutionPlanPack } from '../../types';
import { validateExecutionPlanPack } from '../../validation/plan-pack';
import {
	assertConsensusArtifactPersistence,
	assertConsensusPlanHandoff,
	type ConsensusPlanningAuthority,
} from './consensus-authority';

export type ConsensusPlanningMode = 'short' | 'deliberate';

export interface PlanReviewRecord {
	reviewerRole: 'architect' | 'critic';
	verdict: 'approve' | 'revise' | 'reject';
	findings: string[];
	recommendedChanges: string[];
	createdAt: string;
}

export interface ConsensusPlanningArtifact {
	id: string;
	type:
		| 'planner_draft'
		| 'planner_revision'
		| 'architect_review'
		| 'critique_verdict'
		| 'plan_pack'
		| 'tradeoff_record';
	iteration: number;
	createdAt: string;
	body: unknown;
}

export interface ConsensusPlanner {
	draft(): Promise<ExecutionPlanPack>;
	revise(input: {
		iteration: number;
		currentPlan: ExecutionPlanPack;
		reviews: PlanReviewRecord[];
	}): Promise<ExecutionPlanPack>;
}

export interface ConsensusReviewer {
	review(plan: ExecutionPlanPack): Promise<PlanReviewRecord>;
}

export interface ConsensusPlanningLaneInput {
	planner: ConsensusPlanner;
	architect: ConsensusReviewer;
	critic: ConsensusReviewer;
	mode?: ConsensusPlanningMode;
	maxIterations?: number;
	enforceReadOnly?: boolean;
	purityGuard?: {
		capture(): Promise<unknown> | unknown;
		assertUnchanged(baseline: unknown): Promise<void> | void;
	};
	artifactSink?: {
		persist(artifact: ConsensusPlanningArtifact): Promise<void> | void;
	};
	authority?: ConsensusPlanningAuthority;
}

export function createConsensusPlanningLane(input: ConsensusPlanningLaneInput) {
	return {
		async run() {
			const mode = input.mode ?? 'short';
			const maxIterations =
				input.maxIterations ?? (mode === 'deliberate' ? 5 : 3);
			const purityBaseline = input.enforceReadOnly
				? await input.purityGuard?.capture()
				: undefined;
			if (input.enforceReadOnly && !input.purityGuard) {
				throw new Error(
					'Consensus planning in read-only mode requires a purity guard.'
				);
			}
			try {
				let plan = await input.planner.draft();
				const reviews: PlanReviewRecord[] = [];
				const artifacts: ConsensusPlanningArtifact[] = [];
				await persistArtifact(artifacts, input, {
					runId: input.authority?.runId ?? plan.meta.id,
					id: createArtifactId('planner_draft', 0),
					type: 'planner_draft',
					iteration: 0,
					createdAt: new Date().toISOString(),
					body: { mode, plan },
				});

				for (let iteration = 1; iteration <= maxIterations; iteration += 1) {
					const architectReview = await input.architect.review(plan);
					const criticReview = withPlanValidation(
						await input.critic.review(plan),
						plan,
						mode
					);
					reviews.push(architectReview, criticReview);
					await persistArtifact(artifacts, input, {
						runId: input.authority?.runId ?? plan.meta.id,
						id: createArtifactId('architect_review', iteration),
						type: 'architect_review',
						iteration,
						createdAt: architectReview.createdAt,
						body: architectReview,
					});
					await persistArtifact(artifacts, input, {
						runId: input.authority?.runId ?? plan.meta.id,
						id: createArtifactId('critique_verdict', iteration),
						type: 'critique_verdict',
						iteration,
						createdAt: criticReview.createdAt,
						body: criticReview,
					});
					await persistArtifact(artifacts, input, {
						runId: input.authority?.runId ?? plan.meta.id,
						id: createArtifactId('tradeoff_record', iteration),
						type: 'tradeoff_record',
						iteration,
						createdAt: new Date().toISOString(),
						body: plan.tradeoffs,
					});

					if (
						architectReview.verdict === 'approve' &&
						criticReview.verdict === 'approve'
					) {
						await persistArtifact(artifacts, input, {
							runId: input.authority?.runId ?? plan.meta.id,
							id: createArtifactId('plan_pack', iteration),
							type: 'plan_pack',
							iteration,
							createdAt: new Date().toISOString(),
							body: plan,
						});
						await assertConsensusPlanHandoff(input.authority, plan, mode);
						return {
							mode,
							plan,
							reviews,
							artifacts,
							approved: true,
							iterations: iteration,
						};
					}

					plan = await input.planner.revise({
						iteration,
						currentPlan: plan,
						reviews: [architectReview, criticReview],
					});
					await persistArtifact(artifacts, input, {
						runId: input.authority?.runId ?? plan.meta.id,
						id: createArtifactId('planner_revision', iteration),
						type: 'planner_revision',
						iteration,
						createdAt: new Date().toISOString(),
						body: { mode, plan, reviews: [architectReview, criticReview] },
					});
				}

				await persistArtifact(artifacts, input, {
					runId: input.authority?.runId ?? plan.meta.id,
					id: createArtifactId('plan_pack', maxIterations),
					type: 'plan_pack',
					iteration: maxIterations,
					createdAt: new Date().toISOString(),
					body: plan,
				});
				await assertConsensusPlanHandoff(input.authority, plan, mode);
				return {
					mode,
					plan,
					reviews,
					artifacts,
					approved: false,
					iterations: maxIterations,
				};
			} finally {
				if (input.enforceReadOnly) {
					await input.purityGuard?.assertUnchanged(purityBaseline);
				}
			}
		},
	};
}

function withPlanValidation(
	review: PlanReviewRecord,
	plan: ExecutionPlanPack,
	mode: ConsensusPlanningMode
): PlanReviewRecord {
	const findings = validateExecutionPlanPack(plan).map(
		(issue) => issue.message
	);
	if (mode === 'deliberate') {
		if (
			!plan.constraints.some((constraint) =>
				constraint.toLowerCase().includes('rollback')
			) &&
			!plan.assumptions.some((assumption) =>
				assumption.toLowerCase().includes('rollback')
			)
		) {
			findings.push('Deliberate plans must describe rollback expectations.');
		}
		if (
			!plan.planSteps.some((step) =>
				step.acceptanceCriteria.some((criterion) =>
					criterion.toLowerCase().includes('test')
				)
			)
		) {
			findings.push('Deliberate plans must include explicit test hardening.');
		}
	}
	if (findings.length === 0) {
		return review;
	}
	return {
		...review,
		verdict: review.verdict === 'reject' ? 'reject' : 'revise',
		findings: [...review.findings, ...findings],
		recommendedChanges: [...review.recommendedChanges, ...findings],
	};
}

async function persistArtifact(
	artifacts: ConsensusPlanningArtifact[],
	input: ConsensusPlanningLaneInput,
	artifact: ConsensusPlanningArtifact & { runId: string }
) {
	const { runId, ...persistedArtifact } = artifact;
	await assertConsensusArtifactPersistence(
		input.authority,
		runId,
		persistedArtifact.type
	);
	artifacts.push(persistedArtifact);
	await input.artifactSink?.persist(persistedArtifact);
}

function createArtifactId(
	type: ConsensusPlanningArtifact['type'],
	iteration: number
): string {
	return `${type}-${iteration}-${Date.now()}`;
}
