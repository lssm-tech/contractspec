/**
 * Data view for the contract verification status table rendered in reports.
 */
import type { DocBlock } from '../../docs/types';
import { GetContractVerificationStatusQuery } from '../../operations/report/getContractVerificationStatus';
import { StabilityEnum } from '../../ownership';
import { defineDataView } from '../spec';
export const ContractVerificationTableDataView = defineDataView({
	meta: {
		key: 'report.contractVerificationTable',
		title: 'Contract Verification Table',
		version: '1.0.0',
		description:
			'Table view of per-contract verification status for the impact report.',
		domain: 'report',
		owners: ['platform.core'],
		tags: ['report', 'data-view', 'verification'],
		stability: StabilityEnum.Experimental,
		entity: 'contract-verification',
	},
	source: {
		primary: {
			key: GetContractVerificationStatusQuery.meta.key,
			version: GetContractVerificationStatusQuery.meta.version,
		},
	},
	view: {
		kind: 'table',
		fields: [
			{
				key: 'name',
				label: 'Contract / Endpoint / Event',
				dataPath: 'name',
			},
			{
				key: 'timeSinceVerified',
				label: 'Time since verified',
				dataPath: 'lastVerifiedDate',
			},
			{
				key: 'driftMismatches',
				label: 'Drift debt',
				dataPath: 'driftMismatches',
				format: 'number',
				sortable: true,
			},
			{
				key: 'surfaces',
				label: 'Surfaces covered',
				dataPath: 'surfaces',
				format: 'badge',
			},
			{
				key: 'lastVerifiedSha',
				label: 'Last verified commit',
				dataPath: 'lastVerifiedSha',
				width: 'sm',
			},
		],
		primaryField: 'name',
		secondaryFields: ['driftMismatches', 'timeSinceVerified'],
		columns: [
			{ field: 'name', width: 'lg' },
			{ field: 'lastVerifiedSha', width: 'sm' },
			{ field: 'timeSinceVerified', width: 'sm' },
			{ field: 'surfaces', width: 'md' },
			{ field: 'driftMismatches', width: 'xs', align: 'right' },
		],
	},
	policy: {
		flags: [],
		pii: [],
	},
});

export const reportVerificationTableDocBlocks: DocBlock[] = [
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
