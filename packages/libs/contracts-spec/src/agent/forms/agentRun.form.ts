import { ScalarTypeEnum, SchemaModel } from '@contractspec/lib.schema';
import { defineFormSpec } from '../../forms/forms';
import '../ensure-docblocks';
import { docId } from '../../docs/registry';
import {
	AGENT_DOMAIN,
	AGENT_OWNERS,
	AGENT_STABILITY,
	AGENT_TAGS,
} from '../constants';

const AgentRunFormModel = new SchemaModel({
	name: 'AgentRunFormModel',
	fields: {
		agentKey: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
		prompt: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
		contextSnapshotId: { type: ScalarTypeEnum.ID(), isOptional: true },
		mode: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
		priority: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
	},
});

export const AgentRunForm = defineFormSpec({
	meta: {
		key: 'agent.run.form',
		title: 'Run Agent',
		version: '1.0.0',
		description: 'Form to launch a background agent run.',
		domain: AGENT_DOMAIN,
		owners: AGENT_OWNERS,
		tags: [...AGENT_TAGS, 'run'],
		stability: AGENT_STABILITY,
		docId: [docId('docs.tech.agent.run.form')],
	},
	model: AgentRunFormModel,
	fields: [
		{
			kind: 'text',
			name: 'agentKey',
			labelI18n: 'Agent',
			placeholderI18n: 'agent.key',
			required: true,
		},
		{
			kind: 'textarea',
			name: 'prompt',
			labelI18n: 'Prompt',
			placeholderI18n: 'Describe the task',
		},
		{
			kind: 'text',
			name: 'contextSnapshotId',
			labelI18n: 'Context Snapshot',
			placeholderI18n: 'snapshot id',
		},
		{
			kind: 'text',
			name: 'mode',
			labelI18n: 'Mode',
			placeholderI18n: 'background',
		},
		{
			kind: 'text',
			name: 'priority',
			labelI18n: 'Priority',
			placeholderI18n: '0',
		},
	],
	actions: [
		{
			key: 'run',
			labelI18n: 'Run agent',
			op: { name: 'agent.run', version: '1.0.0' },
		},
	],
	policy: {
		flags: [],
		pii: ['prompt'],
	},
});
