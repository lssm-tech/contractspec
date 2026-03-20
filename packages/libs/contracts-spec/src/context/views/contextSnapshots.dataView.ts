import { defineDataView } from '../../data-views';
import '../ensure-docblocks';
import { docId } from '../../docs/registry';
import {
	CONTEXT_DOMAIN,
	CONTEXT_OWNERS,
	CONTEXT_STABILITY,
	CONTEXT_TAGS,
} from '../constants';
import { ContextPackSearchQuery } from '../queries/contextPackSearch.query';

export const ContextSnapshotsDataView = defineDataView({
	meta: {
		key: 'context.snapshot.index',
		title: 'Context Snapshots',
		version: '1.0.0',
		description: 'List context packs and their latest snapshots.',
		domain: CONTEXT_DOMAIN,
		owners: CONTEXT_OWNERS,
		tags: [...CONTEXT_TAGS, 'snapshot', 'index'],
		stability: CONTEXT_STABILITY,
		entity: 'context_snapshot',
		docId: [docId('docs.tech.context.snapshot.index')],
	},
	source: {
		primary: {
			key: ContextPackSearchQuery.meta.key,
			version: ContextPackSearchQuery.meta.version,
		},
	},
	view: {
		kind: 'list',
		fields: [
			{ key: 'packKey', label: 'Pack', dataPath: 'packKey' },
			{ key: 'packVersion', label: 'Version', dataPath: 'packVersion' },
			{ key: 'snapshotId', label: 'Snapshot', dataPath: 'snapshotId' },
			{
				key: 'snapshotCreatedAt',
				label: 'Created',
				dataPath: 'snapshotCreatedAt',
			},
			{ key: 'title', label: 'Title', dataPath: 'title' },
			{ key: 'summary', label: 'Summary', dataPath: 'summary' },
			{ key: 'sourceCount', label: 'Sources', dataPath: 'sourceCount' },
		],
		primaryField: 'title',
		secondaryFields: ['summary', 'packKey'],
		filters: [
			{ key: 'query', label: 'Search', field: 'query', type: 'search' },
			{ key: 'tag', label: 'Tag', field: 'tag', type: 'search' },
			{ key: 'owner', label: 'Owner', field: 'owner', type: 'search' },
			{
				key: 'snapshotOnly',
				label: 'Snapshots only',
				field: 'snapshotOnly',
				type: 'boolean',
			},
		],
	},
	policy: {
		flags: [],
		pii: [],
	},
});
