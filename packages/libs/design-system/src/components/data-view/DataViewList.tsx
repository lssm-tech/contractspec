'use client';

import * as React from 'react';
import type {
  DataViewSpec,
  DataViewListConfig,
  DataViewField,
} from '@lssm/lib.contracts/data-views';
import { cn } from '../../lib/utils';
import { getAtPath, formatValue } from './utils';

export interface DataViewListProps {
  spec: DataViewSpec;
  items: Record<string, unknown>[];
  className?: string;
  renderActions?: (item: Record<string, unknown>) => React.ReactNode;
  onSelect?: (item: Record<string, unknown>) => void;
  emptyState?: React.ReactNode;
}

export function DataViewList({
  spec,
  items,
  className,
  renderActions,
  onSelect,
  emptyState,
}: DataViewListProps) {
  if (spec.view.kind !== 'list') {
    throw new Error(
      `DataViewList received view kind "${spec.view.kind}", expected "list".`
    );
  }
  const view = spec.view as DataViewListConfig;
  const fields = view.fields;
  const primaryField =
    view.primaryField ??
    fields.find((field) => field.key === view.primaryField)?.key ??
    fields[0]?.key;

  if (!items.length) {
    return (
      <div className={cn('flex w-full flex-col gap-4', className)}>
        {emptyState ?? (
          <div className="rounded-md border border-dashed border-muted-foreground/40 p-8 text-center text-sm text-muted-foreground">
            No records available.
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={cn('flex w-full flex-col gap-4', className)}>
      {items.map((item, idx) => (
        <button
          type="button"
          key={idx}
          className={cn(
            'flex w-full flex-col gap-2 rounded-lg border border-muted bg-card p-4 text-left shadow-sm transition hover:border-primary/40 hover:shadow-md focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40',
            view.layout === 'compact' && 'md:flex-row md:items-center md:gap-4'
          )}
          onClick={() => onSelect?.(item)}
        >
          <div className="flex flex-1 flex-col gap-1">
            {primaryField ? (
              <span className="text-base font-medium text-foreground">
                {displayValue(item, fields, primaryField)}
              </span>
            ) : null}
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
              {secondaryFieldKeys(view, primaryField).map((fieldKey) => (
                <span key={fieldKey} className="flex items-center gap-1.5">
                  <span className="font-medium text-foreground/80">
                    {fieldLabel(fields, fieldKey)}
                  </span>
                  <span>{displayValue(item, fields, fieldKey)}</span>
                </span>
              ))}
            </div>
          </div>
          {renderActions ? (
            <div className="flex shrink-0 items-center gap-2">
              {renderActions(item)}
            </div>
          ) : null}
        </button>
      ))}
    </div>
  );
}

function fieldLabel(fields: DataViewField[], key: string) {
  return fields.find((field) => field.key === key)?.label ?? key;
}

function fieldByKey(fields: DataViewField[], key?: string) {
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

function secondaryFieldKeys(view: DataViewListConfig, primaryField?: string) {
  if (view.secondaryFields?.length) return view.secondaryFields;
  return view.fields
    .map((field) => field.key)
    .filter((key) => key !== primaryField);
}

