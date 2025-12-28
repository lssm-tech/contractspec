import type { FilterOption } from '@contractspec/lib.ui-kit-web/ui/atoms/FilterSelect';

export interface SearchAndFilterProps {
  // Search
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;

  // Filters
  filters?: {
    key: string;
    label: string;
    value: string;
    options: FilterOption[];
    onChange: (value: string) => void;
    showCounts?: boolean;
  }[];

  // State
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;

  // Mobile-first responsive
  collapsible?: boolean;
  defaultCollapsed?: boolean;
}
