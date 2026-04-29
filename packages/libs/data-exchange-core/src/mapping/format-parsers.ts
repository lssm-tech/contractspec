import type { ColumnValueFormat } from '../types';

export function normalizeEmptyValue(
	value: unknown,
	format: ColumnValueFormat
): unknown {
	if (value === undefined || value === null || value === '') {
		if (format.defaultValue !== undefined) return format.defaultValue;
		if (format.emptyAsNull) return null;
	}
	return value;
}

export function normalizeFormattedText(
	value: unknown,
	format: ColumnValueFormat
): string {
	const normalized = typeof value === 'string' ? value : String(value ?? '');
	const trimmed = format.trim === false ? normalized : normalized.trim();
	if (format.case === 'uppercase') return trimmed.toUpperCase();
	if (format.case === 'lowercase') return trimmed.toLowerCase();
	return trimmed;
}

export function normalizeNumberText(
	value: unknown,
	format: ColumnValueFormat
): string {
	const decimalSeparator = format.decimalSeparator ?? '.';
	const thousandsSeparator =
		format.thousandsSeparator ?? (decimalSeparator === ',' ? '.' : ',');
	const withoutCurrency =
		typeof value === 'string' && format.currencySymbol
			? value.replace(format.currencySymbol, '')
			: String(value ?? '');
	const withoutGrouping = thousandsSeparator
		? withoutCurrency.split(thousandsSeparator).join('')
		: withoutCurrency;
	return decimalSeparator === '.'
		? withoutGrouping
		: withoutGrouping.replace(decimalSeparator, '.');
}

export function parseFormattedBoolean(
	value: unknown,
	format: ColumnValueFormat
): boolean {
	if (typeof value === 'boolean') return value;
	if (typeof value === 'number') return value !== 0;
	const normalized = normalizeFormattedText(value, {
		...format,
		case: 'lowercase',
	});
	const trueValues = (format.trueValues ?? ['true', '1', 'yes', 'y']).map(
		(item) => item.toLowerCase()
	);
	const falseValues = (format.falseValues ?? ['false', '0', 'no', 'n']).map(
		(item) => item.toLowerCase()
	);
	if (trueValues.includes(normalized)) return true;
	if (falseValues.includes(normalized)) return false;
	return Boolean(value);
}

function parseDateParts(value: string, pattern: string): Date | null {
	const separator = pattern.includes('/')
		? '/'
		: pattern.includes('.')
			? '.'
			: '-';
	const valueParts = value.split(separator);
	const patternParts = pattern.split(separator);
	if (valueParts.length !== patternParts.length) return null;

	const lookup = new Map<string, number>();
	for (const [index, part] of patternParts.entries()) {
		lookup.set(part, Number(valueParts[index]));
	}

	const year = lookup.get('yyyy');
	const month = lookup.get('MM');
	const day = lookup.get('dd');
	if (!year || !month || !day) return null;
	return new Date(Date.UTC(year, month - 1, day));
}

export function parseFormattedDate(
	value: unknown,
	format: ColumnValueFormat
): Date {
	if (value instanceof Date) return value;
	const normalized = normalizeFormattedText(value, format);
	for (const inputFormat of format.inputFormats ?? []) {
		const parsed = parseDateParts(normalized, inputFormat);
		if (parsed) return parsed;
	}
	return new Date(normalized);
}
