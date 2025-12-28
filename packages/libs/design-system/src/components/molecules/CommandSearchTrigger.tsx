'use client';

import * as React from 'react';
import { SearchIcon } from 'lucide-react';
import { cn } from '@contractspec/lib.ui-kit-web/ui/utils';
import { CommandPalette } from './CommandPalette';
import { Button } from '../atoms/Button';

export function CommandSearchTrigger({
  groups,
  className,
  placeholder = 'Search…',
  compact = false,
}: {
  groups: React.ComponentProps<typeof CommandPalette>['groups'];
  className?: string;
  placeholder?: string;
  compact?: boolean; // if true, render as icon button only
}) {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((p) => !p);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  return (
    <>
      <Button
        variant="ghost"
        type="button"
        onPress={() => setOpen(true)}
        className={cn(
          'group text-muted-foreground hover:bg-muted/40 inline-flex items-center gap-2 rounded-xs border px-3 text-sm',
          compact ? 'h-9 w-9 justify-center p-0' : 'h-9',
          className
        )}
        aria-label="Open search"
      >
        <SearchIcon className="h-4 w-4 opacity-70" />

        {!compact && (
          <span className="whitespace-nowrap">
            {placeholder}
            <span className="bg-muted ml-2 hidden items-center gap-1 rounded-xs border px-1.5 font-mono text-[10px] md:inline-flex">
              ⌘K
            </span>
          </span>
        )}
      </Button>
      <CommandPalette open={open} onOpenChange={setOpen} groups={groups} />
    </>
  );
}
