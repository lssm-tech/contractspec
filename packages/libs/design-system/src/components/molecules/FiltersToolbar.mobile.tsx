import * as React from 'react';
import { Button, Input } from '@lssm/lib.design-system';
import { VStack, HStack } from '@lssm/lib.ui-kit/ui/stack';
import type { FiltersToolbarProps } from './FiltersToolbar';

export function FiltersToolbar({
  className,
  children,
  right,
  searchPlaceholder,
  searchValue,
  onSearchChange,
  onSearchSubmit,
  debounceMs = 250,
  activeChips = [],
  onClearAll,
}: FiltersToolbarProps) {
  const [q, setQ] = React.useState<string>(searchValue ?? '');

  React.useEffect(() => {
    setQ(searchValue ?? '');
  }, [searchValue]);

  React.useEffect(() => {
    if (!onSearchChange) return;
    const id = setTimeout(() => onSearchChange(q), debounceMs);
    return () => clearTimeout(id);
  }, [q, debounceMs, onSearchChange]);

  return (
    <VStack className={className}>
      <HStack className="items-center gap-2">
        {onSearchChange ? (
          <HStack className="flex-1 items-center gap-2">
            <Input
              value={q}
              onChange={setQ}
              placeholder={searchPlaceholder}
              keyboard={{ kind: 'search' }}
            />
            <Button variant="outline" onPress={() => onSearchSubmit?.()}>
              Rechercher
            </Button>
          </HStack>
        ) : null}
        {children}
        {right}
      </HStack>
      {/* For now chips are omitted on mobile; can add a compact chip row later with Pressable rows */}
    </VStack>
  );
}
