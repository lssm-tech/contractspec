/**
 * Hook for fetching and managing run list data
 *
 * Uses runtime-local database-backed handlers.
 */

import { useTemplateRuntime } from '@contractspec/lib.example-shared-ui';
import type { ContractTableSort } from '@contractspec/lib.presentation-runtime-core';
import { useCallback, useEffect, useState } from 'react';
import type {
	AgentHandlers,
	ListRunsOutput as RuntimeListRunsOutput,
	Run as RuntimeRun,
	RunMetrics as RuntimeRunMetrics,
} from '../../handlers/agent.handlers';

// Re-export types for convenience
export type Run = RuntimeRun;
export type ListRunsOutput = RuntimeListRunsOutput;
export type RunMetrics = RuntimeRunMetrics;

export interface UseRunListOptions {
	agentId?: string;
	status?: Run['status'] | 'all';
	limit?: number;
	pageIndex?: number;
	pageSize?: number;
	sorting?: ContractTableSort[];
}

export function useRunList(options: UseRunListOptions = {}) {
	const { handlers, projectId } = useTemplateRuntime<{
		agent: AgentHandlers;
	}>();
	const { agent } = handlers;

	const [data, setData] = useState<ListRunsOutput | null>(null);
	const [metrics, setMetrics] = useState<RunMetrics | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);
	const [internalPageIndex, setInternalPageIndex] = useState(0);

	const pageSize = options.pageSize ?? options.limit ?? 20;
	const pageIndex = options.pageIndex ?? internalPageIndex;
	const [sort] = options.sorting ?? [];

	const fetchData = useCallback(async () => {
		setLoading(true);
		setError(null);

		try {
			const [runsResult, metricsResult] = await Promise.all([
				agent.listRuns({
					projectId,
					agentId: options.agentId,
					status: options.status === 'all' ? undefined : options.status,
					sortBy: sort?.id as
						| 'queuedAt'
						| 'totalTokens'
						| 'durationMs'
						| 'estimatedCostUsd'
						| 'status'
						| 'agentName'
						| undefined,
					sortDirection: sort ? (sort.desc ? 'desc' : 'asc') : undefined,
					limit: pageSize,
					offset: pageIndex * pageSize,
				}),
				agent.getRunMetrics({
					projectId,
					agentId: options.agentId,
				}),
			]);
			setData(runsResult);
			setMetrics(metricsResult);
		} catch (err) {
			setError(err instanceof Error ? err : new Error('Unknown error'));
		} finally {
			setLoading(false);
		}
	}, [
		agent,
		pageIndex,
		pageSize,
		projectId,
		options.agentId,
		options.status,
		sort?.desc,
		sort?.id,
	]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	const hasControlledPagination = options.pageIndex !== undefined;

	return {
		data,
		metrics,
		loading,
		error,
		page: pageIndex + 1,
		pageIndex,
		pageSize,
		refetch: fetchData,
		nextPage: hasControlledPagination
			? undefined
			: () => setInternalPageIndex((current) => current + 1),
		prevPage: hasControlledPagination
			? undefined
			: () => setInternalPageIndex((current) => Math.max(0, current - 1)),
	};
}
