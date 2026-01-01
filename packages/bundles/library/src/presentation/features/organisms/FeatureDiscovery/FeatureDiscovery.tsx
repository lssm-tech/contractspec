'use client';

import {
  PageHeaderResponsive,
  EmptyState,
  Button,
} from '@contractspec/lib.design-system';
import { VStack } from '@contractspec/lib.ui-kit-web/ui/stack';
import { cn } from '@contractspec/lib.ui-kit-web/ui/utils';
import { useFeatureRegistry } from '../../hooks/useFeatureRegistry';
import { useFeatureFilters } from '../../hooks/useFeatureFilters';
import { FeatureCard } from '../../molecules/FeatureCard';
import { FeatureFiltersBar } from '../../molecules/FeatureFilters';
import type { FeatureDiscoveryProps } from './types';

/**
 * Main feature discovery UI.
 * Provides search, filtering, and browsing of registered features.
 */
export function FeatureDiscovery({
  onSelectFeature,
  className,
}: FeatureDiscoveryProps) {
  const { features, getUniqueTags, getUniqueStabilities } =
    useFeatureRegistry();
  const {
    filters,
    setSearch,
    toggleTag,
    toggleStability,
    clearFilters,
    filteredFeatures,
    hasActiveFilters,
  } = useFeatureFilters(features);

  const uniqueTags = getUniqueTags();
  const uniqueStabilities = getUniqueStabilities();

  return (
    <VStack gap="lg" className={cn('w-full p-6', className)}>
      <PageHeaderResponsive
        title="Feature Discovery"
        subtitle="Browse and explore available ContractSpec features"
      />

      <FeatureFiltersBar
        uniqueTags={uniqueTags}
        uniqueStabilities={uniqueStabilities}
        filters={filters}
        setSearch={setSearch}
        toggleTag={toggleTag}
        toggleStability={toggleStability}
        clearFilters={clearFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {filteredFeatures.length === 0 ? (
        <EmptyState
          title="No features found"
          description={
            hasActiveFilters
              ? 'Try adjusting your search or filters'
              : 'No features are registered yet'
          }
          primaryAction={
            hasActiveFilters ? (
              <Button variant="outline" onClick={clearFilters}>
                Clear filters
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredFeatures.map((feature) => (
            <FeatureCard
              key={feature.meta.key}
              feature={feature}
              onSelect={onSelectFeature}
            />
          ))}
        </div>
      )}
    </VStack>
  );
}
