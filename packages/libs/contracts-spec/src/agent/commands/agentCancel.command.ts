import { ScalarTypeEnum, SchemaModel } from '@contractspec/lib.schema';
import { defineCommand } from '../../operations';
import { docId } from '../../docs/registry';
import {
	AGENT_DOMAIN,
	AGENT_OWNERS,
	AGENT_STABILITY,
	AGENT_TAGS,
} from '../constants';

const AgentCancelInput = new SchemaModel({
	name: 'AgentCancelInput',
	fields: {
		runId: { type: ScalarTypeEnum.ID(), isOptional: false },
		reason: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
		requestedBy: { type: ScalarTypeEnum.ID(), isOptional: true },
	},
});

const AgentCancelOutput = new SchemaModel({
	name: 'AgentCancelOutput',
	fields: {
		runId: { type: ScalarTypeEnum.ID(), isOptional: false },
		status: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
		cancelledAt: { type: ScalarTypeEnum.DateTime(), isOptional: true },
	},
});

export const AgentCancelCommand = defineCommand({
	meta: {
		key: 'agent.cancel',
		title: 'Cancel Agent Run',
		version: '1.0.0',
		description: 'Cancel an in-flight agent run.',
		goal: 'Provide safe operator control to stop background agents.',
		context: 'Used when an agent run must be halted or escalated.',
		domain: AGENT_DOMAIN,
		owners: AGENT_OWNERS,
		tags: [...AGENT_TAGS, 'run', 'cancel'],
		stability: AGENT_STABILITY,
		docId: [docId('docs.tech.agent.cancel')],
	},
	capability: {
		key: 'agent.execution',
		version: '1.0.0',
	},
	io: {
		input: AgentCancelInput,
		output: AgentCancelOutput,
	},
	policy: {
		auth: 'admin',
		pii: [],
	},
});
