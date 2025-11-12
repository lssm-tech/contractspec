'use client';

import * as React from 'react';

export interface HoverPreviewMediaProps {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  media: React.ReactNode; // image/video/illustration
  caption?: React.ReactNode;
  className?: string;
}

export function HoverPreviewMedia({
  title,
  subtitle,
  media,
  caption,
  className,
}: HoverPreviewMediaProps) {
  return (
    <div className={['space-y-2', className].filter(Boolean).join(' ')}>
      {title && <div className="truncate text-sm font-medium">{title}</div>}
      {subtitle && (
        <div className="text-muted-foreground truncate text-base">
          {subtitle}
        </div>
      )}
      <div className="bg-card rounded-md border p-1">{media}</div>
      {caption && (
        <div className="text-muted-foreground text-base">{caption}</div>
      )}
    </div>
  );
}
