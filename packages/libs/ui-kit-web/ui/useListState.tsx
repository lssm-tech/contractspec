import { useCallback, useMemo, useState } from 'react';

export interface UseListStateOptions {
  initialSearch?: string;
  initialFilters?: Record<string, string>;
  initialPage?: number;
  initialItemsPerPage?: number;
  debounceMs?: number;
}

export interface UseListStateReturn {
  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Filters
  filters: Record<string, string>;
  setFilter: (key: string, value: string) => void;
  clearFilters: () => void;

  // Pagination
  currentPage: number;
  itemsPerPage: number;
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (itemsPerPage: number) => void;

  // Combined state for API calls
  queryParams: {
    search: string;
    page: number;
    limit: number;
  } & Record<string, string | number>;

  // Reset all
  resetAll: () => void;
}

export const useListState = ({
  initialSearch = '',
  initialFilters = {},
  initialPage = 1,
  initialItemsPerPage = 25,
}: UseListStateOptions = {}): UseListStateReturn => {
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [filters, setFilters] = useState(initialFilters);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);

  const setFilter = useCallback((key: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
    // Reset to first page when filtering
    setCurrentPage(1);
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
    setCurrentPage(1);
  }, []);

  const handleSetSearchQuery = useCallback((query: string) => {
    setSearchQuery(query);
    // Reset to first page when searching
    setCurrentPage(1);
  }, []);

  const handleSetItemsPerPage = useCallback((newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    // Reset to first page when changing items per page
    setCurrentPage(1);
  }, []);

  const resetAll = useCallback(() => {
    setSearchQuery(initialSearch);
    setFilters(initialFilters);
    setCurrentPage(initialPage);
    setItemsPerPage(initialItemsPerPage);
  }, [initialSearch, initialFilters, initialPage, initialItemsPerPage]);

  const queryParams = useMemo(() => {
    const baseParams = {
      search: searchQuery,
      page: currentPage,
      limit: itemsPerPage,
    };

    // Add active filters to params
    const filterParams: Record<string, string> = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        filterParams[key] = value;
      }
    });

    return { ...baseParams, ...filterParams };
  }, [searchQuery, filters, currentPage, itemsPerPage]);

  return {
    searchQuery,
    setSearchQuery: handleSetSearchQuery,
    filters,
    setFilter,
    clearFilters,
    currentPage,
    itemsPerPage,
    setCurrentPage,
    setItemsPerPage: handleSetItemsPerPage,
    queryParams,
    resetAll,
  };
};
