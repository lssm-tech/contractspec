'use client';

import * as React from 'react';
import type {
  DataViewGridConfig,
  DataViewListConfig,
  DataViewSpec,
} from '@contractspec/lib.contracts-spec/data-views';
import { Pagination as TablePagination } from '@contractspec/lib.ui-kit/ui/atoms/Pagination';
import { VStack } from '@contractspec/lib.ui-kit/ui/stack';
import { Text } from '@contractspec/lib.ui-kit/ui/text';
import { DataViewList } from './DataViewList';
import { DataViewTable } from './DataViewTable';
import { DataViewDetail } from './DataViewDetail';
import { FiltersToolbar } from '../molecules/FiltersToolbar';

export interface DataViewRendererProps {
  spec: DataViewSpec;
  items?: Record<string, unknown>[];
  item?: Record<string, unknown> | null;
  className?: string;
  renderActions?: (item: Record<string, unknown>) => React.ReactNode;
  onSelect?: (item: Record<string, unknown>) => void;
  onRowClick?: (item: Record<string, unknown>) => void;
  headerActions?: React.ReactNode;
  emptyState?: React.ReactNode;
  footer?: React.ReactNode;
  search?: string;
  onSearchChange?: (value: string) => void;
  filters?: Record<string, unknown>;
  onFilterChange?: (filters: Record<string, unknown>) => void;
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
  };
  onPageChange?: (page: number) => void;
}

export function DataViewRenderer({
  spec,
  items = [],
  item = null,
  className,
  renderActions,
  onSelect,
  onRowClick,
  headerActions,
  emptyState,
  footer,
  search,
  onSearchChange,
  filters,
  onFilterChange,
  pagination,
  onPageChange,
}: DataViewRendererProps) {
  const viewContent = React.useMemo(() => {
    switch (spec.view.kind) {
      case 'list':
        return (
          <DataViewList
            spec={spec}
            items={items}
            className={className}
            renderActions={renderActions}
            onSelect={onSelect}
            emptyState={emptyState}
          />
        );
      case 'table':
        return (
          <DataViewTable
            spec={spec}
            items={items}
            className={className}
            onRowClick={onRowClick}
            emptyState={emptyState}
            headerActions={headerActions}
            footer={footer}
          />
        );
      case 'detail':
        return (
          <DataViewDetail
            spec={spec}
            item={item}
            className={className}
            emptyState={emptyState}
            headerActions={headerActions}
          />
        );
      case 'grid': {
        const grid = spec.view as DataViewGridConfig;
        const listView: DataViewListConfig = {
          kind: 'list',
          layout: 'card',
          fields: grid.fields,
          filters: grid.filters,
          actions: grid.actions,
          primaryField: grid.primaryField,
          secondaryFields: grid.secondaryFields,
        };
        const listSpec = {
          ...spec,
          view: listView,
        } satisfies DataViewSpec;
        return (
          <DataViewList
            spec={listSpec}
            items={items}
            className={className}
            renderActions={renderActions}
            onSelect={onSelect}
            emptyState={emptyState}
          />
        );
      }
      default:
        return <Text className={className}>Unsupported data view kind</Text>;
    }
  }, [
    spec,
    items,
    item,
    className,
    renderActions,
    onSelect,
    onRowClick,
    headerActions,
    emptyState,
    footer,
  ]);

  const isCollection =
    spec.view.kind === 'list' ||
    spec.view.kind === 'table' ||
    spec.view.kind === 'grid';

  if (!isCollection) {
    return <>{viewContent}</>;
  }

  return (
    <VStack gap="lg">
      {(spec.view.filters?.length || onSearchChange) && (
        <FiltersToolbar
          searchValue={search}
          onSearchChange={onSearchChange}
          searchPlaceholder="Search..."
          activeChips={
            filters
              ? Object.entries(filters).map(([key, value]) => ({
                  key,
                  label: `${key}: ${value}`,
                  onRemove: () => {
                    if (filters) {
                      const { [key]: _, ...rest } = filters;
                      onFilterChange?.(rest);
                    }
                  },
                }))
              : []
          }
          onClearAll={
            filters && Object.keys(filters).length > 0
              ? () => onFilterChange?.({})
              : undefined
          }
          right={headerActions}
        />
      )}

      {viewContent}

      {pagination && pagination.total > 0 ? (
        <TablePagination
          currentPage={pagination.page}
          totalPages={Math.ceil(pagination.total / pagination.pageSize)}
          totalItems={pagination.total}
          itemsPerPage={pagination.pageSize}
          onPageChange={(page) => onPageChange?.(page)}
          onItemsPerPageChange={(pageSize) => {
            onPageChange?.(1);
            void pageSize;
          }}
          showItemsPerPage={false}
        />
      ) : null}
    </VStack>
  );
}
