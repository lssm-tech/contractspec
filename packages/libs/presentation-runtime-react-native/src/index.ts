import * as React from 'react';
import type { DefaultValues, Resolver, UseFormReturn } from 'react-hook-form';
import { useForm } from '@lssm/lib.ui-kit/ui/form';
import type {
  ListFetcher,
  ListState,
} from '@lssm/lib.presentation-runtime-core';

export interface UsePresentationControllerOpts<
  TFilters extends Record<string, unknown>,
  TVars,
  TItem,
> {
  defaults: ListState<TFilters>;
  form: {
    defaultValues: DefaultValues<TFilters>;
    resolver?: Resolver<TFilters>;
  };
  toVariables: (input: ListState<TFilters>) => TVars;
  fetcher: ListFetcher<TVars, TItem>;
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
  toChips,
  useUrlState,
  replace,
}: UsePresentationControllerOpts<TFilters, TVars, TItem>) {
  const url = useUrlState({ defaults, replace });
  const form = useForm<TFilters>({
    defaultValues: formOpts.defaultValues,
    resolver: formOpts.resolver as any,
  } as any);

  React.useEffect(() => {
    form.reset({ ...(form.getValues() as any), ...(url.state.filters as any) });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url.state.filters]);

  const submitFilters = form.handleSubmit((values) => {
    url.setState({ filters: values as TFilters, page: 1 });
  });

  const setSearch = React.useCallback(
    (q: string) => url.setState({ q, page: 1 }),
    [url]
  );
  const variables = React.useMemo(
    () => toVariables(url.state),
    [url.state, toVariables]
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
            (url.state.filters as TFilters) || ({} as any),
            url.setFilter as any
          )
        : [],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [url.state.filters, toChips]
  );

  const clearAll = React.useCallback(() => {
    form.reset(formOpts.defaultValues as TFilters);
    url.setState({ filters: {} as TFilters, page: 1 });
  }, [form, formOpts.defaultValues, url]);

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
  toChips,
  useUrlState,
  replace,
}: UseListCoordinatorOpts<TFilters, TVars>) {
  const url = useUrlState({ defaults, replace });
  const form = useForm<TFilters>({
    defaultValues: formOpts.defaultValues,
    resolver: formOpts.resolver as any,
  } as any);

  React.useEffect(() => {
    form.reset({ ...(form.getValues() as any), ...(url.state.filters as any) });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url.state.filters]);

  const submitFilters = form.handleSubmit((values) => {
    url.setState({ filters: values as TFilters, page: 1 });
  });

  const setSearch = React.useCallback(
    (q: string) => url.setState({ q, page: 1 }),
    [url]
  );
  const variables = React.useMemo(
    () => toVariables(url.state),
    [url.state, toVariables]
  );

  const chips = React.useMemo(
    () =>
      toChips
        ? toChips(
            (url.state.filters as TFilters) || ({} as any),
            url.setFilter as any
          )
        : [],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [url.state.filters, toChips]
  );

  const clearAll = React.useCallback(() => {
    form.reset(formOpts.defaultValues as TFilters);
    url.setState({ filters: {} as TFilters, page: 1 });
  }, [form, formOpts.defaultValues, url]);

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
