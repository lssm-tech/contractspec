import { definePresentation } from '../../presentations';
import { docId } from '../../docs/registry';
import {
	AGENT_DOMAIN,
	AGENT_OWNERS,
	AGENT_STABILITY,
	AGENT_TAGS,
} from '../constants';

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
