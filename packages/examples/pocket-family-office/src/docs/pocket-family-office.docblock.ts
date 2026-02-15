import type { DocBlock } from '@contractspec/lib.contracts-spec/docs';
import { registerDocBlocks } from '@contractspec/lib.contracts-spec/docs';

const pocketFamilyOfficeDocBlocks: DocBlock[] = [
  {
    id: 'docs.examples.pocket-family-office.goal',
    title: 'Pocket Family Office — Goal',
    summary:
      'Secure personal finance automation combining documents and open banking.',
    kind: 'goal',
    visibility: 'public',
    route: '/docs/examples/pocket-family-office/goal',
    tags: ['finance', 'goal'],
    body: `## Why it matters
- Automate document ingestion (receipts, statements) and link to transactions.
- Provides a "family office" grade overview for individuals.
- Uses open banking for real-time data and AI for insights.

## Business/Product goal
- Reduce manual data entry for personal finance.
- Create a unified view of wealth and obligations.
- Ensure privacy and security of sensitive financial data.

## Success criteria
- Successful ingestion and classification of documents.
- Accurate syncing of open banking data.
- Generation of useful financial summaries.`,
  },
  {
    id: 'docs.examples.pocket-family-office.usage',
    title: 'Pocket Family Office — Usage',
    summary: 'How to deploy and use the personal finance automation template.',
    kind: 'usage',
    visibility: 'public',
    route: '/docs/examples/pocket-family-office/usage',
    tags: ['finance', 'usage'],
    body: `## Setup
1) Configure Open Banking credentials (e.g., using a provider mock or sandbox).
2) internalize the 'pocket-family-office' feature into your workspace.
3) Set up document storage buckets/paths.

## Core Flows
1) **Ingest**: Upload PDF statements or email threads via the 'pfo.documents.upload' operation.
2) **Sync**: Trigger 'sync-openbanking-transactions' workflow.
3) **Analyze**: Run 'generate-financial-summary' for weekly/monthly insights.

## Guardrails
- PII is redacted in summaries by default.
- Read-only access to bank data (no write/payment initiation in this template).`,
  },
  {
    id: 'docs.examples.pocket-family-office.reference',
    title: 'Pocket Family Office — Reference',
    summary: 'Key components of the Pocket Family Office system.',
    kind: 'reference',
    visibility: 'public',
    route: '/docs/examples/pocket-family-office',
    tags: ['finance', 'reference'],
    body: `## Workflows
- \`process-uploaded-document\`: Extracts data from PDFs/Images.
- \`sync-openbanking-transactions\`: Fetches latest transactions.
- \`generate-financial-summary\`: AI-driven report generation.
- \`upcoming-payments-reminder\`: Scans needed actions.

## Operations
- \`pfo.documents.upload\`: Secure upload endpoint for documents.

## Capabilities
- Requires: \`identity\`, \`openbanking\`.
- Provides: \`pocket-family-office\`.`,
  },
];

registerDocBlocks(pocketFamilyOfficeDocBlocks);
