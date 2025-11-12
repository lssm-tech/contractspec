import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Filter } from 'lucide-react';
import { Button } from '../../button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../../collapsible';
import { SearchInput } from '../../atoms/SearchInput';
import { FilterSelect } from '../../atoms/FilterSelect';
import type { SearchAndFilterProps } from './types';

export const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  searchValue,
  onSearchChange,
  searchPlaceholder,
  filters = [],
  isLoading = false,
  disabled = false,
  className = '',
  collapsible = true,
  defaultCollapsed = false,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  const hasFilters = filters.length > 0;
  const activeFiltersCount = filters.filter((f) => f.value).length;

  // On mobile, show collapsible by default; on desktop, always show filters
  const shouldUseCollapsible = collapsible && hasFilters;

  console.log('SearchAndFilter', { filters });

  const FilterComponents = () => (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {filters.map((filter) => (
        <FilterSelect
          key={filter.key}
          value={{ value: filter.value, label: filter.value }}
          options={filter.options}
          onChange={filter.onChange}
          label={filter.label}
          disabled={disabled || isLoading}
          showCounts={filter.showCounts}
          className="min-w-0"
        />
      ))}
    </div>
  );

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search - Always visible */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex-1">
          <SearchInput
            value={searchValue}
            onChange={onSearchChange}
            placeholder={searchPlaceholder}
            disabled={disabled || isLoading}
            className="w-full"
          />
        </div>

        {/* Filter toggle for mobile */}
        {shouldUseCollapsible && (
          <Collapsible
            open={!isCollapsed}
            onOpenChange={setIsCollapsed}
            className="sm:hidden"
          >
            <CollapsibleTrigger asChild>
              <Button
                variant="outline"
                className="sm:hidden"
                disabled={disabled || isLoading}
              >
                <Filter className="mr-2 h-4 w-4" />
                Filtres
                {activeFiltersCount > 0 && (
                  <span className="bg-primary text-primary-foreground ml-2 flex h-5 w-5 items-center justify-center rounded-full text-sm">
                    {activeFiltersCount}
                  </span>
                )}
                {isCollapsed ? (
                  <ChevronDown className="ml-2 h-4 w-4" />
                ) : (
                  <ChevronUp className="ml-2 h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-4 space-y-4">
              <FilterComponents />
            </CollapsibleContent>
          </Collapsible>
        )}
      </div>

      {/* Filters - Always visible on desktop, collapsible on mobile */}
      {hasFilters && (
        <div className="hidden sm:block">
          <FilterComponents />
        </div>
      )}

      {/* Active filters summary */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-muted-foreground text-base">
            Filtres actifs:
          </span>
          {filters
            .filter((f) => f.value)
            .map((filter) => {
              const selectedOption = filter.options.find(
                (opt) => opt.value === filter.value
              );
              return (
                <Button
                  key={filter.key}
                  variant="secondary"
                  size="sm"
                  onPress={() => filter.onChange(undefined)}
                  disabled={disabled || isLoading}
                  className="h-7 px-2 text-sm"
                >
                  {filter.label}: {selectedOption?.label}
                  <span className="ml-1">×</span>
                </Button>
              );
            })}
        </div>
      )}
    </div>
  );
};
