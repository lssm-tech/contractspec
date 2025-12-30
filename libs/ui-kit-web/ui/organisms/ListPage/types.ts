import type { ReactNode } from 'react';
import type { FilterOption } from '@contractspec/lib.ui-kit-web/ui/atoms/FilterSelect';
import type { UseListStateReturn } from '../../useListState';

export interface ListPageFilter {
  key: string;
  label: string;
  options: FilterOption[];
  showCounts?: boolean;
}

export interface ListPageProps<T = unknown> {
  // Page info
  title: string;
  description?: string;
  header?: ReactNode; // Optional custom header (replaces default title/description/actions block)

  // Data
  items: T[];
  totalItems: number;
  totalPages: number;
  isLoading: boolean;
  isFetching?: boolean;
  error?: Error | null;

  // List state
  listState: UseListStateReturn;

  // Search and filters
  searchPlaceholder?: string;
  filters?: ListPageFilter[];

  // Actions
  onRefresh?: () => void;
  primaryAction?: {
    label: string;
    href?: string;
    onClick?: () => void;
    icon?: ReactNode;
  };
  toolbar?: ReactNode;

  // Rendering
  renderItem: (item: T, index: number) => ReactNode;
  renderEmpty?: () => ReactNode;
  renderStats?: (items: T[]) => ReactNode;

  // Customization
  className?: string;
  itemClassName?: string;
}
