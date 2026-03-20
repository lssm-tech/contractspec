import {
	HarnessEvaluationRunner,
	type HarnessReplayBundle,
	type HarnessReplaySink,
	HarnessRunner,
} from '@contractspec/lib.harness';
import { createAgentConsoleDemoHandlers } from '../shared/demo-runtime';
import {
	AGENT_CONSOLE_DEMO_ORGANIZATION_ID,
	AGENT_CONSOLE_DEMO_PROJECT_ID,
} from '../shared/demo-runtime-seed';
import {
	createMeetupEntityIdFactory,
	createMeetupProofAdapter,
	createProofIdFactory,
	createProofNow,
	MemoryArtifactStore,
} from './meetup-proof.runtime';
import { AGENT_CONSOLE_MEETUP_PROOF_SCENARIO } from './meetup-proof.scenario';

function isHarnessReplayBundle(value: unknown): value is HarnessReplayBundle {
	return (
		typeof value === 'object' &&
		value !== null &&
		'version' in value &&
		'run' in value &&
		'assertions' in value &&
		'artifacts' in value
	);
}

export async function runAgentConsoleMeetupProof(input?: {
	projectId?: string;
	organizationId?: string;
	replaySink?: HarnessReplaySink;
}) {
	const projectId = input?.projectId ?? AGENT_CONSOLE_DEMO_PROJECT_ID;
	const organizationId =
		input?.organizationId ?? AGENT_CONSOLE_DEMO_ORGANIZATION_ID;
	const harnessNow = createProofNow();
	const handlers = createAgentConsoleDemoHandlers({
		projectId,
		organizationId,
		now: createProofNow(),
		idFactory: createMeetupEntityIdFactory(),
	});
	const executionState = {
		agentId: '',
		runId: '',
	};
	const artifactStore = new MemoryArtifactStore();
	const replayUris: string[] = [];
	let replayBundle: HarnessReplayBundle | null = null;
	const adapter = createMeetupProofAdapter({
		handlers,
		projectId,
		organizationId,
		state: executionState,
	});

	const replaySink: HarnessReplaySink = {
		async save(bundle: unknown) {
			if (!isHarnessReplayBundle(bundle)) {
				throw new Error('Replay sink received an invalid harness bundle.');
			}
			replayBundle = bundle;
			const delegatedUri = await input?.replaySink?.save(bundle);
			const uri = delegatedUri ?? 'memory://agent-console-meetup-proof';
			replayUris.push(uri);
			return uri;
		},
	};

	const runner = new HarnessRunner({
		targetResolver: {
			async resolve() {
				return {
					targetId: 'sandbox-agent-console',
					kind: 'sandbox',
					isolation: 'sandbox',
					environment: 'local',
					baseUrl: 'https://sandbox.contractspec.local/agent-console',
					allowlistedDomains: ['sandbox.contractspec.local'],
				};
			},
		},
		artifactStore,
		adapters: [adapter],
		approvalGateway: {
			async approve() {
				return { approved: true, approverId: 'meetup-proof' };
			},
		},
		now: harnessNow,
		idFactory: createProofIdFactory('proof'),
		defaultMode: 'code-execution',
	});
	const evaluationRunner = new HarnessEvaluationRunner({
		runner,
		replaySink,
		now: harnessNow,
		idFactory: createProofIdFactory('evaluation'),
	});
	const evaluation = await evaluationRunner.runScenarioEvaluation({
		scenario: AGENT_CONSOLE_MEETUP_PROOF_SCENARIO,
		mode: 'code-execution',
		target: {
			targetId: 'sandbox-agent-console',
			isolation: 'sandbox',
			baseUrl: 'https://sandbox.contractspec.local/agent-console',
			allowlistedDomains: ['sandbox.contractspec.local'],
		},
		context: {
			metadata: {
				lane: 'meetup-proof',
				templateId: 'agent-console',
			},
		},
	});

	if (!replayBundle) {
		throw new Error('Meetup proof did not produce a replay bundle.');
	}

	return {
		evaluation,
		replayBundle,
		replayUri: replayUris[0] ?? evaluation.replayBundleUri,
	};
}
