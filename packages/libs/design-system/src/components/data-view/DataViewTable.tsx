'use client';

import * as React from 'react';
import type {
  DataViewSpec,
  DataViewTableConfig,
  DataViewField,
} from '@contractspec/lib.contracts/data-views';
import { cn } from '../../lib/utils';
import { getAtPath, formatValue } from './utils';

export interface DataViewTableProps {
  spec: DataViewSpec;
  items: Record<string, unknown>[];
  className?: string;
  onRowClick?: (item: Record<string, unknown>) => void;
  emptyState?: React.ReactNode;
  headerActions?: React.ReactNode;
  footer?: React.ReactNode;
}

export function DataViewTable({
  spec,
  items,
  className,
  onRowClick,
  emptyState,
  headerActions,
  footer,
}: DataViewTableProps) {
  if (spec.view.kind !== 'table') {
    throw new Error(
      `DataViewTable received view kind "${spec.view.kind}", expected "table".`
    );
  }

  const view = spec.view as DataViewTableConfig;
  const fields = view.fields;
  const columns =
    view.columns?.map((column) => ({
      ...column,
      label: column.label ?? fieldLabel(fields, column.field),
    })) ??
    fields.map((field) => ({
      field: field.key,
      label: field.label,
      align: 'left' as const,
    }));

  if (!items.length) {
    return (
      <div className={cn('flex w-full flex-col gap-4', className)}>
        <div className="flex items-center justify-between">
          <h3 className="text-foreground text-base font-semibold">
            {spec.meta.title}
          </h3>
          {headerActions}
        </div>
        {emptyState ?? (
          <div className="border-muted-foreground/40 text-muted-foreground rounded-md border border-dashed p-8 text-center text-sm">
            No records available.
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={cn('flex w-full flex-col gap-4', className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-foreground text-base font-semibold">
          {spec.meta.title}
        </h3>
        {headerActions}
      </div>
      <div className="border-border bg-card overflow-x-auto rounded-lg border shadow-sm">
        <table
          className={cn(
            'divide-border min-w-full divide-y text-sm',
            view.density === 'compact' ? 'text-sm' : 'text-base'
          )}
        >
          <thead className="bg-muted/50">
            <tr>
              {columns.map((column, columnIdx) => (
                <th
                  key={`${column.field}.${columnIdx}`}
                  scope="col"
                  className={cn(
                    'text-muted-foreground px-4 py-3 text-left font-semibold',
                    alignmentClass(column.align)
                  )}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-border bg-background divide-y">
            {items.map((item, rowIdx) => (
              <tr
                key={rowIdx}
                className={cn(
                  onRowClick &&
                    'hover:bg-muted/30 cursor-pointer transition-colors'
                )}
                onClick={() => onRowClick?.(item)}
              >
                {columns.map((column) => (
                  <td
                    key={column.field}
                    className={cn(
                      'text-foreground px-4 py-3',
                      alignmentClass(column.align)
                    )}
                  >
                    {displayValue(item, fields, column.field)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {footer}
    </div>
  );
}

function fieldLabel(fields: DataViewField[], key: string) {
  return fields.find((field) => field.key === key)?.label ?? key;
}

function fieldByKey(fields: DataViewField[], key: string) {
  return fields.find((field) => field.key === key);
}

function displayValue(
  item: Record<string, unknown>,
  fields: DataViewField[],
  key: string
) {
  const field = fieldByKey(fields, key);
  if (!field) return '';
  const value = getAtPath(item, field.dataPath);
  return formatValue(value, field.format);
}

function alignmentClass(
  align: 'left' | 'center' | 'right' | undefined
): string | undefined {
  switch (align) {
    case 'center':
      return 'text-center';
    case 'right':
      return 'text-right';
    default:
      return 'text-left';
  }
}
