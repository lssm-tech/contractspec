import type { DocBlock } from '@contractspec/lib.contracts/docs';
import { registerDocBlocks } from '@contractspec/lib.contracts/docs';

const guideDocBlocks: DocBlock[] = [
  {
    id: 'docs.guides.index',
    title: 'Guides',
    summary: 'Hands-on guides for adopting ContractSpec in real workflows.',
    kind: 'goal',
    visibility: 'public',
    route: '/docs/guides',
    tags: ['guides', 'adoption'],
    body: `# Guides

Hands-on, runnable guides that map to real adoption scenarios. Each guide includes commands, expected output, and a CI-verified example package.`,
  },
  {
    id: 'docs.guides.nextjs-one-endpoint',
    title: 'Next.js one endpoint',
    summary: 'Add ContractSpec to an existing Next.js app with one endpoint.',
    kind: 'usage',
    visibility: 'public',
    route: '/docs/guides/nextjs-one-endpoint',
    tags: ['guides', 'nextjs', 'operations'],
    body: `# Add ContractSpec to a Next.js app (one endpoint)

Create a single OperationSpec, register it, and expose it through a Next.js App Router handler.`,
  },
  {
    id: 'docs.guides.spec-validation-typing',
    title: 'Spec validation and typing',
    summary: 'Define an operation spec with validation and types, no rewrites.',
    kind: 'usage',
    visibility: 'public',
    route: '/docs/guides/spec-validation-and-typing',
    tags: ['guides', 'validation', 'typing'],
    body: `# Spec-driven validation and typing

Define command/query specs that enforce validation and generate types without rewriting your app.`,
  },
  {
    id: 'docs.guides.docs-clients-schemas',
    title: 'Generate docs, clients, schemas',
    summary: 'Generate docs and OpenAPI for client SDKs from specs.',
    kind: 'usage',
    visibility: 'public',
    route: '/docs/guides/generate-docs-clients-schemas',
    tags: ['guides', 'docs', 'openapi'],
    body: `# Generate docs and client schemas

Use ContractSpec to generate documentation and OpenAPI exports for client SDKs.`,
  },
  {
    id: 'docs.guides.ci-contract-diff-gating',
    title: 'CI gating for contract diffs',
    summary: 'Gate changes with deterministic diffs and CI checks.',
    kind: 'usage',
    visibility: 'public',
    route: '/docs/guides/ci-contract-diff-gating',
    tags: ['guides', 'ci', 'diff'],
    body: `# CI gating with deterministic diffs

Run ContractSpec CI checks to detect drift and breaking changes before merge.`,
  },
];

registerDocBlocks(guideDocBlocks);
