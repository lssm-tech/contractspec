import { ScalarTypeEnum, SchemaModel } from '@contractspec/lib.schema';
import { defineCommand } from '../../operations';
import { docId } from '../../docs/registry';
import {
	AGENT_DOMAIN,
	AGENT_OWNERS,
	AGENT_STABILITY,
	AGENT_TAGS,
} from '../constants';

const AgentApprovalsInput = new SchemaModel({
	name: 'AgentApprovalsInput',
	fields: {
		runId: { type: ScalarTypeEnum.ID(), isOptional: false },
		action: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
		comment: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
		approverId: { type: ScalarTypeEnum.ID(), isOptional: true },
	},
});

const AgentApprovalsOutput = new SchemaModel({
	name: 'AgentApprovalsOutput',
	fields: {
		approvalId: { type: ScalarTypeEnum.ID(), isOptional: false },
		status: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
		resolvedAt: { type: ScalarTypeEnum.DateTime(), isOptional: true },
	},
});

export const AgentApprovalsCommand = defineCommand({
	meta: {
		key: 'agent.approvals',
		title: 'Resolve Agent Approval',
		version: '1.0.0',
		description: 'Approve or reject an agent step or run.',
		goal: 'Provide governed human-in-the-loop control for risky steps.',
		context: 'Used by reviewers to approve or reject agent actions.',
		domain: AGENT_DOMAIN,
		owners: AGENT_OWNERS,
		tags: [...AGENT_TAGS, 'approval'],
		stability: AGENT_STABILITY,
		docId: [docId('docs.tech.agent.approvals')],
	},
	capability: {
		key: 'agent.execution',
		version: '1.0.0',
	},
	io: {
		input: AgentApprovalsInput,
		output: AgentApprovalsOutput,
	},
	policy: {
		auth: 'admin',
		pii: [],
	},
});
