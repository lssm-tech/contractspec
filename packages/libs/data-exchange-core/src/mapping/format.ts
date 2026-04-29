import type { ColumnValueFormat } from '../types';
import {
	normalizeEmptyValue,
	normalizeFormattedText,
	normalizeNumberText,
	parseFormattedBoolean,
	parseFormattedDate,
} from './format-parsers';

export function applyColumnValueFormat(
	value: unknown,
	format?: ColumnValueFormat
): unknown {
	if (!format) return value;
	const normalized = normalizeEmptyValue(value, format);
	if (normalized === null || normalized === undefined || normalized === '') {
		return normalized;
	}

	switch (format.kind) {
		case 'text':
			return normalizeFormattedText(normalized, format);
		case 'number':
		case 'currency':
			return Number(normalizeNumberText(normalized, format));
		case 'percentage': {
			const hadPercentSign =
				typeof normalized === 'string' && normalized.includes('%');
			const parsed = Number(
				normalizeNumberText(String(normalized).replace('%', ''), format)
			);
			if (format.percentScale === 'fraction') return parsed;
			return hadPercentSign || format.percentScale === 'whole'
				? parsed / 100
				: parsed;
		}
		case 'boolean':
			return parseFormattedBoolean(normalized, format);
		case 'date':
		case 'datetime':
			return parseFormattedDate(normalized, format);
		case 'json':
			return typeof normalized === 'string'
				? JSON.parse(normalized)
				: normalized;
		case 'split':
			return typeof normalized === 'string'
				? normalized.split(format.delimiter ?? ',').map((item) => item.trim())
				: normalized;
		case 'join':
			return Array.isArray(normalized)
				? normalized.join(format.delimiter ?? ',')
				: normalized;
	}
}
