import {
	actionForCashPriority,
	buildCashSummary,
	classifyCashPriority,
	compareCashPriority,
	isDisputed,
} from './finance-ops-ai-workflows.cash-aging-rules';
import {
	isCashAgingRow,
	normalizeCashRow,
} from './finance-ops-ai-workflows.guards';
import type { CashAgingInput } from './finance-ops-ai-workflows.types';
import {
	buildSafetyNotes,
	daysLateFrom,
	parseJsonArraySafely,
	REFERENCE_DATE,
	toJson,
} from './finance-ops-ai-workflows.utils';

export function prioritizeCashAging(input: CashAgingInput) {
	const parsed = parseJsonArraySafely(input.rowsJson, isCashAgingRow);
	const rows = parsed.rows.map(normalizeCashRow);
	const items = rows.map((row) => {
		const overdue = daysLateFrom(row.dueDate);
		const priority = classifyCashPriority(
			row.amount,
			overdue.daysLate,
			row.disputeStatus
		);
		return {
			...row,
			overdueDays: overdue.daysLate,
			priority,
			action: actionForCashPriority(priority),
			note: overdue.note ?? row.notes,
		};
	});
	const totalExposure = rows.reduce((sum, row) => sum + row.amount, 0);
	const overdueExposure = items
		.filter((row) => row.overdueDays > 0)
		.reduce((sum, row) => sum + row.amount, 0);
	const disputedExposure = items
		.filter((row) => isDisputed(row.disputeStatus))
		.reduce((sum, row) => sum + row.amount, 0);
	const sorted = [...items].sort(compareCashPriority);
	const highCount = sorted.filter((row) => row.priority === 'high').length;
	const workflowDecision =
		disputedExposure > 0
			? 'review_disputes_first'
			: highCount > 0
				? 'escalate_high_priority_items'
				: 'routine_follow_up';

	return {
		referenceDate: REFERENCE_DATE,
		currency: input.currency,
		totalExposure,
		overdueExposure,
		disputedExposure,
		topPrioritiesJson: toJson(sorted.slice(0, 5)),
		actionsJson: toJson(
			sorted.map(({ invoiceId, owner, action }) => ({
				invoiceId,
				owner,
				action,
			}))
		),
		executiveSummary: buildCashSummary(
			totalExposure,
			overdueExposure,
			disputedExposure,
			sorted.slice(0, 3),
			input.currency
		),
		workflowDecision,
		humanReviewRequired: true as const,
		safetyNotes: buildSafetyNotes(parsed.errors),
	};
}
