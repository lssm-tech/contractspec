'use client';

import * as React from 'react';
import type {
  DataViewGridConfig,
  DataViewListConfig,
  DataViewSpec,
} from '@lssm/lib.contracts/data-views';
import { DataViewList } from './DataViewList';
import { DataViewTable } from './DataViewTable';
import { DataViewDetail } from './DataViewDetail';
import { FiltersToolbar } from '../molecules/FiltersToolbar';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from '@lssm/lib.ui-kit-web/ui/pagination';

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

  // Filters & Search
  search?: string;
  onSearchChange?: (value: string) => void;
  filters?: Record<string, any>;
  onFilterChange?: (filters: Record<string, any>) => void;

  // Pagination
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
        return <div className={className}>Unsupported data view kind</div>;
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

  // Only render toolbar/pagination if it's a collection view
  const isCollection =
    spec.view.kind === 'list' ||
    spec.view.kind === 'table' ||
    spec.view.kind === 'grid';

  if (!isCollection) {
    return <>{viewContent}</>;
  }

  return (
    <div className="space-y-4">
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
                    const newFilters = { ...filters };
                    delete newFilters[key];
                    onFilterChange?.(newFilters);
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
        >
          {/* Render filter dropdowns here if needed */}
        </FiltersToolbar>
      )}

      {viewContent}

      {pagination && pagination.total > 0 && (
        <div className="py-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (pagination.page > 1) {
                      onPageChange?.(pagination.page - 1);
                    }
                  }}
                  aria-disabled={pagination.page <= 1}
                  className={
                    pagination.page <= 1 ? 'pointer-events-none opacity-50' : ''
                  }
                />
              </PaginationItem>

              {/* Simplified pagination: show current page */}
              <PaginationItem>
                <PaginationLink href="#" isActive>
                  {pagination.page}
                </PaginationLink>
              </PaginationItem>

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    const totalPages = Math.ceil(
                      pagination.total / pagination.pageSize
                    );
                    if (pagination.page < totalPages) {
                      onPageChange?.(pagination.page + 1);
                    }
                  }}
                  aria-disabled={
                    pagination.page >=
                    Math.ceil(pagination.total / pagination.pageSize)
                  }
                  className={
                    pagination.page >=
                    Math.ceil(pagination.total / pagination.pageSize)
                      ? 'pointer-events-none opacity-50'
                      : ''
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
          <div className="text-muted-foreground mt-2 text-center text-sm">
            Page {pagination.page} of{' '}
            {Math.ceil(pagination.total / pagination.pageSize)} (
            {pagination.total} items)
          </div>
        </div>
      )}
    </div>
  );
}
