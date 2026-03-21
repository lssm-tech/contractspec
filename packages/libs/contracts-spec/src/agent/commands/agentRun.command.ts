import { ScalarTypeEnum, SchemaModel } from '@contractspec/lib.schema';
import { defineCommand } from '../../operations';
import { docId } from '../../docs/registry';
import {
	AGENT_DOMAIN,
	AGENT_OWNERS,
	AGENT_STABILITY,
	AGENT_TAGS,
} from '../constants';
import { AgentRunStartedEvent } from '../events/agentRunStarted.event';

const AgentRunInput = new SchemaModel({
	name: 'AgentRunInput',
	fields: {
		agentKey: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
		contextSnapshotId: { type: ScalarTypeEnum.ID(), isOptional: true },
		prompt: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
		input: { type: ScalarTypeEnum.JSONObject(), isOptional: true },
		mode: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
		priority: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
		tenantId: { type: ScalarTypeEnum.ID(), isOptional: true },
		actorId: { type: ScalarTypeEnum.ID(), isOptional: true },
		metadata: { type: ScalarTypeEnum.JSONObject(), isOptional: true },
	},
});

const AgentRunOutput = new SchemaModel({
	name: 'AgentRunOutput',
	fields: {
		runId: { type: ScalarTypeEnum.ID(), isOptional: false },
		status: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
		submittedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
		contextSnapshotId: { type: ScalarTypeEnum.ID(), isOptional: true },
	},
});

export const AgentRunCommand = defineCommand({
	meta: {
		key: 'agent.run',
		title: 'Run Agent',
		version: '1.0.0',
		description: 'Submit a background agent run with a context snapshot.',
		goal: 'Start an auditable agent execution with full provenance.',
		context:
			'Used by Studio and API clients to launch background agent workflows.',
		domain: AGENT_DOMAIN,
		owners: AGENT_OWNERS,
		tags: [...AGENT_TAGS, 'run'],
		stability: AGENT_STABILITY,
		docId: [docId('docs.tech.agent.run')],
	},
	capability: {
		key: 'agent.execution',
		version: '1.0.0',
	},
	io: {
		input: AgentRunInput,
		output: AgentRunOutput,
	},
	policy: {
		auth: 'user',
		pii: ['prompt'],
	},
	sideEffects: {
		emits: [
			{
				ref: AgentRunStartedEvent.meta,
				when: 'A new agent run is created and queued.',
			},
		],
	},
});
