import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@contractspec/lib.ui-kit-web/ui/utils';

export interface TocItem {
  href: string;
  label: React.ReactNode;
}

const tocVariants = cva('text-base', {
  variants: {
    variant: {
      sidebar: 'space-y-2',
      inline: 'flex flex-wrap gap-3',
    },
    size: {
      sm: '',
      md: 'text-base',
    },
  },
  defaultVariants: { variant: 'sidebar', size: 'md' },
});

export type LegalTOCProps = {
  items: TocItem[];
  activeHref?: string;
  onNavigate?: (href: string) => void;
} & VariantProps<typeof tocVariants> &
  React.HTMLAttributes<HTMLDivElement>;

export function LegalTOC({
  items,
  activeHref,
  onNavigate,
  variant,
  size,
  className,
  ...props
}: LegalTOCProps) {
  return (
    <nav
      aria-label="Table of contents"
      className={cn(tocVariants({ variant, size }), className)}
      {...props}
    >
      {variant === 'inline' ? (
        items.map((it) => (
          <a
            key={it.href}
            href={it.href}
            onClick={(_e) => {
              onNavigate?.(it.href);
              // allow default anchor behaviour too
            }}
            className={cn(
              'hover:bg-accent hover:text-accent-foreground rounded-xs px-2 py-1',
              activeHref === it.href && 'bg-accent text-accent-foreground'
            )}
          >
            {it.label}
          </a>
        ))
      ) : (
        <ul className="list-none space-y-2 pl-0">
          {items.map((it) => (
            <li key={it.href}>
              <a
                href={it.href}
                onClick={() => onNavigate?.(it.href)}
                className={cn(
                  'hover:bg-accent hover:text-accent-foreground block rounded-xs px-2 py-1',
                  activeHref === it.href && 'bg-accent text-accent-foreground'
                )}
              >
                {it.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
}

export { tocVariants };
