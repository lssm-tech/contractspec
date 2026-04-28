import type {
	CashAgingRow,
	KpiSnapshotRow,
} from './finance-ops-ai-workflows.types';
import {
	isRecord,
	optionalString,
	parseNumberSafely,
	requiredString,
} from './finance-ops-ai-workflows.utils';

export function isCashAgingRow(value: unknown): value is CashAgingRow {
	if (!isRecord(value)) return false;
	return (
		requiredString(value.clientName) &&
		requiredString(value.invoiceId) &&
		requiredString(value.dueDate) &&
		(typeof value.amount === 'number' || typeof value.amount === 'string')
	);
}

export function isKpiSnapshotRow(value: unknown): value is KpiSnapshotRow {
	if (!isRecord(value)) return false;
	return requiredString(value.metric);
}

export function normalizeCashRow(row: CashAgingRow) {
	return {
		clientName: row.clientName,
		invoiceId: row.invoiceId,
		dueDate: row.dueDate,
		amount: parseNumberSafely(row.amount),
		owner: row.owner ?? 'Unassigned owner',
		disputeStatus: row.disputeStatus ?? 'none',
		notes: row.notes ?? '',
	};
}

export function normalizeKpiRow(row: KpiSnapshotRow) {
	return {
		metric: row.metric,
		currentValue: parseNumberSafely(row.currentValue),
		previousValue:
			row.previousValue === undefined
				? undefined
				: parseNumberSafely(row.previousValue),
		targetValue:
			row.targetValue === undefined
				? undefined
				: parseNumberSafely(row.targetValue),
		unit: optionalString(row.unit) ?? '',
		owner: optionalString(row.owner) ?? 'Unassigned owner',
		notes: optionalString(row.notes) ?? '',
	};
}
