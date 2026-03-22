import { docId } from '../../docs/registry';
import type { DocBlock } from '../../docs/types';
import { definePresentation } from '../../presentations';
import {
	AGENT_DOMAIN,
	AGENT_OWNERS,
	AGENT_STABILITY,
	AGENT_TAGS,
} from '../constants';

export const AgentRunAuditDocBlock = {
	id: 'docs.tech.agent.run.audit',
	title: 'Agent run audit presentation',
	summary: 'Presentation spec for agent run audit views.',
	kind: 'reference',
	visibility: 'public',
	route: '/docs/tech/agent/run/audit',
	tags: ['agent', 'presentation', 'audit'],
	body: `# agent.run.audit

Presentation surface used to inspect run provenance, tools, approvals, and outputs.
`,
} satisfies DocBlock;

export const AgentRunAuditPresentation = definePresentation({
	meta: {
		key: 'agent.run.audit',
		title: 'Agent Run Audit',
		version: '1.0.0',
		description: 'Audit layout for agent runs and artifacts.',
		goal: 'Explain run provenance, tools, approvals, and outputs.',
		context: 'Used by Studio to inspect agent run audit trails.',
		domain: AGENT_DOMAIN,
		owners: AGENT_OWNERS,
		tags: [...AGENT_TAGS, 'audit'],
		stability: AGENT_STABILITY,
		docId: [docId('docs.tech.agent.run.audit')],
	},
	capability: {
		key: 'agent.execution',
		version: '1.0.0',
	},
	source: {
		type: 'component',
		framework: 'react',
		componentKey: 'agentRunAudit',
	},
	targets: ['react', 'markdown'],
});
