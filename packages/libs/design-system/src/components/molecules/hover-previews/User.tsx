'use client';

import * as React from 'react';

export interface HoverPreviewUserProps {
  avatar?: React.ReactNode;
  name: React.ReactNode;
  email?: React.ReactNode;
  meta?: { label: React.ReactNode; value: React.ReactNode }[];
  actions?: React.ReactNode;
  className?: string;
}

export function HoverPreviewUser({
  avatar,
  name,
  email,
  meta = [],
  actions,
  className,
}: HoverPreviewUserProps) {
  return (
    <div className={['space-y-2', className].filter(Boolean).join(' ')}>
      <div className="flex items-center gap-3">
        {avatar}
        <div className="min-w-0">
          <div className="truncate text-sm font-medium">{name}</div>
          {email && (
            <div className="text-muted-foreground truncate text-base">
              {email}
            </div>
          )}
        </div>
      </div>
      {meta.length > 0 && (
        <div className="text-muted-foreground space-y-1 text-base">
          {meta.map((m, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="whitespace-nowrap">{m.label}:</span>
              <span className="truncate">{m.value}</span>
            </div>
          ))}
        </div>
      )}
      {actions && <div className="pt-1">{actions}</div>}
    </div>
  );
}
