import * as React from 'react';
import type { EmptyDataListProps } from '../../../organisms/EmptyDataList.types';

export interface ListPageTemplateProps<T = unknown> {
  children?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  breadcrumb?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
  // Filters/Search
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (v: string) => void;
  onSearchSubmit?: () => void;
  // Unified list surface (required on both platforms)
  isLoading?: boolean;
  data: T[] | null;
  renderItem: (args: { item: T; index: number }) => React.ReactNode;
  emptyProps: EmptyDataListProps;
}
