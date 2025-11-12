'use client';

import * as React from 'react';

export interface HoverPreviewDocProps {
  docType: string; // Quote | Invoice | Project etc.
  number?: string;
  title?: React.ReactNode;
  meta?: { label: React.ReactNode; value: React.ReactNode }[];
  status?: React.ReactNode;
  amount?: React.ReactNode;
  className?: string;
}

export function HoverPreviewDoc({
  docType,
  number,
  title,
  meta = [],
  status,
  amount,
  className,
}: HoverPreviewDocProps) {
  return (
    <div className={['space-y-2', className].filter(Boolean).join(' ')}>
      <div className="flex items-center justify-between">
        <div className="truncate text-sm font-medium">
          {docType}
          {number ? ` ${number}` : ''}
        </div>
        {status}
      </div>
      {title && (
        <div className="text-muted-foreground truncate text-base">{title}</div>
      )}
      {meta.length > 0 && (
        <div className="text-muted-foreground mt-1 space-y-1 text-base">
          {meta.map((m, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="whitespace-nowrap">{m.label}:</span>
              <span className="truncate">{m.value}</span>
            </div>
          ))}
        </div>
      )}
      {amount && <div className="pt-1 text-base font-medium">{amount}</div>}
    </div>
  );
}
