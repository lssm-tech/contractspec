import * as React from 'react';
import { cn } from '@contractspec/lib.ui-kit-web/ui/utils';
import { cva } from 'class-variance-authority';
import { VStack } from '@contractspec/lib.ui-kit-web/ui/stack';

export interface FooterProps {
  left?: React.ReactNode;
  center?: React.ReactNode;
  right?: React.ReactNode;
  links?: { label: React.ReactNode; href: string }[];
  className?: string;
  variant?: 'default' | 'marketing';
}

const footerVariants = cva('border-t px-4 text-base', {
  variants: {
    variant: {
      default: '',
      marketing: 'bg-muted/30',
    },
    density: {
      compact: 'py-4',
      comfortable: 'py-6',
    },
  },
  defaultVariants: {
    density: 'comfortable',
    variant: 'default',
  },
});

export function Footer({
  left,
  center,
  right,
  links,
  className,
  variant,
}: FooterProps) {
  return (
    <footer className={cn(footerVariants({ variant }), className)}>
      <div className="grid grid-cols-1 items-center gap-3 sm:grid-cols-3">
        <div className="flex items-center gap-3">{left}</div>
        <div className="text-muted-foreground text-center">{center}</div>
        <VStack>{right}</VStack>
      </div>

      {links && links.length > 0 && (
        <div className="text-muted-foreground mt-4 flex flex-wrap items-center justify-center gap-3 text-base">
          {links.map((l) => (
            <a
              href={l.href}
              key={String(l.href)}
              className="hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
        </div>
      )}
    </footer>
  );
}
