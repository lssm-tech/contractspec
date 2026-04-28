import {
	type AdoptionNextStep,
	isRecord,
	parseNumberSafely,
} from '../handlers';
import { formatMoney } from './finance-ops-ai-workflows-preview.format';

export interface CashPriorityView {
	action: string;
	amountLabel: string;
	clientName: string;
	invoiceId: string;
	overdueDays: number;
	owner: string;
	priority: string;
}

export function parseRecordList(
	rawJson: string
): readonly Record<string, unknown>[] {
	try {
		const parsed: unknown = JSON.parse(rawJson);
		return Array.isArray(parsed) ? parsed.filter(isRecord) : [];
	} catch {
		return [];
	}
}

export function parseStringList(rawJson: string): readonly string[] {
	try {
		const parsed: unknown = JSON.parse(rawJson);
		return Array.isArray(parsed)
			? parsed.filter((item): item is string => typeof item === 'string')
			: [];
	} catch {
		return [];
	}
}

export function toCashPriorityView(
	item: Record<string, unknown>,
	currency: string
): CashPriorityView {
	const amount = parseNumberSafely(item.amount as number | string | undefined);
	return {
		action: readString(item, 'action', 'Review with finance owner'),
		amountLabel: formatMoney(amount, currency),
		clientName: readString(item, 'clientName', 'Fictive client'),
		invoiceId: readString(item, 'invoiceId', 'invoice'),
		overdueDays: parseNumberSafely(
			item.overdueDays as number | string | undefined
		),
		owner: readString(item, 'owner', 'Unassigned owner'),
		priority: readString(item, 'priority', 'low'),
	};
}

export function uniqueNextSteps(
	steps: readonly AdoptionNextStep[]
): readonly AdoptionNextStep[] {
	return [...new Set(steps)];
}

export function stageDetail(id: string): string {
	switch (id) {
		case 'mission':
			return 'Cadrage, risques, documents et plan 30/60/90.';
		case 'cash':
			return 'Exposition, disputes, priorités et actions à valider.';
		case 'procedure':
			return 'Rôles, étapes, contrôles, KPIs et questions ouvertes.';
		case 'reporting':
			return 'Variances KPI, questions dirigeant et follow-ups.';
		case 'adoption':
			return 'Temps gagné, qualité, risque données et prochaine étape.';
		default:
			return 'Vue d’ensemble commerciale.';
	}
}

export function readString(
	record: Record<string, unknown>,
	key: string,
	fallback = ''
): string {
	const value = record[key];
	return typeof value === 'string' && value.trim().length > 0
		? value
		: fallback;
}

export function compactRecord(record: Record<string, unknown>): string {
	return Object.entries(record)
		.filter(([, value]) => typeof value === 'string')
		.map(([key, value]) => `${key.replaceAll('_', ' ')}: ${value}`)
		.join(' · ');
}
