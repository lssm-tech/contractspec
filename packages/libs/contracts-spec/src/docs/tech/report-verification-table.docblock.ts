import type { DocBlock } from '../types';
import { registerDocBlocks } from '../registry';

const reportVerificationTableDocBlocks: DocBlock[] = [
  {
    id: 'docs.tech.report-verification-table',
    title: 'Contract Verification Table',
    summary: 'How the impact report renders per-contract verification status.',
    kind: 'how',
    visibility: 'public',
    route: '/docs/tech/report/verification-table',
    tags: ['report', 'drift', 'verification', 'impact'],
    owners: ['platform.core'],
    domain: 'report',
    body: `# Contract Verification Table

The impact report includes an optional per-contract verification table that summarises the health of each contract at a glance.

## Columns

| Column | Description |
|--------|-------------|
| Contract / Endpoint / Event | Fully qualified contract name (e.g. \`user.create\`) |
| Drift debt | Number of mismatches currently detected |
| Time since verified | Human-friendly elapsed time (e.g. "23 days") or "Never" |
| Surfaces covered | Comma-separated list (API, runtime validation, UI form, docs/examples, permissions) |
| Last verified commit | Short SHA of the last drift-free commit |

## Data flow

1. The drift detector produces per-contract mismatch counts.
2. \`.contractspec/verified.json\` records the last clean commit per contract.
3. The report script reads both sources and renders the Markdown table.

## Backward compatibility

When \`contracts\` is absent from the report JSON, the table is skipped and the existing report sections render unchanged.

## Contracts

- Query: \`report.getContractVerificationStatus\` (v1.0.0)
- Data view: \`report.contractVerificationTable\` (v1.0.0)
`,
  },
];

registerDocBlocks(reportVerificationTableDocBlocks);
