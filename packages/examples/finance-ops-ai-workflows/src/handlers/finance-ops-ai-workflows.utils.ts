import type { DataRisk, QualityRating } from './finance-ops-ai-workflows.types';

export const REFERENCE_DATE = '2026-04-28';
export const REVIEW_DRAFT_NOTE =
	'Review draft only. Not final financial, legal, tax or accounting advice.';

const DAY_MS = 86_400_000;
const referenceDate = Date.parse(`${REFERENCE_DATE}T00:00:00.000Z`);

export function parseJsonArraySafely<T>(
	rawJson: string,
	guard: (value: unknown) => value is T
): { rows: T[]; errors: string[] } {
	try {
		const parsed: unknown = JSON.parse(rawJson);
		if (!Array.isArray(parsed)) {
			return { rows: [], errors: ['Input JSON must be an array.'] };
		}
		const rows: T[] = [];
		const errors: string[] = [];
		parsed.forEach((value, index) => {
			if (guard(value)) {
				rows.push(value);
			} else {
				errors.push(`Row ${index} is invalid and was ignored.`);
			}
		});
		return { rows, errors };
	} catch {
		return { rows: [], errors: ['Input JSON is invalid and was ignored.'] };
	}
}

export function parseNumberSafely(value: number | string | undefined): number {
	if (typeof value === 'number' && Number.isFinite(value)) return value;
	if (typeof value !== 'string') return 0;
	const normalized = value.replace(/\s/g, '').replace(',', '.');
	const parsed = Number.parseFloat(normalized);
	return Number.isFinite(parsed) ? parsed : 0;
}

export function normalizeBooleanLike(value: boolean | string): boolean {
	if (typeof value === 'boolean') return value;
	return ['true', 'yes', 'oui', 'validated', 'completed', '1'].includes(
		value.trim().toLowerCase()
	);
}

export function classifyDataRisk(value: string): DataRisk {
	const normalized = value.trim().toLowerCase();
	if (['high', 'elevated', 'sensitive', 'confidential'].includes(normalized)) {
		return 'high';
	}
	if (['medium', 'moderate', 'internal'].includes(normalized)) {
		return 'medium';
	}
	return 'low';
}

export function classifyQuality(value: string): QualityRating {
	const normalized = value.trim().toLowerCase();
	if (['high', 'strong', 'good'].includes(normalized)) return 'high';
	if (['low', 'weak', 'poor'].includes(normalized)) return 'low';
	return 'medium';
}

export function buildSafetyNotes(extra: readonly string[] = []): string {
	return [
		'Synthetic data only.',
		'No external AI, API, email sending, or autonomous finance decision.',
		'Human review required before client-facing or operational use.',
		REVIEW_DRAFT_NOTE,
		...extra,
	].join(' ');
}

export function toJson(value: unknown): string {
	return JSON.stringify(value);
}

export function includesAny(text: string, terms: readonly string[]): boolean {
	return terms.some((term) => text.includes(term));
}

export function normalizeText(values: readonly (string | undefined)[]): string {
	return values.filter(Boolean).join(' ').toLowerCase();
}

export function daysLateFrom(dueDate: string): {
	daysLate: number;
	note?: string;
} {
	const parsed = Date.parse(`${dueDate}T00:00:00.000Z`);
	if (Number.isNaN(parsed)) {
		return { daysLate: 0, note: `Invalid due date for ${dueDate}.` };
	}
	return {
		daysLate: Math.max(0, Math.floor((referenceDate - parsed) / DAY_MS)),
	};
}

export function round2(value: number): number {
	return Math.round(value * 100) / 100;
}

export function isRecord(value: unknown): value is Record<string, unknown> {
	return value !== null && typeof value === 'object' && !Array.isArray(value);
}

export function optionalString(value: unknown): string | undefined {
	return typeof value === 'string' ? value : undefined;
}

export function requiredString(value: unknown): value is string {
	return typeof value === 'string' && value.trim().length > 0;
}
