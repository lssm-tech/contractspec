'use client';

import * as React from 'react';
import { cn } from '@contractspec/lib.ui-kit-web/ui/utils';
import { ChevronDown, Boxes } from 'lucide-react';
import { HStack } from '@contractspec/lib.ui-kit-web/ui/stack';
import { StatusChip } from '@contractspec/lib.design-system';

export interface FeatureCategoryHeaderProps {
  /** Category/domain title */
  title: string;
  /** Number of features in this category */
  count: number;
  /** Icon for the category */
  icon?: React.ReactNode;
  /** Whether the section is collapsed */
  isCollapsed?: boolean;
  /** Toggle collapse state */
  onToggle?: () => void;
  /** Additional class name */
  className?: string;
}

/**
 * Category/domain section header for grouped feature display.
 */
export function FeatureCategoryHeader({
  title,
  count,
  icon,
  isCollapsed = false,
  onToggle,
  className,
}: FeatureCategoryHeaderProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        'flex w-full items-center justify-between rounded-lg px-4 py-3',
        'bg-muted/30 hover:bg-muted/50 transition-colors',
        'group cursor-pointer',
        className
      )}
    >
      <HStack gap="sm" className="items-center">
        <div className="text-muted-foreground group-hover:text-foreground transition-colors">
          {icon || <Boxes className="h-5 w-5" />}
        </div>
        <span className="group-hover:text-primary text-lg font-semibold capitalize transition-colors">
          {title}
        </span>
        <StatusChip
          tone="neutral"
          label={`${count} ${count === 1 ? 'feature' : 'features'}`}
          size="sm"
        />
      </HStack>
      <ChevronDown
        className={cn(
          'text-muted-foreground h-5 w-5 transition-transform duration-200',
          isCollapsed && '-rotate-90'
        )}
      />
    </button>
  );
}
