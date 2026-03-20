'use client';

import type { Query } from '../handlers/analytics.handlers';

const QUERY_TYPE_COLORS: Record<string, string> = {
	SQL: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
	METRIC:
		'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
	AGGREGATION:
		'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
	CUSTOM: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
};

export function AnalyticsQueriesTable({ queries }: { queries: Query[] }) {
	return (
		<div className="rounded-lg border border-border">
			<table className="w-full">
				<thead className="border-border border-b bg-muted/30">
					<tr>
						<th className="px-4 py-3 text-left font-medium text-sm">Query</th>
						<th className="px-4 py-3 text-left font-medium text-sm">Type</th>
						<th className="px-4 py-3 text-left font-medium text-sm">
							Cache TTL
						</th>
						<th className="px-4 py-3 text-left font-medium text-sm">Shared</th>
					</tr>
				</thead>
				<tbody className="divide-y divide-border">
					{queries.map((query) => (
						<tr key={query.id} className="hover:bg-muted/50">
							<td className="px-4 py-3">
								<div className="font-medium">{query.name}</div>
								<div className="text-muted-foreground text-sm">
									{query.description}
								</div>
							</td>
							<td className="px-4 py-3">
								<span
									className={`inline-flex rounded-full px-2 py-0.5 font-medium text-xs ${QUERY_TYPE_COLORS[query.type] ?? ''}`}
								>
									{query.type}
								</span>
							</td>
							<td className="px-4 py-3 text-muted-foreground text-sm">
								{query.cacheTtlSeconds}s
							</td>
							<td className="px-4 py-3">
								{query.isShared ? (
									<span className="text-green-600 dark:text-green-400">✓</span>
								) : (
									<span className="text-muted-foreground">—</span>
								)}
							</td>
						</tr>
					))}
					{queries.length === 0 && (
						<tr>
							<td
								colSpan={4}
								className="px-4 py-8 text-center text-muted-foreground"
							>
								No queries saved
							</td>
						</tr>
					)}
				</tbody>
			</table>
		</div>
	);
}
