/* eslint-disable @typescript-eslint/no-explicit-any */

import type {
	ListFetcher,
	ListFilterScope,
	ListState,
} from '@contractspec/lib.presentation-runtime-core';
import {
	createScopedListState,
	sanitizeListUserFilters,
} from '@contractspec/lib.presentation-runtime-core';
import * as React from 'react';
import {
	type DefaultValues,
	type Resolver,
	type UseFormReturn,
	useForm,
} from 'react-hook-form';

export interface UsePresentationControllerOpts<
	TFilters extends Record<string, unknown>,
	TVars,
	TItem,
> {
	defaults: ListState<TFilters>;
	form: {
		defaultValues: DefaultValues<TFilters> | TFilters;
		resolver?: Resolver<TFilters>;
	};
	toVariables: (input: ListState<TFilters>) => TVars;
	fetcher: ListFetcher<TVars, TItem>;
	filterScope?: ListFilterScope<TFilters>;
	toChips?: (
		filters: TFilters,
		setFilter: (
			key: keyof TFilters,
			value: TFilters[keyof TFilters] | null
		) => void
	) => { key: string; label: React.ReactNode; onRemove?: () => void }[];
	useUrlState: (args: { defaults: ListState<TFilters>; replace?: boolean }) => {
		state: ListState<TFilters>;
		setState: (next: Partial<ListState<TFilters>>) => void;
		setFilter: (
			key: keyof TFilters,
			value: TFilters[keyof TFilters] | null
		) => void;
		clearFilters: () => void;
	};
	replace?: boolean;
}

export function usePresentationController<
	TFilters extends Record<string, unknown>,
	TVars,
	TItem,
>({
	defaults,
	form: formOpts,
	toVariables,
	fetcher,
	filterScope,
	toChips,
	useUrlState,
	replace,
}: UsePresentationControllerOpts<TFilters, TVars, TItem>) {
	const stableFilterScope = useStableFilterScope(filterScope);
	const url = useUrlState({ defaults, replace });
	const form = useForm<TFilters>({
		defaultValues: formOpts.defaultValues,

		resolver: formOpts.resolver as any,
	} as any);

	React.useEffect(() => {
		form.reset({
			...(form.getValues() as any),
			...(sanitizeListUserFilters(url.state.filters, stableFilterScope) as any),
		});
	}, [url.state.filters, stableFilterScope]);

	const submitFilters = form.handleSubmit((values: TFilters) => {
		url.setState({
			filters: sanitizeListUserFilters(values as TFilters, stableFilterScope),
			page: 1,
		});
	});

	const setSearch = React.useCallback(
		(q: string) => url.setState({ q, page: 1 }),
		[url]
	);
	const variables = React.useMemo(
		() => toVariables(createScopedListState(url.state, stableFilterScope)),
		[url.state, stableFilterScope, toVariables]
	);

	const [data, setData] = React.useState<TItem[]>([]);
	const [loading, setLoading] = React.useState(false);
	const [error, setError] = React.useState<unknown>(null);
	const [totalItems, setTotalItems] = React.useState<number | undefined>(
		undefined
	);
	const [totalPages, setTotalPages] = React.useState<number | undefined>(
		undefined
	);

	const refetch = React.useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const out = await fetcher(variables);
			setData(out.items);
			setTotalItems(out.totalItems);
			setTotalPages(out.totalPages);
		} catch (e) {
			setError(e);
		} finally {
			setLoading(false);
		}
	}, [variables, fetcher]);

	React.useEffect(() => {
		void refetch();
	}, [refetch]);

	const chips = React.useMemo(
		() =>
			toChips
				? toChips(
						sanitizeListUserFilters(
							(url.state.filters as TFilters) || ({} as any),
							stableFilterScope
						),

						url.setFilter as any
					)
				: [],
		[url.state.filters, stableFilterScope, toChips]
	);

	const clearAll = React.useCallback(() => {
		form.reset(formOpts.defaultValues as any);
		url.setState({ filters: {} as TFilters, page: 1 });
	}, [stableFilterScope, form, formOpts.defaultValues, url]);

	return {
		form: form as UseFormReturn<TFilters>,
		url,
		variables,
		data,
		loading,
		error,
		totalItems,
		totalPages,
		refetch,
		chips,
		setSearch,
		submitFilters,
		clearAll,
	} as const;
}

