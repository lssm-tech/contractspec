import type { CashPriority } from './finance-ops-ai-workflows.types';

export function classifyCashPriority(
	amount: number,
	overdueDays: number,
	disputeStatus: string
): CashPriority {
	if (isDisputed(disputeStatus)) return 'dispute';
	if (amount >= 10_000 && overdueDays > 30) return 'high';
	if (overdueDays > 15) return 'medium';
	return 'low';
}

export function isDisputed(disputeStatus: string): boolean {
	const normalized = disputeStatus.trim().toLowerCase();
	return normalized.length > 0 && normalized !== 'none';
}

export function actionForCashPriority(priority: CashPriority): string {
	if (priority === 'dispute') {
		return 'Clarify dispute with owner before collection follow-up';
	}
	if (priority === 'high') {
		return 'Prepare executive escalation and client follow-up draft';
	}
	if (priority === 'medium') {
		return 'Schedule standard follow-up and payment date confirmation';
	}
	return 'Monitor and include in next routine review';
}

export function compareCashPriority(
	left: { amount: number; overdueDays: number; priority: CashPriority },
	right: { amount: number; overdueDays: number; priority: CashPriority }
): number {
	const rank = { dispute: 4, high: 3, medium: 2, low: 1 } as const;
	const leftRank =
		left.priority === 'dispute' && left.amount < 10_000
			? 2
			: rank[left.priority];
	const rightRank =
		right.priority === 'dispute' && right.amount < 10_000
			? 2
			: rank[right.priority];
	return (
		rightRank - leftRank ||
		right.amount - left.amount ||
		right.overdueDays - left.overdueDays
	);
}

export function buildCashSummary(
	total: number,
	overdue: number,
	disputed: number,
	topRows: readonly {
		invoiceId: string;
		clientName: string;
		priority: CashPriority;
	}[],
	currency: string
): string {
	const top = topRows
		.map((row) => `${row.invoiceId}/${row.clientName}/${row.priority}`)
		.join(', ');
	return `Total exposure ${total} ${currency}; overdue exposure ${overdue} ${currency}; disputed exposure ${disputed} ${currency}. Top priorities: ${top || 'none'}. Finance owner validation required; no causes are invented.`;
}
