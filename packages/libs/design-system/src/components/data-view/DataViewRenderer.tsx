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
}: DataViewRendererProps) {
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
}
