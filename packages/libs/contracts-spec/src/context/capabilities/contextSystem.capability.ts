import { defineCapability } from '../../capabilities';
import '../ensure-docblocks';
import { docId } from '../../docs/registry';
import {
  CONTEXT_DOMAIN,
  CONTEXT_OWNERS,
  CONTEXT_STABILITY,
  CONTEXT_TAGS,
} from '../constants';

export const ContextSystemCapability = defineCapability({
  meta: {
    key: 'context.system',
    version: '1.0.0',
    kind: 'data',
    title: 'Context System',
    description: 'Context packs, snapshots, and discovery surfaces.',
    domain: CONTEXT_DOMAIN,
    owners: CONTEXT_OWNERS,
    tags: [...CONTEXT_TAGS, 'system'],
    stability: CONTEXT_STABILITY,
    docId: [docId('docs.tech.context.system')],
  },
  provides: [
    {
      surface: 'operation',
      key: 'context.pack.describe',
      version: '1.0.0',
      description: 'Describe a context pack and its sources.',
    },
    {
      surface: 'operation',
      key: 'context.pack.search',
      version: '1.0.0',
      description: 'Search and filter context packs and snapshots.',
    },
    {
      surface: 'operation',
      key: 'context.pack.snapshot',
      version: '1.0.0',
      description: 'Create an immutable context snapshot.',
    },
    {
      surface: 'event',
      key: 'context.snapshot.created',
      version: '1.0.0',
      description: 'Snapshot created event.',
    },
    {
      surface: 'presentation',
      key: 'context.snapshot.summary',
      version: '1.0.0',
      description: 'Snapshot summary presentation.',
    },
  ],
});
