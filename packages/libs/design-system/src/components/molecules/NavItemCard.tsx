'use client';

import * as React from 'react';
import { cn } from '@contractspec/lib.ui-kit-web/ui/utils';
import type { NavLink } from '../../types/navigation';

export interface NavItemCardProps {
  item: NavLink;
  className?: string;
}

export function NavItemCard({ item, className }: NavItemCardProps) {
  return (
    <a
      href={item.href}
      className={cn(
        'hover:bg-accent block rounded-md p-2 transition-colors',
        className
      )}
      aria-label={typeof item.label === 'string' ? item.label : item.ariaLabel}
      target={item.target}
      rel={item.external ? 'noopener noreferrer' : undefined}
      onClick={item.onClick}
    >
      <div className="flex items-center gap-3">
        {item.imageSrc ? (
          // keep generic img to avoid coupling to Next.js Image
          <img
            src={item.imageSrc}
            alt={item.imageAlt || ''}
            className="h-12 w-12 rounded-xs object-cover"
          />
        ) : (
          item.icon || null
        )}
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-base font-medium">
            {item.label}
            {item.badge && (
              <span className="text-muted-foreground ml-1 text-xs">
                {item.badge}
              </span>
            )}
          </div>
          {item.description && (
            <div className="text-muted-foreground line-clamp-2 text-sm">
              {item.description}
            </div>
          )}
          {item.categories && item.categories.length > 0 && (
            <div className="mt-1 flex flex-wrap items-center gap-1">
              {item.categories.map((c, i) => (
                <span
                  key={i}
                  className="bg-muted text-muted-foreground rounded-xs px-1.5 py-0.5 text-[10px]"
                >
                  {c}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </a>
  );
}
