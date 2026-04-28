'use client';

import type {
	DataViewCollectionMode,
	DataViewDensity,
	DataViewFilter,
	DataViewFilterSet,
	DataViewFilterValue,
	DataViewSpec,
} from '@contractspec/lib.contracts-spec/data-views';
import { resolveDataViewFilters } from '@contractspec/lib.contracts-spec/data-views';
import { Pagination as TablePagination } from '@contractspec/lib.ui-kit-web/ui/atoms/Pagination';
import { VStack } from '@contractspec/lib.ui-kit-web/ui/stack';
import { Text } from '@contractspec/lib.ui-kit-web/ui/text';
import { Grid3X3, List, Table2 } from 'lucide-react';
import * as React from 'react';
import {
	resolveTranslationString,
	useDesignSystemTranslation,
} from '../../i18n/translation';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';
import { FiltersToolbar } from '../molecules/FiltersToolbar';
import {
	getDataViewCollectionConfig,
	getDataViewCollectionViewModesConfig,
	isDataViewCollectionKind,
	resolveAllowedCollectionModes,
	resolveCollectionDensity,
	resolveCollectionView,
} from './collection';
import { DataViewDetail } from './DataViewDetail';
import { DataViewGrid } from './DataViewGrid';
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
	viewMode?: DataViewCollectionMode;
	defaultViewMode?: DataViewCollectionMode;
	onViewModeChange?: (mode: DataViewCollectionMode) => void;
	density?: DataViewDensity;
	defaultDensity?: DataViewDensity;
	onDensityChange?: (density: DataViewDensity) => void;

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
	viewMode,
	defaultViewMode,
	onViewModeChange,
	density,
	defaultDensity,
	onDensityChange,
	search,
	onSearchChange,
	filters,
	onFilterChange,
	pagination,
	onPageChange,
}: DataViewRendererProps) {
	const translate = useDesignSystemTranslation();
	const allowedModes = React.useMemo(
		() => resolveAllowedCollectionModes(spec.view),
		[spec.view]
	);
	const [internalViewMode, setInternalViewMode] = React.useState<
		DataViewCollectionMode | undefined
	>(defaultViewMode);
	const requestedViewMode = viewMode ?? internalViewMode ?? defaultViewMode;
	const resolvedCollection = React.useMemo(
		() => resolveCollectionView(spec, requestedViewMode),
		[requestedViewMode, spec]
	);
	const [internalDensity, setInternalDensity] = React.useState<
		DataViewDensity | undefined
	>(defaultDensity);
	const effectiveDensity = resolveCollectionDensity(spec, {
		density: density ?? internalDensity,
		defaultDensity,
	});
	const collectionConfig = getDataViewCollectionConfig(spec.view);
	const viewModesConfig = getDataViewCollectionViewModesConfig(spec.view);
	const collectionToolbar = collectionConfig?.toolbar;
	const toolbarEnabled = collectionToolbar?.enabled !== false;
	const filterControlsEnabled = collectionToolbar?.filters !== false;
	const actionPlacement = collectionToolbar?.actions ?? 'end';
	const toolbarActionsStart =
		actionPlacement === 'start' || actionPlacement === 'both'
			? headerActions
			: undefined;
	const toolbarActionsEnd =
		actionPlacement === 'end' || actionPlacement === 'both'
			? headerActions
			: undefined;
	const searchConfig =
		typeof collectionToolbar?.search === 'object'
			? collectionToolbar.search
			: undefined;
	const searchEnabled = Boolean(
		toolbarEnabled && collectionToolbar?.search !== false && onSearchChange
	);
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
		const renderSpec = isDataViewCollectionKind(spec.view.kind)
			? resolvedCollection.spec
			: spec;
		switch (renderSpec.view.kind) {
			case 'list':
				return (
					<DataViewList
						spec={renderSpec}
						items={items}
						className={className}
						renderActions={renderActions}
						onSelect={onSelect}
						emptyState={emptyState}
						density={effectiveDensity}
					/>
				);
			case 'table':
				return (
					<DataViewTable
						spec={renderSpec}
						items={items}
						className={className}
						onRowClick={onRowClick}
						toolbar={toolbar}
						loading={loading}
						emptyState={emptyState}
						headerActions={toolbarEnabled ? undefined : headerActions}
						footer={footer}
						density={effectiveDensity}
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
				return (
					<DataViewGrid
						spec={renderSpec}
						items={items}
						className={className}
						renderActions={renderActions}
						onSelect={onSelect}
						emptyState={emptyState}
						density={effectiveDensity}
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
		resolvedCollection.spec,
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
		effectiveDensity,
		toolbarEnabled,
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
			{toolbarEnabled &&
			((filterControlsEnabled && spec.view.filters?.length) ||
				searchEnabled ||
				activeChips.length ||
				allowedModes.length > 1 ||
				collectionToolbar?.density ||
				toolbarActionsStart ||
				toolbarActionsEnd) ? (
				<FiltersToolbar
					searchValue={search}
					onSearchChange={searchEnabled ? onSearchChange : undefined}
					searchPlaceholder={
						searchConfig?.placeholder ??
						resolveTranslationString('Search...', translate) ??
						'Search...'
					}
					debounceMs={searchConfig?.debounceMs}
					activeChips={activeChips}
					onClearAll={
						hasClearableFilters ? () => onFilterChange?.({}) : undefined
					}
					right={toolbarActionsEnd}
				>
					{toolbarActionsStart}
					{allowedModes.length > 1 && collectionToolbar?.viewMode !== false ? (
						<DataViewModeSwitcher
							mode={resolvedCollection.mode}
							allowedModes={allowedModes}
							labels={
								isDataViewCollectionKind(spec.view.kind)
									? viewModesConfig?.labels
									: undefined
							}
							onChange={(nextMode) => {
								if (nextMode === resolvedCollection.mode) return;
								if (viewMode === undefined) setInternalViewMode(nextMode);
								onViewModeChange?.(nextMode);
							}}
						/>
					) : null}
					{collectionToolbar?.density ? (
						<DataViewDensitySwitcher
							density={effectiveDensity}
							onChange={(nextDensity) => {
								if (nextDensity === effectiveDensity) return;
								if (density === undefined) setInternalDensity(nextDensity);
								onDensityChange?.(nextDensity);
							}}
						/>
					) : null}
					{filterControlsEnabled ? (
						<DataViewFilterControls
							filters={spec.view.filters}
							values={resolvedFilters.user}
							lockedKeys={Object.keys(resolvedFilters.locked)}
							onFilterChange={onFilterChange}
						/>
					) : null}
				</FiltersToolbar>
			) : null}

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

function DataViewModeSwitcher({
	mode,
	allowedModes,
	labels,
	onChange,
}: {
	mode: DataViewCollectionMode;
	allowedModes: DataViewCollectionMode[];
	labels?: Partial<Record<DataViewCollectionMode, string>>;
	onChange: (mode: DataViewCollectionMode) => void;
}) {
	return (
		<div className="flex items-center gap-1 rounded-md border bg-background p-1">
			{allowedModes.map((item) => {
				const Icon = modeIcon(item);
				return (
					<Button
						key={item}
						size="sm"
						variant={item === mode ? 'default' : 'ghost'}
						onPress={() => onChange(item)}
						ariaLabelI18n={labels?.[item] ?? item}
					>
						<Icon className="h-4 w-4" />
					</Button>
				);
			})}
		</div>
	);
}

function DataViewDensitySwitcher({
	density,
	onChange,
}: {
	density: DataViewDensity;
	onChange: (density: DataViewDensity) => void;
}) {
	return (
		<div className="flex items-center gap-1 rounded-md border bg-background p-1">
			<Button
				size="sm"
				variant={density === 'comfortable' ? 'default' : 'ghost'}
				onPress={() => onChange('comfortable')}
			>
				Comfort
			</Button>
			<Button
				size="sm"
				variant={density === 'compact' ? 'default' : 'ghost'}
				onPress={() => onChange('compact')}
			>
				Compact
			</Button>
		</div>
	);
}

function modeIcon(mode: DataViewCollectionMode) {
	if (mode === 'grid') return Grid3X3;
	if (mode === 'table') return Table2;
	return List;
}
