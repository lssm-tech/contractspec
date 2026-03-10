'use client';

import * as React from 'react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@contractspec/lib.ui-kit-web/ui/collapsible';
import { cn } from '@contractspec/lib.ui-kit-web/ui/utils';
import { ExternalLink } from 'lucide-react';

export interface SourcesProps {
  children: React.ReactNode;
  className?: string;
}

export function Sources({ children, className }: SourcesProps) {
  return (
    <Collapsible className={cn('mt-2', className)} defaultOpen={false}>
      {children}
    </Collapsible>
  );
}

export interface SourcesTriggerProps {
  count: number;
  children?: React.ReactNode;
  className?: string;
}

export function SourcesTrigger({
  count,
  children,
  className,
}: SourcesTriggerProps) {
  return (
    <CollapsibleTrigger
      className={cn(
        'text-muted-foreground hover:text-foreground hover:bg-muted inline-flex cursor-pointer items-center gap-1.5 rounded-md px-2 py-1 text-xs transition-colors',
        className
      )}
    >
      {children ?? (
        <>
          <ExternalLink className="h-3 w-3" />
          {count} source{count !== 1 ? 's' : ''}
        </>
      )}
    </CollapsibleTrigger>
  );
}

export interface SourcesContentProps {
  children: React.ReactNode;
  className?: string;
}

export function SourcesContent({ children, className }: SourcesContentProps) {
  return (
    <CollapsibleContent>
      <div className={cn('mt-2 flex flex-wrap gap-2', className)}>
        {children}
      </div>
    </CollapsibleContent>
  );
}

export interface SourceProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  title?: string;
}

export function Source({
  href,
  title,
  className,
  children,
  ...props
}: SourceProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'text-muted-foreground hover:text-foreground bg-muted inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs transition-colors',
        className
      )}
      {...props}
    >
      {children ?? (
        <>
          <ExternalLink className="h-3 w-3" />
          {title ?? href}
        </>
      )}
    </a>
  );
}
