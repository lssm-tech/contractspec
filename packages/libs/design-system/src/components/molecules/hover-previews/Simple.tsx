'use client';

import * as React from 'react';

export interface HoverPreviewLine {
  icon?: React.ReactNode;
  label?: React.ReactNode;
  value: React.ReactNode;
}

export interface HoverPreviewSimpleProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  lines?: HoverPreviewLine[];
  footer?: React.ReactNode;
  className?: string;
}

export function HoverPreviewSimple({
  title,
  subtitle,
  lines = [],
  footer,
  className,
}: HoverPreviewSimpleProps) {
  return (
    <div className={['space-y-2', className].filter(Boolean).join(' ')}>
      <div className="truncate text-sm font-medium">{title}</div>
      {subtitle && (
        <div className="text-muted-foreground truncate text-base">
          {subtitle}
        </div>
      )}
      {lines.length > 0 && (
        <div className="mt-2 space-y-1">
          {lines.map((l, idx) => (
            <div
              key={idx}
              className="text-muted-foreground flex items-center gap-2 text-base"
            >
              {l.icon}
              {l.label ? (
                <>
                  <span className="whitespace-nowrap">{l.label}:</span>
                  <span className="truncate">{l.value}</span>
                </>
              ) : (
                <span className="truncate">{l.value}</span>
              )}
            </div>
          ))}
        </div>
      )}
      {footer && (
        <div className="text-muted-foreground pt-1 text-base">{footer}</div>
      )}
    </div>
  );
}
