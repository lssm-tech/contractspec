'use client';

import * as React from 'react';
import type {
  DataViewSpec,
  DataViewDetailConfig,
  DataViewField,
} from '@lssm/lib.contracts/data-views';
import { cn } from '../../lib/utils';
import { getAtPath, formatValue } from './utils';

export interface DataViewDetailProps {
  spec: DataViewSpec;
  item: Record<string, unknown> | null;
  className?: string;
  emptyState?: React.ReactNode;
  headerActions?: React.ReactNode;
}

export function DataViewDetail({
  spec,
  item,
  className,
  emptyState,
  headerActions,
}: DataViewDetailProps) {
  if (spec.view.kind !== 'detail') {
    throw new Error(
      `DataViewDetail received view kind "${spec.view.kind}", expected "detail".`
    );
  }

  const view = spec.view as DataViewDetailConfig;
  const fields = view.fields;

  if (!item) {
    return (
      <div className={cn('flex w-full flex-col gap-4', className)}>
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-foreground">
            {spec.meta.title}
          </h3>
          {headerActions}
        </div>
        {emptyState ?? (
          <div className="rounded-md border border-dashed border-muted-foreground/40 p-8 text-center text-sm text-muted-foreground">
            Select a record to view details.
          </div>
        )}
      </div>
    );
  }

  const sections =
    view.sections && view.sections.length > 0
      ? view.sections
      : [{ fields: fields.map((field) => field.key) }];

  return (
    <div className={cn('flex w-full flex-col gap-6', className)}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-foreground">
            {spec.meta.title}
          </h3>
          <p className="text-sm text-muted-foreground">{spec.meta.description}</p>
        </div>
        {headerActions}
      </div>
      <div className="flex flex-col gap-6">
        {sections.map((section, idx) => (
          <div
            key={idx}
            className="rounded-lg border border-border bg-card p-4 shadow-sm"
          >
            {section.title ? (
              <h4 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                {section.title}
              </h4>
            ) : null}
            {section.description ? (
              <p className="mb-4 text-sm text-muted-foreground">
                {section.description}
              </p>
            ) : null}
            <dl className="grid gap-4 md:grid-cols-2">
              {section.fields.map((fieldKey) => {
                const field = fieldByKey(fields, fieldKey);
                if (!field) return null;
                const value = getAtPath(item, field.dataPath);
                return (
                  <div key={field.key} className="flex flex-col gap-1">
                    <dt className="text-xs font-semibold uppercase text-muted-foreground/80">
                      {field.label}
                    </dt>
                    <dd className="text-sm text-foreground">
                      {formatValue(value, field.format)}
                    </dd>
                  </div>
                );
              })}
            </dl>
          </div>
        ))}
      </div>
    </div>
  );
}

function fieldByKey(fields: DataViewField[], key: string) {
  return fields.find((field) => field.key === key);
}

