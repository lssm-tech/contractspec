'use client';

import * as React from 'react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@contractspec/lib.ui-kit-web/ui/collapsible';
import { cn } from '@contractspec/lib.ui-kit-web/ui/utils';
import { ChevronDown, Dot, type LucideIcon } from 'lucide-react';

export type ChainOfThoughtStepStatus = 'complete' | 'active' | 'pending';

export interface ChainOfThoughtProps {
  children: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

export function ChainOfThought({
  children,
  open,
  defaultOpen = false,
  onOpenChange,
  className,
}: ChainOfThoughtProps) {
  return (
    <Collapsible
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      className={cn('group/cot mt-2', className)}
    >
      {children}
    </Collapsible>
  );
}

export interface ChainOfThoughtHeaderProps {
  children?: React.ReactNode;
  className?: string;
}

export function ChainOfThoughtHeader({
  children = 'Chain of Thought',
  className,
}: ChainOfThoughtHeaderProps) {
  return (
    <CollapsibleTrigger
      className={cn(
        'hover:bg-muted flex w-full cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
        className
      )}
    >
      <ChevronDown className="text-muted-foreground h-4 w-4 shrink-0 transition-transform group-data-[state=open]/cot:rotate-180" />
      {children}
    </CollapsibleTrigger>
  );
}

export interface ChainOfThoughtStepProps {
  label: string;
  description?: string;
  status?: ChainOfThoughtStepStatus;
  icon?: LucideIcon;
  children?: React.ReactNode;
  className?: string;
}

export function ChainOfThoughtStep({
  label,
  description,
  status = 'complete',
  icon: Icon = Dot,
  children,
  className,
}: ChainOfThoughtStepProps) {
  return (
    <div
      className={cn(
        'border-border flex gap-3 border-b py-2 last:border-b-0',
        className
      )}
    >
      <div
        className={cn(
          'mt-1.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full',
          status === 'complete' &&
            'bg-green-500/20 text-green-700 dark:text-green-400',
          status === 'active' &&
            'bg-blue-500/20 text-blue-700 dark:text-blue-400',
          status === 'pending' && 'bg-muted text-muted-foreground'
        )}
      >
        <Icon className="h-3 w-3" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-medium">{label}</p>
        {description && (
          <p className="text-muted-foreground mt-0.5 text-xs">{description}</p>
        )}
        {children && <div className="mt-2">{children}</div>}
      </div>
    </div>
  );
}

export interface ChainOfThoughtContentProps {
  children: React.ReactNode;
  className?: string;
}

export function ChainOfThoughtContent({
  children,
  className,
}: ChainOfThoughtContentProps) {
  return (
    <CollapsibleContent>
      <div
        className={cn(
          'bg-muted border-border mt-1 rounded-md border px-3 py-2',
          className
        )}
      >
        {children}
      </div>
    </CollapsibleContent>
  );
}
