'use client';

import { Button, Input } from '@contractspec/lib.design-system';
import { VStack, HStack } from '@contractspec/lib.ui-kit-web/ui/stack';
import { cn } from '@contractspec/lib.ui-kit-web/ui/utils';
import type { FeatureFiltersBarProps } from './types';

/**
 * Filter bar for feature discovery.
 * Provides search input, stability toggles, and tag pills.
 */
export function FeatureFiltersBar({
  uniqueTags,
  uniqueStabilities,
  filters,
  setSearch,
  toggleTag,
  toggleStability,
  clearFilters,
  hasActiveFilters,
  className,
}: FeatureFiltersBarProps) {
  return (
    <VStack gap="md" className={cn('w-full', className)}>
      <HStack gap="md" justify="between" className="w-full">
        <Input
          placeholder="Search features..."
          value={filters.search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md"
          aria-label="Search features"
        />
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Clear filters
          </Button>
        )}
      </HStack>

      {uniqueStabilities.length > 0 && (
        <HStack gap="xs" wrap="wrap">
          <span className="text-muted-foreground text-sm">Stability:</span>
          {uniqueStabilities.map((stability) => (
            <Button
              key={stability}
              variant={
                filters.stability.includes(stability) ? 'default' : 'outline'
              }
              size="sm"
              onClick={() => toggleStability(stability)}
              aria-pressed={filters.stability.includes(stability)}
            >
              {stability}
            </Button>
          ))}
        </HStack>
      )}

      {uniqueTags.length > 0 && (
        <HStack gap="xs" wrap="wrap">
          <span className="text-muted-foreground text-sm">Tags:</span>
          {uniqueTags.slice(0, 10).map((tag) => (
            <Button
              key={tag}
              variant={filters.tags.includes(tag) ? 'default' : 'outline'}
              size="sm"
              onClick={() => toggleTag(tag)}
              aria-pressed={filters.tags.includes(tag)}
            >
              #{tag}
            </Button>
          ))}
          {uniqueTags.length > 10 && (
            <span className="text-muted-foreground text-sm">
              +{uniqueTags.length - 10} more
            </span>
          )}
        </HStack>
      )}
    </VStack>
  );
}
