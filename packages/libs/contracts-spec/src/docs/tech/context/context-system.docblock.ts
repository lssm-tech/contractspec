import type { DocBlock } from '@contractspec/lib.contracts-spec/docs';
import { registerDocBlocks } from '../../registry';

export const tech_context_system_DocBlocks: DocBlock[] = [
	{
		id: 'docs.tech.context.system',
		title: 'Context system',
		summary: 'Context packs, snapshots, and discovery surfaces.',
		kind: 'reference',
		visibility: 'public',
		route: '/docs/tech/context/system',
		tags: ['context', 'system', 'snapshot'],
		body: `# Context system

The context system defines how ContractSpec bundles DocBlocks, contracts, knowledge spaces, and data views into deterministic snapshots.
`,
	},
	{
		id: 'docs.tech.context.pack.describe',
		title: 'Describe context pack',
		summary: 'Describe a context pack and its sources.',
		kind: 'reference',
		visibility: 'public',
		route: '/docs/tech/context/pack/describe',
		tags: ['context', 'pack', 'describe'],
		body: `# context.pack.describe

Returns a canonical view of a context pack, including sources and ownership metadata.
`,
	},
	{
		id: 'docs.tech.context.pack.search',
		title: 'Search context packs',
		summary: 'Search and filter context packs and snapshots.',
		kind: 'reference',
		visibility: 'public',
		route: '/docs/tech/context/pack/search',
		tags: ['context', 'pack', 'search'],
		body: `# context.pack.search

Search context packs and surface their latest snapshot details for discovery and UI lists.
`,
	},
	{
		id: 'docs.tech.context.pack.snapshot',
		title: 'Create context snapshot',
		summary: 'Create an immutable context snapshot from a pack.',
		kind: 'reference',
		visibility: 'public',
		route: '/docs/tech/context/pack/snapshot',
		tags: ['context', 'snapshot', 'create'],
		body: `# context.pack.snapshot

Creates a versioned snapshot that is used as the immutable context for agent execution.
`,
	},
	{
		id: 'docs.tech.context.snapshot.created',
		title: 'Context snapshot created event',
		summary: 'Emitted when a context snapshot is created.',
		kind: 'reference',
		visibility: 'public',
		route: '/docs/tech/context/snapshot/created',
		tags: ['context', 'snapshot', 'event'],
		body: `# context.snapshot.created

Emitted when a new snapshot has been persisted and is ready for use.
`,
	},
	{
		id: 'docs.tech.context.snapshot.index',
		title: 'Context snapshot index view',
		summary: 'Data view for listing context snapshots.',
		kind: 'reference',
		visibility: 'public',
		route: '/docs/tech/context/snapshot/index',
		tags: ['context', 'snapshot', 'data-view'],
		body: `# context.snapshot.index

Provides a list-oriented data view over context packs and snapshot metadata.
`,
	},
	{
		id: 'docs.tech.context.pack.search.form',
		title: 'Context pack search form',
		summary: 'Form used to search context packs in UI surfaces.',
		kind: 'reference',
		visibility: 'public',
		route: '/docs/tech/context/pack/search-form',
		tags: ['context', 'form', 'search'],
		body: `# context.pack.search.form

Form specification for searching context packs by query, tag, or owner.
`,
	},
	{
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
	},
];

registerDocBlocks(tech_context_system_DocBlocks);
