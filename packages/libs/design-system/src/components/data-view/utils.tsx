'use client';

import type { DataViewFieldFormat } from '@contractspec/lib.contracts-spec/data-views/types';
import { MarkdownRenderer } from '../molecules/MarkdownRenderer';

export function getAtPath(
	source: Record<string, unknown> | undefined,
	path: string
): unknown {
	if (!source) return undefined;
	if (!path) return source;
	const segments = path
		.replace(/\[(\d+)\]/g, '.$1')
		.split('.')
		.filter(Boolean);

	let current: unknown = source;
	for (const segment of segments) {
		if (
			current == null ||
			(typeof current !== 'object' && !Array.isArray(current))
		)
			return undefined;
		current = (current as Record<string, unknown>)[segment];
	}
	return current;
}

export function DataViewFormattedValue({
	value,
	format,
}: {
	value: unknown;
	format?: DataViewFieldFormat;
}) {
	if (value == null) return '';
	const formatKind = typeof format === 'string' ? format : format?.type;
	switch (formatKind) {
		case 'boolean':
			return value ? 'Yes' : 'No';
		case 'number':
			return formatNumber(value, format);
		case 'currency':
			return formatCurrency(value, format);
		case 'percent':
		case 'percentage':
			return formatPercent(value, format);
		case 'date':
			return formatDate(
				value,
				typeof format === 'object' && format.type === 'date'
					? format
					: { dateStyle: 'medium' }
			);
		case 'time':
			return formatDate(
				value,
				typeof format === 'object' && format.type === 'time'
					? format
					: { timeStyle: 'short' }
			);
		case 'datetime':
		case 'dateTime':
			return formatDate(
				value,
				typeof format === 'object' && format.type === 'datetime'
					? format
					: {
							dateStyle: 'medium',
							timeStyle: 'short',
						}
			);
		case 'duration':
			return formatDuration(value, format);
		case 'markdown':
			return <MarkdownRenderer content={value as string} />;
		default:
			return String(value);
	}
}

function formatNumber(value: unknown, format?: DataViewFieldFormat): string {
	if (typeof value !== 'number') return String(value);
	const options =
		typeof format === 'object' && format.type === 'number' ? format : undefined;
	return new Intl.NumberFormat(options?.locale, {
		minimumFractionDigits: options?.minimumFractionDigits,
		maximumFractionDigits: options?.maximumFractionDigits,
		useGrouping: options?.useGrouping,
		notation: options?.notation,
		signDisplay: options?.signDisplay,
	}).format(value);
}

function formatCurrency(value: unknown, format?: DataViewFieldFormat): string {
	if (typeof value !== 'number') return String(value);
	const options =
		typeof format === 'object' && format.type === 'currency'
			? format
			: undefined;
	return new Intl.NumberFormat(options?.locale, {
		style: 'currency',
		currency: options?.currency ?? 'USD',
		currencyDisplay: options?.currencyDisplay,
		minimumFractionDigits: options?.rounded
			? 0
			: options?.minimumFractionDigits,
		maximumFractionDigits: options?.rounded
			? 0
			: options?.maximumFractionDigits,
		useGrouping: options?.useGrouping,
		notation: options?.notation,
		signDisplay: options?.signDisplay,
	}).format(value);
}

function formatPercent(value: unknown, format?: DataViewFieldFormat): string {
	if (typeof value !== 'number') return String(value);
	const options =
		typeof format === 'object' && format.type === 'percent'
			? format
			: undefined;
	const scaledValue = options?.valueScale === 'whole' ? value / 100 : value;
	return new Intl.NumberFormat(options?.locale, {
		style: 'percent',
		minimumFractionDigits: options?.minimumFractionDigits ?? 1,
		maximumFractionDigits: options?.maximumFractionDigits ?? 1,
		useGrouping: options?.useGrouping,
		notation: options?.notation,
		signDisplay: options?.signDisplay,
	}).format(scaledValue);
}

function formatDate(
	value: unknown,
	options: Intl.DateTimeFormatOptions
): string {
	const { locale, ...dateTimeOptions } =
		options as Intl.DateTimeFormatOptions & {
			locale?: string;
		};
	if (value instanceof Date) {
		return new Intl.DateTimeFormat(locale, dateTimeOptions).format(value);
	}
	if (typeof value === 'string' || typeof value === 'number') {
		const date = new Date(value);
		if (!Number.isNaN(date.getTime())) {
			return new Intl.DateTimeFormat(locale, dateTimeOptions).format(date);
		}
	}
	return String(value ?? '');
}

function formatDuration(value: unknown, format?: DataViewFieldFormat): string {
	if (typeof value !== 'number') return String(value);
	const options =
		typeof format === 'object' && format.type === 'duration'
			? format
			: undefined;
	const unit = options?.unit ?? 'second';
	if (options?.display === 'digital') {
		return formatDigitalDuration(toSeconds(value, unit));
	}
	return new Intl.NumberFormat(options?.locale, {
		style: 'unit',
		unit,
		unitDisplay: options?.display === 'narrow' ? 'narrow' : options?.display,
		maximumFractionDigits: 2,
	}).format(value);
}

function formatDigitalDuration(totalSeconds: number): string {
	const sign = totalSeconds < 0 ? '-' : '';
	const absoluteSeconds = Math.round(Math.abs(totalSeconds));
	const hours = Math.floor(absoluteSeconds / 3600);
	const minutes = Math.floor((absoluteSeconds % 3600) / 60);
	const seconds = absoluteSeconds % 60;
	const padded = [minutes, seconds]
		.map((part) => String(part).padStart(2, '0'))
		.join(':');
	return hours > 0 ? `${sign}${hours}:${padded}` : `${sign}${padded}`;
}

function toSeconds(value: number, unit: string): number {
	switch (unit) {
		case 'millisecond':
			return value / 1000;
		case 'minute':
			return value * 60;
		case 'hour':
			return value * 3600;
		case 'day':
			return value * 86_400;
		case 'week':
			return value * 604_800;
		case 'month':
			return value * 2_629_746;
		case 'year':
			return value * 31_556_952;
		case 'second':
		default:
			return value;
	}
}