export interface UseListCoordinatorOpts<
	TFilters extends Record<string, unknown>,
	TVars,
> {
	defaults: ListState<TFilters>;
	form: {
		defaultValues: DefaultValues<TFilters>;
		resolver?: Resolver<TFilters>;
	};
	toVariables: (input: ListState<TFilters>) => TVars;
	filterScope?: ListFilterScope<TFilters>;
	toChips?: (
		filters: TFilters,
		setFilter: (
			key: keyof TFilters,
			value: TFilters[keyof TFilters] | null
		) => void
	) => { key: string; label: React.ReactNode; onRemove?: () => void }[];
	useUrlState: (args: { defaults: ListState<TFilters>; replace?: boolean }) => {
		state: ListState<TFilters>;
		setState: (next: Partial<ListState<TFilters>>) => void;
		setFilter: (
			key: keyof TFilters,
			value: TFilters[keyof TFilters] | null
		) => void;
		clearFilters: () => void;
	};
	replace?: boolean;
}

export function useListCoordinator<
	TFilters extends Record<string, unknown>,
	TVars,
>({
	defaults,
	form: formOpts,
	toVariables,
	filterScope,
	toChips,
	useUrlState,
	replace,
}: UseListCoordinatorOpts<TFilters, TVars>) {
	const stableFilterScope = useStableFilterScope(filterScope);
	const url = useUrlState({ defaults, replace });
	const form = useForm<TFilters>({
		defaultValues: formOpts.defaultValues,
		resolver: formOpts.resolver,
	} as any);

	React.useEffect(() => {
		form.reset({
			...(form.getValues() as any),
			...(sanitizeListUserFilters(url.state.filters, stableFilterScope) as any),
		});
	}, [url.state.filters, stableFilterScope]);

	const submitFilters = form.handleSubmit((values: TFilters) => {
		url.setState({
			filters: sanitizeListUserFilters(values as TFilters, stableFilterScope),
			page: 1,
		});
	});

	const setSearch = React.useCallback(
		(q: string) => url.setState({ q, page: 1 }),
		[url]
	);
	const variables = React.useMemo(
		() => toVariables(createScopedListState(url.state, stableFilterScope)),
		[url.state, stableFilterScope, toVariables]
	);

	const chips = React.useMemo(
		() =>
			toChips
				? toChips(
						sanitizeListUserFilters(
							(url.state.filters as TFilters) || ({} as any),
							stableFilterScope
						),

						url.setFilter as any
					)
				: [],
		[url.state.filters, stableFilterScope, toChips]
	);

	const clearAll = React.useCallback(() => {
		form.reset(formOpts.defaultValues as any);
		url.setState({ filters: {} as TFilters, page: 1 });
	}, [stableFilterScope, form, formOpts.defaultValues, url]);

	return {
		form: form as UseFormReturn<TFilters>,
		url,
		variables,
		chips,
		setSearch,
		submitFilters,
		clearAll,
	} as const;
}

export * from './presentation-runtime-react.feature';
export type {
	ContractTableColumnDef,
	ContractTableColumnRenderModel,
	ContractTableController,
	ContractTableOverflowBehavior,
	ContractTableRowRenderModel,
	UseContractTableOptions,
	UseDataViewTableOptions,
} from './table.types';
export { useContractTable } from './useContractTable';
export { useDataViewTable } from './useDataViewTable';
export type { UseVisualizationModelOptions } from './useVisualizationModel';
export { useVisualizationModel } from './useVisualizationModel';
export type { UseWorkflowOptions, UseWorkflowResult } from './useWorkflow';
export { useWorkflow } from './useWorkflow';
export { WorkflowStepper } from './WorkflowStepper';
export { WorkflowStepRenderer } from './WorkflowStepRenderer';

function useStableFilterScope<TFilters extends Record<string, unknown>>(
	filterScope: ListFilterScope<TFilters> | undefined
) {
	const filterScopeKey = React.useMemo(
		() => JSON.stringify(filterScope ?? {}),
		[filterScope]
	);
	return React.useMemo(() => filterScope, [filterScopeKey]);
}
