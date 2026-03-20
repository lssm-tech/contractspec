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
    <div className="border-border rounded-lg border">
      <table className="w-full">
        <thead className="border-border bg-muted/30 border-b">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-medium">Query</th>
            <th className="px-4 py-3 text-left text-sm font-medium">Type</th>
            <th className="px-4 py-3 text-left text-sm font-medium">Cache TTL</th>
            <th className="px-4 py-3 text-left text-sm font-medium">Shared</th>
          </tr>
        </thead>
        <tbody className="divide-border divide-y">
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
                  className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${QUERY_TYPE_COLORS[query.type] ?? ''}`}
                >
                  {query.type}
                </span>
              </td>
              <td className="text-muted-foreground px-4 py-3 text-sm">
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
                className="text-muted-foreground px-4 py-8 text-center"
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
