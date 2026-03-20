'use client';

import { DataTable } from '@contractspec/lib.design-system';
import { useContractTable } from '@contractspec/lib.presentation-runtime-react';
import { Badge } from '@contractspec/lib.ui-kit-web/ui/badge';
import { HStack, VStack } from '@contractspec/lib.ui-kit-web/ui/stack';
import { Text } from '@contractspec/lib.ui-kit-web/ui/text';
import type { Query } from '../handlers/analytics.handlers';

const QUERY_TYPE_COLORS: Record<string, string> = {
	SQL: 'default',
	METRIC: 'secondary',
	AGGREGATION: 'secondary',
	CUSTOM: 'outline',
};

function formatJson(value: Record<string, unknown>) {
	return JSON.stringify(value, null, 2);
}

export function AnalyticsQueriesTable({ queries }: { queries: Query[] }) {
	const controller = useContractTable<Query>({
		data: queries,
		columns: [
			{
				id: 'query',
				header: 'Query',
				label: 'Query',
				accessor: (query) => query.name,
				cell: ({ item }) => (
					<VStack gap="xs">
						<Text className="font-medium text-sm">{item.name}</Text>
						<Text className="text-muted-foreground text-xs">
							Updated {item.updatedAt.toLocaleDateString()}
						</Text>
					</VStack>
				),
				size: 240,
				minSize: 180,
				canSort: true,
				canPin: true,
				canResize: true,
			},
			{
				id: 'description',
				header: 'Description',
				label: 'Description',
				accessor: (query) => query.description ?? '',
				cell: ({ value }) => (
					<Text className="line-clamp-2 text-muted-foreground text-sm">
						{String(value || 'No description')}
					</Text>
				),
				size: 300,
				minSize: 220,
				canSort: false,
				canHide: true,
				canResize: true,
			},
			{
				id: 'type',
				header: 'Type',
				label: 'Type',
				accessorKey: 'type',
				cell: ({ value }) => (
					<Badge
						variant={
							QUERY_TYPE_COLORS[String(value)] as
								| 'default'
								| 'secondary'
								| 'outline'
						}
					>
						{String(value)}
					</Badge>
				),
				size: 150,
				canSort: true,
				canHide: true,
				canResize: true,
			},
			{
				id: 'cacheTtlSeconds',
				header: 'Cache TTL',
				label: 'Cache TTL',
				accessorKey: 'cacheTtlSeconds',
				cell: ({ value }) => `${String(value)}s`,
				align: 'right',
				size: 140,
				canSort: true,
				canResize: true,
			},
			{
				id: 'isShared',
				header: 'Shared',
				label: 'Shared',
				accessorKey: 'isShared',
				cell: ({ value }) => (
					<Badge variant={value ? 'default' : 'outline'}>
						{value ? 'Shared' : 'Private'}
					</Badge>
				),
				size: 140,
				canSort: true,
				canHide: true,
				canResize: true,
			},
		],
		initialState: {
			pagination: { pageIndex: 0, pageSize: 3 },
			columnVisibility: { description: false },
			columnPinning: { left: ['query'], right: [] },
		},
		renderExpandedContent: (query) => (
			<VStack gap="sm" className="py-2">
				<VStack gap="xs">
					<Text className="font-medium text-sm">Description</Text>
					<Text className="text-muted-foreground text-sm">
						{query.description ?? 'No description'}
					</Text>
				</VStack>
				{query.sql ? (
					<VStack gap="xs">
						<Text className="font-medium text-sm">SQL</Text>
						<pre className="overflow-auto rounded-md bg-muted/40 p-3 text-xs">
							{query.sql}
						</pre>
					</VStack>
				) : null}
				<VStack gap="xs">
					<Text className="font-medium text-sm">Definition</Text>
					<pre className="overflow-auto rounded-md bg-muted/40 p-3 text-xs">
						{formatJson(query.definition)}
					</pre>
				</VStack>
			</VStack>
		),
		getCanExpand: () => true,
	});

	return (
		<DataTable
			controller={controller}
			title="Saved Queries"
			description="Client-mode table using the shared ContractSpec controller and renderer."
			toolbar={
				<HStack gap="sm" className="flex-wrap">
					<Text className="text-muted-foreground text-sm">
						{queries.length} queries
					</Text>
					<Text className="text-muted-foreground text-sm">
						{queries.filter((query) => query.isShared).length} shared
					</Text>
				</HStack>
			}
			emptyState={
				<div className="rounded-md border border-dashed p-8 text-center text-muted-foreground text-sm">
					No queries saved
				</div>
			}
		/>
	);
}
