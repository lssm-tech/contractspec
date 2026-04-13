import type * as React from 'react';
import type {
	SharedActionConfig,
	SharedClassNameProps,
	SharedDisableableProps,
	SharedOption,
} from './common';

export interface SharedFilterSelectProps<TValue = string | SharedOption>
	extends SharedClassNameProps,
		SharedDisableableProps {
	value: TValue;
	options: SharedOption[];
	onChange: (value: TValue | undefined) => void;
	placeholder?: string;
	label?: string;
	showCounts?: boolean;
}

export interface SharedSearchInputProps
	extends SharedClassNameProps,
		SharedDisableableProps {
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
	onClear?: () => void;
	autoFocus?: boolean;
}

export interface SharedPaginationProps
	extends SharedClassNameProps,
		SharedDisableableProps {
	currentPage: number;
	totalPages: number;
	totalItems: number;
	itemsPerPage: number;
	onPageChange: (page: number) => void;
	onItemsPerPageChange?: (itemsPerPage: number) => void;
	showItemsPerPage?: boolean;
	itemsPerPageOptions?: number[];
}

export interface SharedSearchAndFilterItem<TValue = string | SharedOption> {
	key: string;
	label: string;
	value: string;
	options: SharedOption[];
	onChange: (value: TValue | undefined) => void;
	showCounts?: boolean;
}

export interface SharedSearchAndFilterProps<TValue = string | SharedOption>
	extends SharedClassNameProps,
		SharedDisableableProps {
	searchValue: string;
	onSearchChange: (value: string) => void;
	searchPlaceholder?: string;
	filters?: SharedSearchAndFilterItem<TValue>[];
	isLoading?: boolean;
	collapsible?: boolean;
	defaultCollapsed?: boolean;
}

export interface SharedUseListStateOptions {
	initialSearch?: string;
	initialFilters?: Record<string, string>;
	initialPage?: number;
	initialItemsPerPage?: number;
	debounceMs?: number;
}

export interface SharedUseListStateReturn {
	searchQuery: string;
	setSearchQuery: (query: string) => void;
	filters: Record<string, string>;
	setFilter: (key: string, value: string) => void;
	clearFilters: () => void;
	currentPage: number;
	itemsPerPage: number;
	setCurrentPage: (page: number) => void;
	setItemsPerPage: (itemsPerPage: number) => void;
	queryParams: {
		search: string;
		page: number;
		limit: number;
	} & Record<string, string | number>;
	resetAll: () => void;
}

export interface SharedDataTableProps<_TItem = unknown>
	extends SharedClassNameProps {
	controller: unknown;
	toolbar?: React.ReactNode;
	footer?: React.ReactNode;
	emptyState?: React.ReactNode;
	loading?: boolean;
}

export interface SharedListPageFilter {
	key: string;
	label: string;
	options: SharedOption[];
	showCounts?: boolean;
}

export interface SharedListPageProps<T = unknown> extends SharedClassNameProps {
	title: string;
	description?: string;
	header?: React.ReactNode;
	items: T[];
	totalItems: number;
	totalPages: number;
	isLoading: boolean;
	isFetching?: boolean;
	error?: Error | null;
	listState: SharedUseListStateReturn;
	searchPlaceholder?: string;
	filters?: SharedListPageFilter[];
	onRefresh?: () => void;
	primaryAction?: SharedActionConfig;
	toolbar?: React.ReactNode;
	renderItem: (item: T, index: number) => React.ReactNode;
	renderEmpty?: () => React.ReactNode;
	renderStats?: (items: T[]) => React.ReactNode;
	itemClassName?: string;
}
