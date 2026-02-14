'use client';

import { MarkdownRenderer } from '@contractspec/lib.example-shared-ui';
import type { DataViewFieldFormat } from '@contractspec/lib.contracts/data-views/types';

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
  switch (format) {
    case 'boolean':
      return value ? 'Yes' : 'No';
    case 'currency':
      return typeof value === 'number'
        ? new Intl.NumberFormat(undefined, {
            style: 'currency',
            currency: 'USD',
          }).format(value)
        : String(value);
    case 'percentage':
      return typeof value === 'number'
        ? `${(value * 100).toFixed(1)}%`
        : String(value);
    case 'date':
      return formatDate(value, {
        dateStyle: 'medium',
      });
    case 'dateTime':
      return formatDate(value, {
        dateStyle: 'medium',
        timeStyle: 'short',
      });
    case 'markdown':
      return <MarkdownRenderer content={value as string} />;
    default:
      return String(value);
  }
}

function formatDate(
  value: unknown,
  options: Intl.DateTimeFormatOptions
): string {
  if (value instanceof Date) {
    return new Intl.DateTimeFormat(undefined, options).format(value);
  }
  if (typeof value === 'string' || typeof value === 'number') {
    const date = new Date(value);
    if (!Number.isNaN(date.getTime())) {
      return new Intl.DateTimeFormat(undefined, options).format(date);
    }
  }
  return String(value ?? '');
}
