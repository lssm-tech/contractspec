import type { ContractTableSort } from "@contractspec/lib.presentation-runtime-core";

export type ShowcaseStatus = "healthy" | "attention" | "risk";

export interface ShowcaseRow extends Record<string, unknown> {
	id: string;
	account: string;
	owner: string;
	status: ShowcaseStatus;
	region: "North America" | "Europe" | "APAC";
	arr: number;
	renewalDate: string;
	lastActivityAt: string;
	notes: string;
}

export const SHOWCASE_ROWS: ShowcaseRow[] = [
	{
		id: "acct-1",
		account: "Northwind Cloud",
		owner: "Avery Chen",
		status: "healthy",
		region: "North America",
		arr: 240000,
		renewalDate: "2026-07-12",
		lastActivityAt: "2026-03-19T09:30:00.000Z",
		notes: "Expansion approved for analytics seats and usage alerts.",
	},
	{
		id: "acct-2",
		account: "Aster Labs",
		owner: "Mina Patel",
		status: "attention",
		region: "Europe",
		arr: 165000,
		renewalDate: "2026-05-18",
		lastActivityAt: "2026-03-17T16:15:00.000Z",
		notes: "Asking for staged rollout controls before renewing the annual tier.",
	},
	{
		id: "acct-3",
		account: "Beacon Retail",
		owner: "Leo Foster",
		status: "risk",
		region: "North America",
		arr: 98000,
		renewalDate: "2026-04-07",
		lastActivityAt: "2026-03-16T12:45:00.000Z",
		notes: "Rollback last week exposed missing approval audit details.",
	},
	{
		id: "acct-4",
		account: "Helix Freight",
		owner: "Nora Silva",
		status: "healthy",
		region: "APAC",
		arr: 187000,
		renewalDate: "2026-08-01",
		lastActivityAt: "2026-03-18T08:10:00.000Z",
		notes: "Pinned columns requested for dispatcher review workflows.",
	},
	{
		id: "acct-5",
		account: "Juniper Bio",
		owner: "Owen Price",
		status: "attention",
		region: "Europe",
		arr: 132000,
		renewalDate: "2026-06-22",
		lastActivityAt: "2026-03-14T15:00:00.000Z",
		notes: "Security review open for self-hosted deployment controls.",
	},
	{
		id: "acct-6",
		account: "Quartz Health",
		owner: "Samir Gupta",
		status: "healthy",
		region: "North America",
		arr: 275000,
		renewalDate: "2026-09-10",
		lastActivityAt: "2026-03-18T13:25:00.000Z",
		notes: "Adopting DataView contracts for internal admin consoles.",
	},
	{
		id: "acct-7",
		account: "Ridge Energy",
		owner: "Maya Brooks",
		status: "risk",
		region: "APAC",
		arr: 84000,
		renewalDate: "2026-04-30",
		lastActivityAt: "2026-03-13T10:05:00.000Z",
		notes: "Needs server-mode pagination for a much larger asset inventory.",
	},
	{
		id: "acct-8",
		account: "Solstice Media",
		owner: "Avery Chen",
		status: "attention",
		region: "Europe",
		arr: 121000,
		renewalDate: "2026-06-03",
		lastActivityAt: "2026-03-19T07:50:00.000Z",
		notes: "Requested tighter keyboard and focus behavior in dense tables.",
	},
];

export interface ShowcaseServerInput {
	pageIndex: number;
	pageSize: number;
	sorting: ContractTableSort[];
}

export interface ShowcaseServerResult {
	items: ShowcaseRow[];
	total: number;
}

function getSortValue(row: ShowcaseRow, sortId?: string) {
	switch (sortId) {
		case "account":
			return row.account;
		case "owner":
			return row.owner;
		case "status":
			return row.status;
		case "region":
			return row.region;
		case "renewalDate":
			return row.renewalDate;
		case "lastActivityAt":
			return row.lastActivityAt;
		case "arr":
		default:
			return row.arr;
	}
}

export async function fetchShowcaseRows(
	input: ShowcaseServerInput
): Promise<ShowcaseServerResult> {
	const [sort] = input.sorting;
	const sorted = [...SHOWCASE_ROWS].sort((left, right) => {
		const leftValue = getSortValue(left, sort?.id);
		const rightValue = getSortValue(right, sort?.id);
		if (leftValue === rightValue) return 0;
		const comparison = leftValue > rightValue ? 1 : -1;
		return sort?.desc ? comparison * -1 : comparison;
	});
	const start = input.pageIndex * input.pageSize;
	const items = sorted.slice(start, start + input.pageSize);

	await new Promise((resolve) => setTimeout(resolve, 10));

	return {
		items,
		total: SHOWCASE_ROWS.length,
	};
}
