import { docRef } from '../../docs/registry';
import type { DocBlock } from '../../docs/types';
import { definePresentation } from '../../presentations';
import {
	CONTEXT_DOMAIN,
	CONTEXT_OWNERS,
	CONTEXT_STABILITY,
	CONTEXT_TAGS,
} from '../constants';

export const ContextSnapshotSummaryDocBlock = {
	id: 'docs.tech.context.snapshot.presentation',
	title: 'Context snapshot presentation',
	summary: 'Presentation spec for snapshot summaries.',
	kind: 'reference',
	visibility: 'public',
	route: '/docs/tech/context/snapshot/presentation',
	tags: ['context', 'presentation', 'snapshot'],
	body: `# context.snapshot.summary

Defines the presentation surface for snapshot summaries across UI channels.
`,
} satisfies DocBlock;

export const ContextSnapshotSummaryPresentation = definePresentation({
	meta: {
		key: 'context.snapshot.summary',
		title: 'Context Snapshot Summary',
		version: '1.0.0',
		description: 'Summary layout for context snapshots.',
		goal: 'Explain snapshot composition, provenance, and usage.',
		context: 'Used by Studio and audit surfaces to present snapshot details.',
		domain: CONTEXT_DOMAIN,
		owners: CONTEXT_OWNERS,
		tags: [...CONTEXT_TAGS, 'snapshot', 'summary'],
		stability: CONTEXT_STABILITY,
		docId: [docRef(ContextSnapshotSummaryDocBlock.id)],
	},
	capability: {
		key: 'context.system',
		version: '1.0.0',
	},
	source: {
		type: 'component',
		framework: 'react',
		componentKey: 'contextSnapshotSummary',
	},
	targets: ['react', 'markdown'],
});
