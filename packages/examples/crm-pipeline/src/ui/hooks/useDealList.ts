'use client';

import type { ContractTableSort } from '@contractspec/lib.presentation-runtime-core';
import { useTemplateRuntime } from '@contractspec/lib.example-shared-ui';
/**
 * Hook for fetching and managing deal list data
 *
 * Uses runtime-local database-backed handlers.
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
	type CrmHandlers,
	type Deal as RuntimeDeal,
	type ListDealsOutput as RuntimeListDealsOutput,
	type Stage,
} from '../../handlers/crm.handlers';

// Re-export types for convenience
export type Deal = RuntimeDeal;
export type ListDealsOutput = RuntimeListDealsOutput;

export interface UseDealListOptions {
	pipelineId?: string;
	stageId?: string;
	status?: 'OPEN' | 'WON' | 'LOST' | 'all';
	search?: string;
	limit?: number;
	pageIndex?: number;
	pageSize?: number;
	sorting?: ContractTableSort[];
}

export function useDealList(options: UseDealListOptions = {}) {
	const { handlers, projectId } = useTemplateRuntime<{ crm: CrmHandlers }>();
	const { crm } = handlers;

	const [data, setData] = useState<ListDealsOutput | null>(null);
	const [dealsByStage, setDealsByStage] = useState<Record<string, Deal[]>>({});
	const [stages, setStages] = useState<Stage[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);
	const [internalPage, setInternalPage] = useState(0);

	const pipelineId = options.pipelineId ?? 'pipeline-1';
	const pageIndex = options.pageIndex ?? internalPage;
	const pageSize = options.pageSize ?? options.limit ?? 50;
	const [sort] = options.sorting ?? [];
	const sortBy = sort?.id;
	const sortDirection = sort ? (sort.desc ? 'desc' : 'asc') : undefined;

	const fetchData = useCallback(async () => {
		setLoading(true);
		setError(null);

		try {
			const [dealsResult, stageDealsResult, stagesResult] = await Promise.all([
				crm.listDeals({
					projectId,
					pipelineId,
					stageId: options.stageId,
					status: options.status === 'all' ? undefined : options.status,
					search: options.search,
					limit: pageSize,
					offset: pageIndex * pageSize,
					sortBy:
						sortBy === 'name' ||
						sortBy === 'value' ||
						sortBy === 'status' ||
						sortBy === 'expectedCloseDate' ||
						sortBy === 'updatedAt'
							? sortBy
							: undefined,
					sortDirection,
				}),
				crm.getDealsByStage({ projectId, pipelineId }),
				crm.getPipelineStages({ pipelineId }),
			]);
			setData(dealsResult);
			setDealsByStage(stageDealsResult);
			setStages(stagesResult);
		} catch (err) {
			setError(err instanceof Error ? err : new Error('Unknown error'));
		} finally {
			setLoading(false);
		}
	}, [
		crm,
		projectId,
		pipelineId,
		options.stageId,
		options.status,
		options.search,
		pageIndex,
		pageSize,
		sortBy,
		sortDirection,
	]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	// Calculate stats
	const stats = useMemo(() => {
		if (!data) return null;
		const open = data.deals.filter((d: Deal) => d.status === 'OPEN');
		const won = data.deals.filter((d: Deal) => d.status === 'WON');
		const lost = data.deals.filter((d: Deal) => d.status === 'LOST');

		return {
			total: data.total,
			totalValue: data.totalValue,
			openCount: open.length,
			openValue: open.reduce((sum: number, d: Deal) => sum + d.value, 0),
			wonCount: won.length,
			wonValue: won.reduce((sum: number, d: Deal) => sum + d.value, 0),
			lostCount: lost.length,
		};
	}, [data]);

	return {
		data,
		dealsByStage,
		stages,
		loading,
		error,
		stats,
		page: pageIndex + 1,
		pageIndex,
		pageSize,
		refetch: fetchData,
		nextPage:
			options.pageIndex === undefined
				? () => setInternalPage((page) => page + 1)
				: undefined,
		prevPage:
			options.pageIndex === undefined
				? () => pageIndex > 0 && setInternalPage((page) => page - 1)
				: undefined,
	};
}
