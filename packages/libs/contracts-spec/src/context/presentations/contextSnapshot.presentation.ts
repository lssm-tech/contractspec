import { definePresentation } from '../../presentations';
import '../ensure-docblocks';
import { docId } from '../../docs/registry';
import {
  CONTEXT_DOMAIN,
  CONTEXT_OWNERS,
  CONTEXT_STABILITY,
  CONTEXT_TAGS,
} from '../constants';

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
    docId: [docId('docs.tech.context.snapshot.presentation')],
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
