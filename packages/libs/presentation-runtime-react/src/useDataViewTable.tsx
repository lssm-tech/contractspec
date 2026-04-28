import type {
	DataViewField,
	DataViewFieldFormat,
	DataViewTableColumn,
	DataViewTableConfig,
	DataViewTableOverflowBehavior,
} from '@contractspec/lib.contracts-spec/data-views';
import type { ContractTableInitialState } from '@contractspec/lib.presentation-runtime-core';
import * as React from 'react';
import type {
	ContractTableColumnDef,
	UseDataViewTableOptions,
} from './table.types';
import { formatTableValue, getAtPath } from './table.utils';
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
			const overflow = resolveColumnOverflow(column, field, view);
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
				overflow,
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

	const overflowExpandedFields = React.useMemo(
		() =>
			(view.columns ?? view.fields.map(fieldToColumn))
				.map((column) => {
					const field = fieldsByKey.get(column.field) ?? fallbackField(column);
					const overflow = resolveColumnOverflow(column, field, view);
					return overflow === 'expand' ? field : undefined;
				})
				.filter((field): field is DataViewField => Boolean(field)),
		[fieldsByKey, view]
	);

	const expandedFields = React.useMemo(() => {
		const fields = (view.rowExpansion?.fields ?? [])
			.map((fieldKey) => fieldsByKey.get(fieldKey))
			.filter((field): field is DataViewField => Boolean(field));
		const seenKeys = new Set(fields.map((field) => field.key));
		overflowExpandedFields.forEach((field) => {
			if (seenKeys.has(field.key)) return;
			seenKeys.add(field.key);
			fields.push(field);
		});
		return fields;
	}, [fieldsByKey, overflowExpandedFields, view.rowExpansion?.fields]);

	const resolvedInitialState = React.useMemo<ContractTableInitialState>(() => {
		const hiddenColumns = Object.fromEntries(
			[
				...(view.columnVisibility ? hiddenOverflowColumns(view) : []),
				...(view.initialState?.hiddenColumns ?? []),
			].map((columnId) => [columnId, false])
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
				left:
					initialState?.columnPinning?.left ??
					view.initialState?.pinnedColumns?.left ??
					[],
				right:
					initialState?.columnPinning?.right ??
					view.initialState?.pinnedColumns?.right ??
					[],
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

function resolveColumnOverflow(
	column: DataViewTableColumn,
	field: DataViewField,
	view: DataViewTableConfig
) {
	const overflow =
		column.overflow ?? field.overflow ?? inferOverflowBehavior(field.format);
	if (overflow === 'hideColumn') {
		return view.columnVisibility ? 'truncate' : 'truncate';
	}
	return overflow;
}

function hiddenOverflowColumns(view: DataViewTableConfig) {
	const fieldsByKey = new Map(view.fields.map((field) => [field.key, field]));
	return (view.columns ?? view.fields.map(fieldToColumn))
		.filter((column) => {
			const field = fieldsByKey.get(column.field) ?? fallbackField(column);
			return (column.overflow ?? field.overflow) === 'hideColumn';
		})
		.map((column) => column.field);
}

function inferOverflowBehavior(
	format?: DataViewFieldFormat
): Exclude<DataViewTableOverflowBehavior, 'hideColumn'> {
	const type = typeof format === 'string' ? format : format?.type;
	switch (type) {
		case 'markdown':
			return 'wrap';
		case 'number':
		case 'currency':
		case 'percent':
		case 'percentage':
		case 'date':
		case 'time':
		case 'datetime':
		case 'dateTime':
		case 'duration':
		case 'boolean':
		case 'badge':
		case 'text':
		default:
			return 'truncate';
	}
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
