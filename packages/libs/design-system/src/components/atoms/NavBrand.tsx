'use client';

import * as React from 'react';
import { cn } from '@contractspec/lib.ui-kit-web/ui/utils';

export interface NavBrandProps {
  href?: string;
  logo?: React.ReactNode;
  title?: React.ReactNode;
  className?: string;
}

export function NavBrand({
  href = '/',
  logo,
  title,
  className,
}: NavBrandProps) {
  const content = (
    <div
      className={cn(
        'flex items-center gap-2 truncate font-semibold',
        className
      )}
    >
      {logo}
      {title && <span className="truncate text-xl font-bold">{title}</span>}
    </div>
  );
  return href ? (
    <a href={href} className="flex items-center" aria-label="Home">
      {content}
    </a>
  ) : (
    content
  );
}
