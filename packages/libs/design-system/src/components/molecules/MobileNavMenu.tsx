'use client';

import * as React from 'react';
import { cn } from '@contractspec/lib.ui-kit-web/ui/utils';
import type { HeaderNavItem } from '../../types/navigation';
import { NavItemCard } from './NavItemCard';

export function MobileNavMenu({
  items,
  className,
}: {
  items: HeaderNavItem[];
  className?: string;
}) {
  return (
    <nav className={cn('flex flex-col gap-3', className)}>
      {items.map((it) => (
        <div
          key={String(it.key ?? it.href ?? it.label)}
          className="flex flex-col gap-2"
        >
          <a href={it.href || '#'} className="text-base font-semibold">
            {it.label}
          </a>
          {it.items && it.items.length > 0 && (
            <div className="grid grid-cols-1 gap-2">
              {it.items.map((l) => (
                <NavItemCard key={l.href} item={l} />
              ))}
            </div>
          )}
        </div>
      ))}
    </nav>
  );
}
