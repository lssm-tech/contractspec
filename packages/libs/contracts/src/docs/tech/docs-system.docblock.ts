import type { DocBlock } from '../types';
import { registerDocBlocks } from '../registry';

const docsSystemDocBlocks: DocBlock[] = [
  {
    id: 'docs.tech.docs-system',
    title: 'Docs system overview',
    summary: 'How ContractSpec generates, indexes, and presents documentation.',
    kind: 'reference',
    visibility: 'public',
    route: '/docs/tech/docs/system',
    tags: ['docs', 'system', 'contracts'],
    body: `# Docs system overview

ContractSpec treats documentation as a first-class output of your specs. The docs system combines:

- Contract operations and schemas
- DocBlocks (goal/how/usage/reference)
- Presentations for rendering

The result is a consistent docs surface across CLI, web, and MCP.

## Key surfaces

- Generation: \`docs.generate\`
- Index/search: \`docs.search\`
- Contract reference: \`docs.contract.reference\`
- Publish: \`docs.publish\`
`,
  },
  {
    id: 'docs.tech.docs-generator',
    title: 'Docs generator',
    summary: 'Generate reference docs and metadata from ContractSpecs.',
    kind: 'how',
    visibility: 'public',
    route: '/docs/tech/docs/generator',
    tags: ['docs', 'generator', 'cli'],
    body: `# Docs generator

The generator produces documentation artifacts from registered ContractSpecs and DocBlocks.

## Outputs

- Reference pages for operations, events, forms, data views, and presentations
- Search index metadata (DocBlocks + routes)
- Contract schemas rendered to markdown or JSON
`,
  },
  {
    id: 'docs.tech.docs-search',
    title: 'Docs index and search',
    summary: 'Search DocBlocks by query, tag, kind, or visibility.',
    kind: 'reference',
    visibility: 'public',
    route: '/docs/tech/docs/search',
    tags: ['docs', 'search'],
    body: `# Docs index and search

The docs index is the canonical list of DocBlocks exposed to UI and MCP surfaces.

## Query

- Operation: \`docs.search\`
- Filters: query, tag, kind, visibility
`,
  },
  {
    id: 'docs.tech.docs-reference',
    title: 'Contract reference pages',
    summary: 'Resolve any spec into a docs-ready reference payload.',
    kind: 'reference',
    visibility: 'public',
    route: '/docs/tech/docs/reference',
    tags: ['docs', 'reference'],
    body: `# Contract reference

Contract reference pages are generated from spec metadata plus schema details.

## Query

- Operation: \`docs.contract.reference\`
`,
  },
  {
    id: 'docs.tech.docs-publish',
    title: 'Docs publish',
    summary: 'Publish generated artifacts to the docs host.',
    kind: 'how',
    visibility: 'public',
    route: '/docs/tech/docs/publish',
    tags: ['docs', 'publish'],
    body: `# Docs publish

Publishing moves generated artifacts to a hosting target with versioning.

## Command

- Operation: \`docs.publish\`
`,
  },
  {
    id: 'docs.tech.docs-examples',
    title: 'Examples catalog',
    summary: 'Document and surface example projects with sandbox support.',
    kind: 'reference',
    visibility: 'public',
    route: '/docs/tech/docs/examples',
    tags: ['docs', 'examples'],
    body: `# Examples catalog

Examples are registered as ExampleSpecs and surface DocBlocks for discovery.

- Docs index tags should include \`examples\` to populate the catalog.
- Sandbox support is available under \`/sandbox\`.
`,
  },
];

registerDocBlocks(docsSystemDocBlocks);
