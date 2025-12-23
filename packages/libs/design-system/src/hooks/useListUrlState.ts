import * as React from 'react';

export interface ListUrlState<
  TFilters extends Record<string, unknown> = Record<string, unknown>,
> {
  q: string;
  page: number;
  limit: number;
  sort?: string | null;
  filters: TFilters;
}

export function useListUrlState<
  TFilters extends Record<string, unknown> = Record<string, unknown>,
>({
  defaults,
  paramKeys = {
    q: 'q',
    page: 'page',
    limit: 'limit',
    sort: 'sort',
    filters: 'f',
  },
  replaceState = true,
}: {
  defaults: ListUrlState<TFilters>;
  paramKeys?: {
    q: string;
    page: string;
    limit: string;
    sort: string;
    filters: string;
  };
  replaceState?: boolean;
}) {
  const read = React.useCallback((): ListUrlState<TFilters> => {
    if (typeof window === 'undefined') return defaults;
    const url = new URL(window.location.href);
    const qs = url.searchParams;
    const parseNum = (v: string | null, d: number) => {
      const n = v ? Number(v) : NaN;
      return Number.isFinite(n) && n > 0 ? n : d;
    };
    const filtersRaw = qs.get(paramKeys.filters);
    let filters: TFilters = defaults.filters;
    if (filtersRaw) {
      try {
        filters = JSON.parse(filtersRaw) as TFilters;
      } catch {
        filters = defaults.filters;
      }
    }
    return {
      q: qs.get(paramKeys.q) ?? defaults.q,
      page: parseNum(qs.get(paramKeys.page), defaults.page),
      limit: parseNum(qs.get(paramKeys.limit), defaults.limit),
      sort: qs.get(paramKeys.sort),
      filters,
    };
  }, [defaults, paramKeys]);

  const [state, setState] = React.useState<ListUrlState<TFilters>>(read);

  const write = React.useCallback(
    (next: Partial<ListUrlState<TFilters>>) => {
      if (typeof window === 'undefined') return;
      const url = new URL(window.location.href);
      const qs = url.searchParams;
      const merged: ListUrlState<TFilters> = {
        ...state,
        ...next,
      } as ListUrlState<TFilters>;

      const setOrDel = (key: string, value: string | null | undefined) => {
        if (value == null || value === '' || value === 'null') qs.delete(key);
        else qs.set(key, value);
      };

      setOrDel(paramKeys.q, merged.q || null);
      setOrDel(paramKeys.page, String(merged.page));
      setOrDel(paramKeys.limit, String(merged.limit));
      setOrDel(paramKeys.sort, merged.sort ?? null);
      try {
        const json = JSON.stringify(merged.filters ?? {});
        setOrDel(paramKeys.filters, json === '{}' ? null : json);
      } catch {
        // ignore
      }

      const newUrl = `${url.pathname}?${qs.toString()}${url.hash}`;
      if (replaceState) window.history.replaceState({}, '', newUrl);
      else window.history.pushState({}, '', newUrl);
      setState(merged);
    },
    [state, paramKeys, replaceState]
  );

  const setFilter = React.useCallback(
    (
      key: keyof TFilters,
      value: TFilters[keyof TFilters] | undefined | null
    ) => {
      write({
        filters: { ...state.filters, [key]: value } as TFilters,
      });
    },
    [state.filters, write]
  );

  const clearFilters = React.useCallback(() => {
    write({ filters: {} as TFilters, page: 1 });
  }, [write]);

  React.useEffect(() => {
    const onPop = () => setState(read());
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [read]);

  return { state, setState: write, setFilter, clearFilters } as const;
}
