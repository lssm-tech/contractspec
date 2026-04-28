'use client';

import type {
	DataViewFilter,
	DataViewFilterSet,
	DataViewFilterValue,
	DataViewGridConfig,
	DataViewListConfig,
	DataViewSpec,
} from '@contractspec/lib.contracts-spec/data-views';
import { resolveDataViewFilters } from '@contractspec/lib.contracts-spec/data-views';
import { Pagination as TablePagination } from '@contractspec/lib.ui-kit-web/ui/atoms/Pagination';
import { VStack } from '@contractspec/lib.ui-kit-web/ui/stack';
import { Text } from '@contractspec/lib.ui-kit-web/ui/text';
import * as React from 'react';
import {
	resolveTranslationString,
	useDesignSystemTranslation,
} from '../../i18n/translation';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';
import { FiltersToolbar } from '../molecules/FiltersToolbar';
import { DataViewDetail } from './DataViewDetail';
import { DataViewList } from './DataViewList';
import { DataViewTable } from './DataViewTable';

export interface DataViewRendererProps {
	spec: DataViewSpec;
	items?: Record<string, unknown>[];
	item?: Record<string, unknown> | null;
	className?: string;
	renderActions?: (item: Record<string, unknown>) => React.ReactNode;
	onSelect?: (item: Record<string, unknown>) => void;
	onRowClick?: (item: Record<string, unknown>) => void;
	toolbar?: React.ReactNode;
	loading?: boolean;
	headerActions?: React.ReactNode;
	emptyState?: React.ReactNode;
	footer?: React.ReactNode;

	// Filters & Search
	search?: string;
	onSearchChange?: (value: string) => void;
	filters?: Record<string, unknown> | DataViewFilterSet;
	onFilterChange?: (
		filters: Record<string, unknown> | DataViewFilterSet
	) => void;

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
	toolbar,
	loading,
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
	const translate = useDesignSystemTranslation();
	const resolvedFilters = React.useMemo(
		() =>
			resolveDataViewFilters({
				filters: spec.view.filters,
				scope: spec.view.filterScope,
				user: toDataViewFilterSet(filters),
			}),
		[filters, spec.view.filterScope, spec.view.filters]
	);
	const activeChips = React.useMemo(() => {
		if (spec.view.filterScope) {
			const userChips = Object.entries(resolvedFilters.user).map(
				([key, value]) => ({
					key,
					label: `${filterLabel(spec, key)}: ${formatFilterValue(value)}`,
					onRemove: () => {
						const { [key]: _, ...rest } = resolvedFilters.user;
						onFilterChange?.(rest);
					},
				})
			);
			const lockedChips =
				resolvedFilters.lockedChips === 'hidden'
					? []
					: Object.entries(resolvedFilters.locked).map(([key, value]) => ({
							key: `locked-${key}`,
							label: `${filterLabel(spec, key)}: ${formatFilterValue(value)}`,
							disabled: true,
						}));
			return [...userChips, ...lockedChips];
		}
		return filters
			? Object.entries(filters).map(([key, value]) => ({
					key,
					label: `${key}: ${String(value)}`,
					onRemove: () => {
						const { [key]: _, ...rest } = filters;
						onFilterChange?.(rest);
					},
				}))
			: [];
	}, [filters, onFilterChange, resolvedFilters, spec]);
	const hasClearableFilters = spec.view.filterScope
		? Object.keys(resolvedFilters.user).length > 0
		: Boolean(filters && Object.keys(filters).length > 0);
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
						toolbar={toolbar}
						loading={loading}
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
					filterScope: grid.filterScope,
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
				return (
					<Text className={className}>
						{resolveTranslationString('Unsupported data view kind', translate)}
					</Text>
				);
		}
	}, [
		spec,
		items,
		item,
		className,
		renderActions,
		onSelect,
		onRowClick,
		toolbar,
		loading,
		headerActions,
		emptyState,
		footer,
		translate,
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
		<VStack gap="lg">
			{(spec.view.filters?.length || onSearchChange || activeChips.length) && (
				<FiltersToolbar
					searchValue={search}
					onSearchChange={onSearchChange}
					searchPlaceholder={
						resolveTranslationString('Search...', translate) ?? 'Search...'
					}
					activeChips={activeChips}
					onClearAll={
						hasClearableFilters ? () => onFilterChange?.({}) : undefined
					}
					right={spec.view.kind === 'table' ? undefined : headerActions}
				>
					<DataViewFilterControls
						filters={spec.view.filters}
						values={resolvedFilters.user}
						lockedKeys={Object.keys(resolvedFilters.locked)}
						onFilterChange={onFilterChange}
					/>
				</FiltersToolbar>
			)}

			{viewContent}

			{pagination && pagination.total > 0 && (
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
			)}
		</VStack>
	);
}

function toDataViewFilterSet(
	filters: DataViewRendererProps['filters']
): DataViewFilterSet | undefined {
	if (!filters) return undefined;
	return Object.fromEntries(
		Object.entries(filters ?? {}).filter(
			(entry): entry is [string, DataViewFilterValue] =>
				Boolean(
					entry[1] &&
						typeof entry[1] === 'object' &&
						'kind' in entry[1] &&
						typeof (entry[1] as { kind?: unknown }).kind === 'string'
				)
		)
	);
}

function filterLabel(spec: DataViewSpec, key: string) {
	return spec.view.filters?.find((filter) => filter.key === key)?.label ?? key;
}

