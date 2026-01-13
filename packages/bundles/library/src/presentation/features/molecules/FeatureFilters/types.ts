import type {
  FeatureFilters,
  UseFeatureFiltersReturn,
} from '../../hooks/useFeatureFilters';

export interface FeatureFiltersBarProps {
  /** Available tags to filter by. */
  uniqueTags: string[];
  /** Available stabilities to filter by. */
  uniqueStabilities: string[];
  /** Current filter state. */
  filters: FeatureFilters;
  /** Set the search query. */
  setSearch: UseFeatureFiltersReturn['setSearch'];
  /** Toggle a tag filter. */
  toggleTag: UseFeatureFiltersReturn['toggleTag'];
  /** Toggle a stability filter. */
  toggleStability: UseFeatureFiltersReturn['toggleStability'];
  /** Clear all filters. */
  clearFilters: UseFeatureFiltersReturn['clearFilters'];
  /** Whether any filters are active. */
  hasActiveFilters: boolean;
  /** Additional class name. */
  className?: string;
}
