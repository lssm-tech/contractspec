import { ScalarTypeEnum, SchemaModel } from '@contractspec/lib.schema';
import type { DocBlock } from '../../docs/types';
import { defineQuery } from '../../operations';
import { docId } from '../../docs/registry';
import {
	AGENT_DOMAIN,
	AGENT_OWNERS,
	AGENT_STABILITY,
	AGENT_TAGS,
} from '../constants';

const AgentArtifactsInput = new SchemaModel({
	name: 'AgentArtifactsInput',
	fields: {
		runId: { type: ScalarTypeEnum.ID(), isOptional: false },
		kind: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
		limit: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
		offset: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
	},
});

const AgentArtifact = new SchemaModel({
	name: 'AgentArtifact',
	fields: {
		artifactId: { type: ScalarTypeEnum.ID(), isOptional: false },
		kind: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
		uri: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
		contentType: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
		summary: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
		createdAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
	},
});

const AgentArtifactsOutput = new SchemaModel({
	name: 'AgentArtifactsOutput',
	fields: {
		artifacts: { type: AgentArtifact, isOptional: false, isArray: true },
		total: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
		nextOffset: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
	},
});

export const AgentArtifactsDocBlock = {
	id: 'docs.tech.agent.artifacts',
	title: 'Agent artifacts',
	summary: 'List artifacts produced by an agent run.',
	kind: 'reference',
	visibility: 'public',
	route: '/docs/tech/agent/artifacts',
	tags: ['agent', 'artifacts'],
	body: `# agent.artifacts

Lists files, diffs, and outputs produced during agent execution.
`,
} satisfies DocBlock;

export const AgentArtifactsQuery = defineQuery({
	meta: {
		key: 'agent.artifacts',
		title: 'Agent Run Artifacts',
		version: '1.0.0',
		description: 'List artifacts produced by an agent run.',
		goal: 'Provide traceable outputs for audits and UI surfaces.',
		context: 'Used by Studio to show diffs, files, and run outputs.',
		domain: AGENT_DOMAIN,
		owners: AGENT_OWNERS,
		tags: [...AGENT_TAGS, 'artifacts'],
		stability: AGENT_STABILITY,
		docId: [docId('docs.tech.agent.artifacts')],
	},
	capability: {
		key: 'agent.execution',
		version: '1.0.0',
	},
	io: {
		input: AgentArtifactsInput,
		output: AgentArtifactsOutput,
	},
	policy: {
		auth: 'user',
		pii: [],
	},
});
