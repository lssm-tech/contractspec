import * as React from 'react';
import type {
  DataViewField,
  DataViewTableColumn,
  DataViewTableConfig,
} from '@contractspec/lib.contracts-spec/data-views';
import type { ContractTableInitialState } from '@contractspec/lib.presentation-runtime-core';
import { formatTableValue, getAtPath } from './table.utils';
import type {
  ContractTableColumnDef,
  UseDataViewTableOptions,
} from './table.types';
import { useContractTable } from './useContractTable';

export function useDataViewTable<TItem extends Record<string, unknown>>({
  spec,
  renderValue,
  renderExpandedContent,
  initialState,
  executionMode,
  selectionMode,
  ...options
}: UseDataViewTableOptions<TItem>) {
  if (spec.view.kind !== 'table') {
    throw new Error(
      `useDataViewTable received "${spec.view.kind}", expected "table".`
    );
  }

  const view = spec.view as DataViewTableConfig;
  const fieldsByKey = React.useMemo(
    () => new Map(view.fields.map((field) => [field.key, field])),
    [view.fields]
  );
  const resolvedColumns = React.useMemo<ContractTableColumnDef<TItem>[]>(() => {
    const columns = view.columns ?? view.fields.map(fieldToColumn);
    return columns.map((column) => {
      const field = fieldsByKey.get(column.field) ?? fallbackField(column);
      return {
        id: column.field,
        header: column.label ?? field.label,
        label: column.label ?? field.label,
        accessor: (item) => getAtPath(item, field.dataPath),
        cell: ({ item, rowIndex, value }) =>
          renderValue?.({ item, field, value, rowIndex }) ??
          formatTableValue(value, field.format),
        align: column.align ?? 'left',
        size: column.defaultWidth ?? sizeFromWidth(column.width ?? field.width),
        minSize: column.minWidth,
        maxSize: column.maxWidth,
        canSort: column.sortable ?? field.sortable ?? false,
        canHide: column.hideable ?? view.columnVisibility ?? false,
        canResize: column.resizable ?? view.columnResizing ?? false,
        canPin: Boolean(view.columnPinning),
        defaultPinned: column.pinned ?? false,
      };
    });
  }, [
    fieldsByKey,
    renderValue,
    view.columnPinning,
    view.columnResizing,
    view.columnVisibility,
    view.columns,
    view.fields,
  ]);

  const expandedFields = React.useMemo(
    () =>
      (view.rowExpansion?.fields ?? [])
        .map((fieldKey) => fieldsByKey.get(fieldKey))
        .filter((field): field is DataViewField => Boolean(field)),
    [fieldsByKey, view.rowExpansion?.fields]
  );

  const resolvedInitialState = React.useMemo<ContractTableInitialState>(() => {
    const hiddenColumns = Object.fromEntries(
      (view.initialState?.hiddenColumns ?? []).map((columnId) => [
        columnId,
        false,
      ])
    );
    const expanded = Object.fromEntries(
      (view.initialState?.expandedRowIds ?? []).map((rowId) => [rowId, true])
    );

    return {
      ...initialState,
      sorting:
        initialState?.sorting ??
        view.initialState?.sorting?.map((sort) => ({
          id: sort.field,
          desc: Boolean(sort.desc),
        })),
      pagination: {
        pageIndex: initialState?.pagination?.pageIndex ?? 0,
        pageSize:
          initialState?.pagination?.pageSize ??
          view.initialState?.pageSize ??
          25,
      },
      columnVisibility: {
        ...hiddenColumns,
        ...initialState?.columnVisibility,
      },
      columnPinning: {
        left: view.initialState?.pinnedColumns?.left ?? [],
        right: view.initialState?.pinnedColumns?.right ?? [],
      },
      expanded: {
        ...expanded,
        ...initialState?.expanded,
      },
    };
  }, [initialState, view.initialState]);

  return useContractTable<TItem>({
    ...options,
    columns: resolvedColumns,
    executionMode: executionMode ?? view.executionMode ?? 'client',
    selectionMode:
      selectionMode ??
      view.selection ??
      (view.rowSelectable ? 'multiple' : 'none'),
    renderExpandedContent: renderExpandedContent
      ? (item, rowIndex) =>
          renderExpandedContent({
            item,
            fields: expandedFields,
            rowIndex,
          })
      : expandedFields.length
        ? (item, rowIndex) =>
            expandedFields.map((field, index) => {
              const value = getAtPath(item, field.dataPath);
              const content =
                renderValue?.({
                  item,
                  field,
                  value,
                  rowIndex,
                }) ?? formatTableValue(value, field.format);
              return (
                <React.Fragment key={field.key}>
                  {field.label}: {content}
                  {index < expandedFields.length - 1 ? ' • ' : null}
                </React.Fragment>
              );
            })
        : undefined,
    getCanExpand:
      expandedFields.length > 0
        ? (_item, _rowIndex) => true
        : options.getCanExpand,
    initialState: resolvedInitialState,
  });
}

function fieldToColumn(field: DataViewField): DataViewTableColumn {
  return {
    field: field.key,
    label: field.label,
    width: field.width,
    sortable: field.sortable,
  };
}

function fallbackField(column: DataViewTableColumn): DataViewField {
  return {
    key: column.field,
    label: column.label ?? column.field,
    dataPath: column.field,
  };
}

function sizeFromWidth(width?: DataViewField['width']) {
  switch (width) {
    case 'xs':
      return 80;
    case 'sm':
      return 120;
    case 'lg':
      return 240;
    case 'md':
      return 180;
    default:
      return 160;
  }
}

export type { UseDataViewTableOptions } from './table.types';
