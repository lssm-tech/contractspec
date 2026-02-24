import * as React from 'react';
import { cn } from '@contractspec/lib.ui-kit-web/ui/utils';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';
import { Badge } from '@contractspec/lib.ui-kit-web/ui/badge';

export interface ActiveFilterChip {
  key: string;
  label: React.ReactNode;
  onRemove?: () => void;
}

export interface FiltersToolbarProps {
  className?: string;
  children?: React.ReactNode;
  right?: React.ReactNode;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onSearchSubmit?: () => void;
  debounceMs?: number;
  activeChips?: ActiveFilterChip[];
  onClearAll?: () => void;
}

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
    <div className={cn('space-y-2', className)}>
      <div className="flex flex-col items-stretch gap-2 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 items-center gap-2">
          {onSearchChange ? (
            <div className="flex flex-1 items-center gap-2">
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') onSearchSubmit?.();
                }}
                placeholder={searchPlaceholder}
                keyboard={{ kind: 'search' }}
              />
              <Button
                variant="outline"
                onPress={() => onSearchSubmit?.()}
                className="shrink-0"
              >
                Rechercher
              </Button>
            </div>
          ) : null}
          {children}
        </div>
        {right}
      </div>

      {(activeChips.length > 0 || onClearAll) && (
        <div className="flex flex-wrap items-center gap-2">
          {activeChips.map((c) => (
            <Badge
              key={c.key}
              variant="secondary"
              className="inline-flex items-center gap-2"
            >
              <span>{c.label}</span>
              {c.onRemove && (
                <button
                  type="button"
                  aria-label="Supprimer le filtre"
                  onClick={c.onRemove}
                  className="hover:bg-muted rounded-xs px-1 text-base"
                >
                  ×
                </button>
              )}
            </Badge>
          ))}
          {onClearAll && (
            <Button size="sm" variant="ghost" onPress={onClearAll}>
              Effacer les filtres
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
