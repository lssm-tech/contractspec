import type { VisualizationValueFormat } from '@contractspec/lib.contracts-spec/visualizations';

export function formatVisualizationValue(
	value: unknown,
	format?: VisualizationValueFormat
): string {
	if (value == null) return '—';
	if (format === 'currency' && typeof value === 'number') {
		return new Intl.NumberFormat(undefined, {
			style: 'currency',
			currency: 'USD',
		}).format(value);
	}
	if (format === 'percentage' && typeof value === 'number') {
		return `${(value * 100).toFixed(1)}%`;
	}
	if ((format === 'date' || format === 'dateTime') && value) {
		const date = value instanceof Date ? value : new Date(String(value));
		return Number.isNaN(date.getTime())
			? String(value)
			: new Intl.DateTimeFormat(undefined, {
					dateStyle: 'medium',
					timeStyle: format === 'dateTime' ? 'short' : undefined,
				}).format(date);
	}
	return String(value);
}

export function resolveVisualizationRows(data: unknown, resultPath?: string) {
	const value = resultPath ? getAtPath(data, resultPath) : data;
	const candidate = value ?? data;
	if (Array.isArray(candidate)) return candidate.map(asRow);
	if (Array.isArray(getAtPath(candidate, 'items'))) {
		return (getAtPath(candidate, 'items') as unknown[]).map(asRow);
	}
	if (Array.isArray(getAtPath(candidate, 'rows'))) {
		return (getAtPath(candidate, 'rows') as unknown[]).map(asRow);
	}
	if (Array.isArray(getAtPath(candidate, 'data'))) {
		return (getAtPath(candidate, 'data') as unknown[]).map(asRow);
	}
	return candidate && typeof candidate === 'object' ? [asRow(candidate)] : [];
}

export function getAtPath(source: unknown, path: string): unknown {
	if (!path || source == null) return source;
	return path
		.replace(/\[(\d+)\]/g, '.$1')
		.split('.')
		.filter(Boolean)
		.reduce<unknown>((current, segment) => {
			if (current == null || typeof current !== 'object') return undefined;
			return (current as Record<string, unknown>)[segment];
		}, source);
}

export function toNumber(value: unknown): number | null {
	if (typeof value === 'number' && Number.isFinite(value)) return value;
	if (typeof value === 'string' && value.trim()) {
		const parsed = Number(value);
		return Number.isFinite(parsed) ? parsed : null;
	}
	return null;
}

function asRow(value: unknown): Record<string, unknown> {
	return value && typeof value === 'object'
		? (value as Record<string, unknown>)
		: { value };
}