function formatFilterValue(value: DataViewFilterValue | undefined) {
	if (!value) return '';
	if (value.kind === 'single') return String(value.value);
	if (value.kind === 'multi') return value.values.map(String).join(', ');
	if (value.kind === 'range') {
		return [
			value.from == null ? '' : String(value.from),
			value.to == null ? '' : String(value.to),
		]
			.filter(Boolean)
			.join(' - ');
	}
	return `${value.mode}(${value.clauses.length})`;
}

function DataViewFilterControls({
	filters,
	values,
	lockedKeys,
	onFilterChange,
}: {
	filters?: DataViewFilter[];
	values: DataViewFilterSet;
	lockedKeys: string[];
	onFilterChange?: DataViewRendererProps['onFilterChange'];
}) {
	if (!filters?.length || !onFilterChange) return null;
	const locked = new Set(lockedKeys);
	const editableFilters = filters.filter(
		(filter) => filter.type !== 'search' && !locked.has(filter.key)
	);
	if (editableFilters.length === 0) return null;
	return (
		<div className="flex flex-wrap items-center gap-2">
			{editableFilters.map((filter) => (
				<DataViewFilterControl
					key={filter.key}
					filter={filter}
					value={values[filter.key]}
					values={values}
					onFilterChange={onFilterChange}
				/>
			))}
		</div>
	);
}

function DataViewFilterControl({
	filter,
	value,
	values,
	onFilterChange,
}: {
	filter: DataViewFilter;
	value?: DataViewFilterValue;
	values: DataViewFilterSet;
	onFilterChange: NonNullable<DataViewRendererProps['onFilterChange']>;
}) {
	if (filter.type === 'boolean') {
		const current = value?.kind === 'single' ? value.value === true : undefined;
		return (
			<Button
				size="sm"
				variant="outline"
				onPress={() =>
					setFilterValue(
						values,
						filter.key,
						current === undefined ? true : !current,
						onFilterChange
					)
				}
			>
				{filter.label}: {current ? 'Oui' : 'Non'}
			</Button>
		);
	}
	if (filter.valueMode === 'range') {
		const range = value?.kind === 'range' ? value : undefined;
		return (
			<div className="flex min-w-0 items-center gap-2">
				<Input
					type={inputTypeForFilter(filter)}
					inputMode={inputModeForFilter(filter)}
					value={range?.from == null ? '' : String(range.from)}
					onChange={(event) =>
						setRangeFilterValue(
							values,
							filter,
							'from',
							event.currentTarget.value,
							onFilterChange
						)
					}
					placeholder={`${filter.label} min`}
					className="h-9 w-28"
				/>
				<Input
					type={inputTypeForFilter(filter)}
					inputMode={inputModeForFilter(filter)}
					value={range?.to == null ? '' : String(range.to)}
					onChange={(event) =>
						setRangeFilterValue(
							values,
							filter,
							'to',
							event.currentTarget.value,
							onFilterChange
						)
					}
					placeholder={`${filter.label} max`}
					className="h-9 w-28"
				/>
			</div>
		);
	}
	return (
		<Input
			type={inputTypeForFilter(filter)}
			inputMode={inputModeForFilter(filter)}
			value={value?.kind === 'single' ? String(value.value) : ''}
			onChange={(event) =>
				setFilterValue(
					values,
					filter.key,
					parseFilterInput(filter, event.currentTarget.value),
					onFilterChange
				)
			}
			placeholder={filter.label}
			className="h-9 w-36"
		/>
	);
}

function setFilterValue(
	values: DataViewFilterSet,
	key: string,
	value: string | number | boolean | undefined,
	onFilterChange: NonNullable<DataViewRendererProps['onFilterChange']>
) {
	const next = { ...values };
	if (value === undefined || value === '') {
		delete next[key];
	} else {
		next[key] = { kind: 'single', value };
	}
	onFilterChange(next);
}

function setRangeFilterValue(
	values: DataViewFilterSet,
	filter: DataViewFilter,
	bound: 'from' | 'to',
	input: string,
	onFilterChange: NonNullable<DataViewRendererProps['onFilterChange']>
) {
	const existing = values[filter.key];
	const current: { from?: string | number; to?: string | number } =
		existing?.kind === 'range' ? existing : {};
	const parsed = parseFilterInput(filter, input);
	const nextRange = { ...current, [bound]: parsed };
	if (nextRange.from == null && nextRange.to == null) {
		const next = { ...values };
		delete next[filter.key];
		onFilterChange(next);
		return;
	}
	onFilterChange({
		...values,
		[filter.key]: {
			kind: 'range',
			from: nextRange.from as string | number | undefined,
			to: nextRange.to as string | number | undefined,
		},
	});
}

function parseFilterInput(filter: DataViewFilter, value: string) {
	if (value === '') return undefined;
	switch (filter.type) {
		case 'number':
		case 'percent':
		case 'currency':
		case 'duration': {
			const parsed = Number(value);
			return Number.isFinite(parsed) ? parsed : undefined;
		}
		default:
			return value;
	}
}

function inputTypeForFilter(filter: DataViewFilter) {
	switch (filter.type) {
		case 'number':
		case 'percent':
		case 'currency':
		case 'duration':
			return 'number';
		case 'date':
			return 'date';
		case 'time':
			return 'time';
		case 'datetime':
			return 'datetime-local';
		default:
			return 'text';
	}
}

function inputModeForFilter(filter: DataViewFilter) {
	switch (filter.type) {
		case 'number':
		case 'percent':
		case 'currency':
		case 'duration':
			return 'decimal';
		default:
			return undefined;
	}
}
