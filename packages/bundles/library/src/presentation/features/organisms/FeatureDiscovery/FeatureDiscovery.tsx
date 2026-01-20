'use client';

import * as React from 'react';
import {
  PageHeaderResponsive,
  EmptyState,
  Button,
  StatusChip,
} from '@contractspec/lib.design-system';
import { VStack, HStack } from '@contractspec/lib.ui-kit-web/ui/stack';
import { cn } from '@contractspec/lib.ui-kit-web/ui/utils';
import { LayoutGrid, List, Star, ChevronDown } from 'lucide-react';
import { useFeatureRegistry } from '../../hooks/useFeatureRegistry';
import { useFeatureFilters } from '../../hooks/useFeatureFilters';
import { FeatureCard } from '../../molecules/FeatureCard';
import { FeatureFiltersBar } from '../../molecules/FeatureFilters';
import { FeatureCategoryHeader } from '../../molecules/FeatureCategoryHeader';
import type {
  FeatureDiscoveryProps,
  FeatureViewMode,
  FeatureGroupBy,
} from './types';
import type { FeatureModuleSpec } from '@contractspec/lib.contracts/features';

// Group features by domain
function groupFeaturesByDomain(features: FeatureModuleSpec[]) {
  const groups: Record<string, FeatureModuleSpec[]> = {};
  for (const feature of features) {
    const domain = feature.meta.domain || 'Other';
    if (!groups[domain]) groups[domain] = [];
    groups[domain].push(feature);
  }
  return groups;
}

// Group features by stability
function groupFeaturesByStability(features: FeatureModuleSpec[]) {
  const order = ['stable', 'beta', 'experimental', 'deprecated', 'unknown'];
  const groups: Record<string, FeatureModuleSpec[]> = {};
  for (const feature of features) {
    const stability = feature.meta.stability || 'unknown';
    if (!groups[stability]) groups[stability] = [];
    groups[stability].push(feature);
  }
  // Sort by order
  const sorted: Record<string, FeatureModuleSpec[]> = {};
  for (const key of order) {
    if (groups[key]) sorted[key] = groups[key];
  }
  return sorted;
}

/**
 * Main feature discovery UI.
 * Provides search, filtering, view modes, and browsing of registered features.
 */
export function FeatureDiscovery({
  onSelectFeature,
  className,
  defaultViewMode = 'grid',
  groupBy = 'domain',
  showFeatured = true,
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

  const [viewMode, setViewMode] =
    React.useState<FeatureViewMode>(defaultViewMode);
  const [collapsedGroups, setCollapsedGroups] = React.useState<Set<string>>(
    new Set()
  );

  // Featured features (stable)
  const featuredFeatures = React.useMemo(
    () => filteredFeatures.filter((f) => f.meta.stability === 'stable'),
    [filteredFeatures]
  );

  const nonFeaturedFeatures = React.useMemo(
    () =>
      showFeatured
        ? filteredFeatures.filter((f) => f.meta.stability !== 'stable')
        : filteredFeatures,
    [filteredFeatures, showFeatured]
  );

  // Group features
  const groupedFeatures = React.useMemo(() => {
    if (groupBy === 'none') return null;
    if (groupBy === 'domain') return groupFeaturesByDomain(nonFeaturedFeatures);
    return groupFeaturesByStability(nonFeaturedFeatures);
  }, [nonFeaturedFeatures, groupBy]);

  const toggleGroup = (group: string) => {
    setCollapsedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(group)) {
        next.delete(group);
      } else {
        next.add(group);
      }
      return next;
    });
  };

  const gridClasses =
    viewMode === 'grid'
      ? 'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'
      : 'flex flex-col gap-3';

  const renderFeatureCards = (featureList: FeatureModuleSpec[]) => (
    <div className={gridClasses}>
      {featureList.map((feature) => (
        <FeatureCard
          key={feature.meta.key}
          feature={feature}
          onSelect={onSelectFeature}
        />
      ))}
    </div>
  );

  return (
    <VStack gap="lg" className={cn('w-full p-6', className)}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PageHeaderResponsive
          title="Feature Discovery"
          subtitle={`Browse ${features.length} available ContractSpec features`}
        />
        <HStack gap="xs">
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className={cn(
              'rounded-md p-2 transition-colors',
              viewMode === 'grid'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted hover:bg-muted/80 text-muted-foreground'
            )}
            aria-label="Grid view"
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setViewMode('list')}
            className={cn(
              'rounded-md p-2 transition-colors',
              viewMode === 'list'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted hover:bg-muted/80 text-muted-foreground'
            )}
            aria-label="List view"
          >
            <List className="h-4 w-4" />
          </button>
        </HStack>
      </div>

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
        <VStack gap="lg">
          {/* Featured section */}
          {showFeatured && featuredFeatures.length > 0 && (
            <VStack gap="sm">
              <HStack gap="sm" className="items-center">
                <Star className="h-5 w-5 fill-amber-500 text-amber-500" />
                <span className="text-lg font-semibold">Featured</span>
                <StatusChip
                  tone="success"
                  label={`${featuredFeatures.length} stable`}
                  size="sm"
                />
              </HStack>
              {renderFeatureCards(featuredFeatures)}
            </VStack>
          )}

          {/* Grouped or flat display */}
          {groupedFeatures ? (
            <VStack gap="md">
              {Object.entries(groupedFeatures).map(([group, groupFeatures]) => (
                <VStack key={group} gap="sm">
                  <FeatureCategoryHeader
                    title={group}
                    count={groupFeatures.length}
                    isCollapsed={collapsedGroups.has(group)}
                    onToggle={() => toggleGroup(group)}
                  />
                  {!collapsedGroups.has(group) &&
                    renderFeatureCards(groupFeatures)}
                </VStack>
              ))}
            </VStack>
          ) : (
            renderFeatureCards(nonFeaturedFeatures)
          )}
        </VStack>
      )}
    </VStack>
  );
}
