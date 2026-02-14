'use client';

import { useState, useMemo, useCallback } from 'react';
import type { FeatureModuleSpec } from '@contractspec/lib.contracts-spec/features';

export interface FeatureFilters {
  search: string;
  tags: string[];
  stability: string[];
  domain: string[];
}

export interface UseFeatureFiltersReturn {
  /** Current filter state. */
  filters: FeatureFilters;
  /** Update the search query. */
  setSearch: (search: string) => void;
  /** Toggle a tag filter. */
  toggleTag: (tag: string) => void;
  /** Toggle a stability filter. */
  toggleStability: (stability: string) => void;
  /** Toggle a domain filter. */
  toggleDomain: (domain: string) => void;
  /** Clear all filters. */
  clearFilters: () => void;
  /** Filtered features based on current filters. */
  filteredFeatures: FeatureModuleSpec[];
  /** Whether any filters are active. */
  hasActiveFilters: boolean;
}

const defaultFilters: FeatureFilters = {
  search: '',
  tags: [],
  stability: [],
  domain: [],
};

/**
 * Hook for managing feature filter state.
 * Provides filter controls and filtered feature list.
 */
export function useFeatureFilters(
  features: FeatureModuleSpec[]
): UseFeatureFiltersReturn {
  const [filters, setFilters] = useState<FeatureFilters>(defaultFilters);

  const setSearch = useCallback((search: string) => {
    setFilters((prev) => ({ ...prev, search }));
  }, []);

  const toggleTag = useCallback((tag: string) => {
    setFilters((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));
  }, []);

  const toggleStability = useCallback((stability: string) => {
    setFilters((prev) => ({
      ...prev,
      stability: prev.stability.includes(stability)
        ? prev.stability.filter((s) => s !== stability)
        : [...prev.stability, stability],
    }));
  }, []);

  const toggleDomain = useCallback((domain: string) => {
    setFilters((prev) => ({
      ...prev,
      domain: prev.domain.includes(domain)
        ? prev.domain.filter((d) => d !== domain)
        : [...prev.domain, domain],
    }));
  }, []);

  const clearFilters = useCallback(() => setFilters(defaultFilters), []);

  const hasActiveFilters = useMemo(() => {
    return (
      filters.search.length > 0 ||
      filters.tags.length > 0 ||
      filters.stability.length > 0 ||
      filters.domain.length > 0
    );
  }, [filters]);

  const filteredFeatures = useMemo(() => {
    return features.filter((feature) => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const title = feature.meta.title ?? '';
        const matches =
          title.toLowerCase().includes(searchLower) ||
          feature.meta.description?.toLowerCase().includes(searchLower) ||
          feature.meta.key.toLowerCase().includes(searchLower);
        if (!matches) return false;
      }

      // Tag filter
      if (filters.tags.length > 0) {
        const hasTag = filters.tags.some((tag) =>
          feature.meta.tags?.includes(tag)
        );
        if (!hasTag) return false;
      }

      // Stability filter
      if (filters.stability.length > 0) {
        if (!filters.stability.includes(feature.meta.stability ?? 'unknown'))
          return false;
      }

      // Domain filter
      if (filters.domain.length > 0) {
        if (!filters.domain.includes(feature.meta.domain ?? 'unknown'))
          return false;
      }

      return true;
    });
  }, [features, filters]);

  return {
    filters,
    setSearch,
    toggleTag,
    toggleStability,
    toggleDomain,
    clearFilters,
    filteredFeatures,
    hasActiveFilters,
  };
}
