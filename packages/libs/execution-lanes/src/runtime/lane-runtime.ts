import type {
	ApprovalRecord,
	EvidenceBundleRef,
	LaneArtifactRecord,
	LaneRunState,
	LaneStatusView,
	LaneTerminalStatus,
	LaneTransitionRecord,
} from '../types';
import { createId } from '../utils/id';
import { assertLaneAuthority } from './authority-hooks';
import type { LaneRuntimeOptions } from './lane-runtime-options';
import {
	assertLaneTerminalReadiness,
	assertTerminalTransition,
} from './lane-runtime-terminal';
import { syncLaneApprovalState } from './state-sync';
import { buildLaneStatusView } from './status-views';
import type { LaneRuntimeStore } from './store';

export function createLaneRuntime(
	store: LaneRuntimeStore,
	options: LaneRuntimeOptions = {}
) {
	return {
		async startRun(run: LaneRunState, actorId?: string) {
			await assertLaneAuthority(options.hooks, {
				action: 'start_run',
				runId: run.runId,
				lane: run.lane,
				actorId,
			});
			await store.createRun(run);
			return run;
		},
		async transitionRun(
			runId: string,
			input: {
				status?: LaneRunState['status'];
				currentPhase?: string;
				recommendedNextLane?: LaneRunState['recommendedNextLane'];
				terminalReason?: string;
			},
			actorId?: string
		) {
			const current = await store.getRun(runId);
			if (!current) {
				throw new Error(`Execution lane run ${runId} cannot hand off.`);
			}
			await assertLaneAuthority(options.hooks, {
				action: 'transition_run',
				runId,
				lane: current.lane,
				actorId,
				reason: input.terminalReason,
				metadata: {
					status: input.status,
					currentPhase: input.currentPhase,
					recommendedNextLane: input.recommendedNextLane,
				},
			});
			return store.updateRun(runId, (current) => ({
				...current,
				status: input.status ?? current.status,
				currentPhase: input.currentPhase ?? current.currentPhase,
				recommendedNextLane:
					input.recommendedNextLane ?? current.recommendedNextLane,
				terminalReason: input.terminalReason ?? current.terminalReason,
				updatedAt: new Date().toISOString(),
			}));
		},
		async markTerminal(
			runId: string,
			status: LaneTerminalStatus,
			reason?: string,
			actorId?: string
		) {
			const current = await store.getRun(runId);
			if (!current) {
				throw new Error(
					`Execution lane run ${runId} cannot be marked terminal.`
				);
			}
			assertTerminalTransition(current, status, options);
			await assertLaneAuthority(options.hooks, {
				action: 'transition_run',
				runId,
				lane: current.lane,
				actorId,
				reason,
				metadata: { status },
			});
			if (status === 'completed') {
				await assertLaneTerminalReadiness(store, runId, options);
			}
			return this.transitionRun(
				runId,
				{
					status,
					currentPhase: status,
					terminalReason: reason,
				},
				actorId
			);
		},
		async appendArtifact(
			runId: string,
			artifact: Omit<LaneArtifactRecord, 'id'>,
			actorId?: string
		) {
			const run = await store.getRun(runId);
			await assertLaneAuthority(options.hooks, {
				action: 'append_artifact',
				runId,
				lane: run?.lane,
				actorId,
				metadata: { artifactType: artifact.artifactType },
			});
			await store.saveArtifact({
				...artifact,
				id: createId('artifact'),
				runId,
			});
		},
		async appendEvidence(
			runId: string,
			bundle: EvidenceBundleRef,
			actorId?: string
		) {
			const run = await store.getRun(runId);
			await assertLaneAuthority(options.hooks, {
				action: 'append_evidence',
				runId,
				lane: run?.lane,
				actorId,
				metadata: { classes: bundle.classes },
			});
			await store.saveEvidence(bundle);
			await store.updateRun(runId, (current) => ({
				...current,
				evidenceBundleIds: Array.from(
					new Set([...current.evidenceBundleIds, bundle.id])
				),
				updatedAt: new Date().toISOString(),
			}));
		},
		async appendApproval(
			runId: string,
			approval: ApprovalRecord,
			actorId?: string
		) {
			const run = await store.getRun(runId);
			await assertLaneAuthority(options.hooks, {
				action: 'append_approval',
				runId,
				lane: run?.lane,
				actorId,
				metadata: { role: approval.role, state: approval.state },
			});
			await store.saveApproval(approval);
			await syncLaneApprovalState(store, approval);
		},
		async appendEvent(
			runId: string,
			type: string,
			message?: string,
			actorId?: string
		) {
			const run = await store.getRun(runId);
			await assertLaneAuthority(options.hooks, {
				action: 'append_event',
				runId,
				lane: run?.lane,
				actorId,
				reason: message,
				metadata: { type },
			});
			await store.appendEvent({
				id: createId('event'),
				runId,
				type,
				createdAt: new Date().toISOString(),
				message,
			});
		},
		async handoffToLane(
			runId: string,
			to: LaneRunState['recommendedNextLane'],
			reason: string,
			actorId?: string
		): Promise<LaneTransitionRecord> {
			const current = await store.getRun(runId);
			if (!current || !to) {
				throw new Error(`Execution lane run ${runId} cannot hand off.`);
			}
			await assertLaneAuthority(options.hooks, {
				action: 'handoff',
				runId,
				lane: current.lane,
				actorId,
				reason,
				metadata: { to },
			});
			if (current.lane === to) {
				throw new Error(
					`Execution lane run ${runId} cannot hand off to itself.`
				);
			}
			if (
				options.laneRegistry &&
				!options.laneRegistry.canTransition(current.lane, to)
			) {
				throw new Error(
					`Execution lane run ${runId} cannot transition from "${current.lane}" to "${to}".`
				);
			}
			const transition: LaneTransitionRecord = {
				id: createId('transition'),
				runId,
				from: current.lane,
				to,
				reason,
				createdAt: new Date().toISOString(),
				actorId,
			};
			await store.saveTransition(transition);
			await store.updateRun(runId, (entry) => ({
				...entry,
				recommendedNextLane: to,
				updatedAt: new Date().toISOString(),
			}));
			return transition;
		},
		async getStatusView(runId: string): Promise<LaneStatusView | undefined> {
			const snapshot = await store.getSnapshot(runId);
			if (!snapshot) {
				return undefined;
			}
			return buildLaneStatusView(snapshot);
		},
		async getSnapshot(runId: string) {
			return store.getSnapshot(runId);
		},
	};
}
