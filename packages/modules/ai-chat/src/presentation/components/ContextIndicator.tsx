'use client';

import * as React from 'react';
import { cn } from '@lssm/lib.ui-kit-web/ui/utils';
import { Badge } from '@lssm/lib.ui-kit-web/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@lssm/lib.ui-kit-web/ui/tooltip';
import { FolderOpen, FileCode, Zap, Info } from 'lucide-react';
import type { WorkspaceSummary } from '../../context/workspace-context';

export interface ContextIndicatorProps {
  /** Workspace summary */
  summary?: WorkspaceSummary;
  /** Whether context is active */
  active?: boolean;
  /** Additional class name */
  className?: string;
  /** Show details */
  showDetails?: boolean;
}

/**
 * Indicator showing active workspace context
 */
export function ContextIndicator({
  summary,
  active = false,
  className,
  showDetails = true,
}: ContextIndicatorProps) {
  if (!summary && !active) {
    return (
      <div
        className={cn(
          'flex items-center gap-1.5 text-sm',
          'text-muted-foreground',
          className
        )}
      >
        <Info className="h-4 w-4" />
        <span>No workspace context</span>
      </div>
    );
  }

  const content = (
    <div
      className={cn(
        'flex items-center gap-2',
        active ? 'text-foreground' : 'text-muted-foreground',
        className
      )}
    >
      <Badge
        variant={active ? 'default' : 'secondary'}
        className="flex items-center gap-1"
      >
        <Zap className="h-3 w-3" />
        Context
      </Badge>

      {summary && showDetails && (
        <>
          <div className="flex items-center gap-1 text-xs">
            <FolderOpen className="h-3.5 w-3.5" />
            <span>{summary.name}</span>
          </div>

          <div className="flex items-center gap-1 text-xs">
            <FileCode className="h-3.5 w-3.5" />
            <span>{summary.specs.total} specs</span>
          </div>
        </>
      )}
    </div>
  );

  if (!summary) {
    return content;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-[300px]">
          <div className="flex flex-col gap-2 text-sm">
            <div className="font-medium">{summary.name}</div>
            <div className="text-muted-foreground text-xs">{summary.path}</div>

            <div className="border-t pt-2">
              <div className="grid grid-cols-2 gap-1 text-xs">
                <span>Commands:</span>
                <span className="text-right">{summary.specs.commands}</span>
                <span>Queries:</span>
                <span className="text-right">{summary.specs.queries}</span>
                <span>Events:</span>
                <span className="text-right">{summary.specs.events}</span>
                <span>Presentations:</span>
                <span className="text-right">
                  {summary.specs.presentations}
                </span>
              </div>
            </div>

            <div className="border-t pt-2 text-xs">
              <span>{summary.files.total} files</span>
              <span className="mx-1">•</span>
              <span>{summary.files.specFiles} spec files</span>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
