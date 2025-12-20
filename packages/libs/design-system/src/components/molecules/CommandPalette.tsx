'use client';

import * as React from 'react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@lssm/lib.ui-kit-web/ui/command';

export interface CommandPaletteProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  groups: {
    heading?: string;
    items: {
      id: string;
      label: string;
      shortcut?: string;
      onSelect?: () => void;
    }[];
  }[];
  placeholder?: string;
  kbd?: string; // e.g., ⌘K shown in UI copy
}

export function CommandPalette({
  open,
  onOpenChange,
  groups,
  placeholder = 'Type a command or search…',
}: CommandPaletteProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const isControlled = typeof open === 'boolean';
  const visible = isControlled ? open : internalOpen;
  const setVisible = (
    isControlled && onOpenChange ? onOpenChange : setInternalOpen
  ) as (open: boolean) => void;

  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setVisible(!visible);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [visible, setVisible]);

  return (
    <CommandDialog open={visible} onOpenChange={setVisible}>
      <CommandInput placeholder={placeholder} />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {groups.map((g, gi) => (
          <CommandGroup key={gi} heading={g.heading}>
            {g.items.map((it) => (
              <CommandItem key={it.id} onSelect={it.onSelect}>
                <span>{it.label}</span>
                {it.shortcut && (
                  <CommandShortcut>{it.shortcut}</CommandShortcut>
                )}
              </CommandItem>
            ))}
          </CommandGroup>
        ))}
        <CommandSeparator />
      </CommandList>
    </CommandDialog>
  );
}
