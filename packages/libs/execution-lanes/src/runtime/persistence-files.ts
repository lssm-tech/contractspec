import type {
	ApprovalRecord,
	EvidenceBundleRef,
	LaneArtifactRecord,
	LaneEventRecord,
	LanePersistenceFiles,
	LanePersistenceHydrationPayload,
	LanePersistenceStateFile,
	LaneRunState,
	LaneRuntimeSnapshot,
	LaneTransitionRecord,
	TeamHeartbeatRecord,
	TeamMailboxMessage,
	TeamPersistenceStateSlice,
	TeamRunState,
	TeamTaskFileRecord,
	TeamTaskLeaseFileRecord,
	TeamWorkerState,
} from '../types';
import { normalizeExecutionLaneArtifactType } from '../types';
import {
	parseJson,
	parseNdjson,
	parseOptionalJson,
	parseOptionalNdjson,
	toJson,
	toNdjson,
} from './persistence-files-codec';
import type { LaneRuntimeStore } from './store';

export function createLanePersistenceFiles(
	snapshot: LaneRuntimeSnapshot
): LanePersistenceFiles {
	const files: LanePersistenceFiles = {
		'laneRun.json': toJson(snapshot.run),
		'state.json': toJson(createPersistenceStateFile(snapshot)),
		'events.ndjson': toNdjson(snapshot.events),
		'artifacts.json': toJson(snapshot.artifacts),
		'evidence.json': toJson(snapshot.evidence),
		'approvals.json': toJson(snapshot.approvals),
		'transitions.json': toJson(snapshot.transitions),
	};

	if (snapshot.team) {
		const teamFiles = createTeamPersistenceFiles(snapshot);
		files['workers.json'] = toJson(teamFiles.workers);
		files['tasks.json'] = toJson(teamFiles.tasks);
		files['leases.json'] = toJson(teamFiles.leases);
		files['mailbox.ndjson'] = toNdjson(teamFiles.mailbox);
		files['heartbeats.ndjson'] = toNdjson(teamFiles.heartbeats);
		files['terminal-state.json'] = toJson(teamFiles.terminalState);
	}

	return files;
}

export async function hydrateLaneRuntimeStore(
	store: LaneRuntimeStore,
	files: LanePersistenceFiles
): Promise<LaneRuntimeSnapshot> {
	const payload = parseLanePersistenceFiles(files);

	await store.createRun(payload.run);
	for (const event of payload.events) {
		await store.appendEvent(event);
	}
	for (const transition of payload.transitions) {
		await store.saveTransition(transition);
	}
	for (const artifact of payload.artifacts) {
		await store.saveArtifact(artifact);
	}
	for (const evidence of payload.evidence) {
		await store.saveEvidence(evidence);
	}
	for (const approval of payload.approvals) {
		await store.saveApproval(approval);
	}
	if (payload.state.completion) {
		await store.saveCompletion(payload.state.completion);
	}
	if (payload.state.team) {
		await store.saveTeam(rebuildTeamState(payload));
	}

	const snapshot = await store.getSnapshot(payload.run.runId);
	if (!snapshot) {
		throw new Error(
			`Failed to hydrate lane runtime store for run ${payload.run.runId}.`
		);
	}
	return snapshot;
}

function createPersistenceStateFile(
	snapshot: LaneRuntimeSnapshot
): LanePersistenceStateFile {
	return {
		completion: snapshot.completion,
		team: snapshot.team ? createTeamStateSlice(snapshot.team) : undefined,
	};
}

function createTeamStateSlice(team: TeamRunState): TeamPersistenceStateSlice {
	return {
		runId: team.runId,
		spec: team.spec,
		status: team.status,
		cleanup: team.cleanup,
		evidenceBundleIds: team.evidenceBundleIds,
		createdAt: team.createdAt,
		updatedAt: team.updatedAt,
		terminalReason: team.terminalReason,
		terminalStateArtifactId: team.terminalStateArtifactId,
	};
}

function createTeamPersistenceFiles(snapshot: LaneRuntimeSnapshot) {
	const team = snapshot.team!;
	const tasks: TeamTaskFileRecord[] = team.tasks.map(
		({ lease, ...task }) => task
	);
	const leases: TeamTaskLeaseFileRecord[] = team.tasks
		.filter((task) => task.lease)
		.map((task) => ({
			taskId: task.taskId,
			lease: task.lease!,
		}));
	return {
		workers: team.workers,
		tasks,
		leases,
		mailbox: team.mailbox,
		heartbeats: team.heartbeatLog,
		terminalState: resolveTerminalState(snapshot),
	};
}

function resolveTerminalState(snapshot: LaneRuntimeSnapshot): unknown {
	if (!snapshot.team) {
		return null;
	}
	const artifact =
		(snapshot.team.terminalStateArtifactId
			? snapshot.artifacts.find(
					(entry) => entry.id === snapshot.team?.terminalStateArtifactId
				)
			: undefined) ??
		[...snapshot.artifacts]
			.reverse()
			.find(
				(entry) =>
					normalizeExecutionLaneArtifactType(String(entry.artifactType)) ===
					'terminal_state'
			);
	return artifact?.body ?? null;
}

function parseLanePersistenceFiles(
	files: LanePersistenceFiles
): LanePersistenceHydrationPayload {
	return {
		run: parseJson<LaneRunState>('laneRun.json', files['laneRun.json']),
		state: parseJson<LanePersistenceStateFile>(
			'state.json',
			files['state.json']
		),
		events: parseNdjson<LaneEventRecord>(
			'events.ndjson',
			files['events.ndjson']
		),
		transitions: parseJson<LaneTransitionRecord[]>(
			'transitions.json',
			files['transitions.json']
		),
		artifacts: parseJson<LaneArtifactRecord[]>(
			'artifacts.json',
			files['artifacts.json']
		),
		evidence: parseJson<EvidenceBundleRef[]>(
			'evidence.json',
			files['evidence.json']
		),
		approvals: parseJson<ApprovalRecord[]>(
			'approvals.json',
			files['approvals.json']
		),
		workers: parseOptionalJson<TeamWorkerState[]>(
			'workers.json',
			files['workers.json'],
			[]
		),
		tasks: parseOptionalJson<TeamTaskFileRecord[]>(
			'tasks.json',
			files['tasks.json'],
			[]
		),
		leases: parseOptionalJson<TeamTaskLeaseFileRecord[]>(
			'leases.json',
			files['leases.json'],
			[]
		),
		mailbox: parseOptionalNdjson<TeamMailboxMessage>(
			'mailbox.ndjson',
			files['mailbox.ndjson'],
			[]
		),
		heartbeats: parseOptionalNdjson<TeamHeartbeatRecord>(
			'heartbeats.ndjson',
			files['heartbeats.ndjson'],
			[]
		),
		terminalState: parseOptionalJson<unknown>(
			'terminal-state.json',
			files['terminal-state.json'],
			null
		),
	};
}

function rebuildTeamState(
	payload: LanePersistenceHydrationPayload
): TeamRunState {
	const team = payload.state.team!;
	const leaseMap = new Map(
		payload.leases.map((entry) => [entry.taskId, entry.lease] as const)
	);
	return {
		...team,
		workers: payload.workers,
		tasks: payload.tasks.map((task) => ({
			...task,
			lease: leaseMap.get(task.taskId),
		})),
		mailbox: payload.mailbox,
		heartbeatLog: payload.heartbeats,
	};
}
