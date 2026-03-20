'use client';

import { DataTable } from '@contractspec/lib.design-system';
import { useContractTable } from '@contractspec/lib.presentation-runtime-react';
import { VStack } from '@contractspec/lib.ui-kit-web/ui/stack';
import { Text } from '@contractspec/lib.ui-kit-web/ui/text';
import type { Connection } from '../../handlers/integration.handlers';
import {
	formatDateTime,
	formatJson,
	IntegrationTableToolbar,
	StatusBadge,
} from './integration-table.shared';

export function ConnectionsTable({ connections }: { connections: Connection[] }) {
	const controller = useContractTable<Connection>({
		data: connections,
		columns: [
			{
				id: 'connection',
				header: 'Connection',
				label: 'Connection',
				accessor: (connection) => connection.name,
				cell: ({ item }) => (
					<VStack gap="xs">
						<Text className="font-medium text-sm">{item.name}</Text>
						<Text className="text-muted-foreground text-xs">
							Created {item.createdAt.toLocaleDateString()}
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
				id: 'status',
				header: 'Status',
				label: 'Status',
				accessorKey: 'status',
				cell: ({ value }) => <StatusBadge status={String(value)} />,
				size: 150,
				canSort: true,
				canPin: true,
				canResize: true,
			},
			{
				id: 'lastSyncAt',
				header: 'Last Sync',
				label: 'Last Sync',
				accessor: (connection) => connection.lastSyncAt?.getTime() ?? 0,
				cell: ({ item }) => formatDateTime(item.lastSyncAt),
				size: 200,
				canSort: true,
				canHide: true,
				canResize: true,
			},
			{
				id: 'errorMessage',
				header: 'Errors',
				label: 'Errors',
				accessor: (connection) => connection.errorMessage ?? '',
				cell: ({ value }) => String(value || 'No errors'),
				size: 240,
				canHide: true,
				canResize: true,
			},
		],
		initialState: {
			pagination: { pageIndex: 0, pageSize: 3 },
			columnVisibility: { errorMessage: false },
			columnPinning: { left: ['connection'], right: [] },
		},
		renderExpandedContent: (connection) => (
			<VStack gap="sm" className="py-2">
				<Text className="font-medium text-sm">Credentials</Text>
				<pre className="overflow-auto rounded-md bg-muted/40 p-3 text-xs">
					{formatJson(connection.credentials)}
				</pre>
				<Text className="font-medium text-sm">Config</Text>
				<pre className="overflow-auto rounded-md bg-muted/40 p-3 text-xs">
					{formatJson(connection.config)}
				</pre>
				<Text className="text-muted-foreground text-sm">
					{connection.errorMessage ?? 'No sync errors recorded.'}
				</Text>
			</VStack>
		),
		getCanExpand: () => true,
	});

	return (
		<DataTable
			controller={controller}
			title="Connections"
			description="Client-mode ContractSpec table with visibility, pinning, resizing, and expanded diagnostics."
			toolbar={
				<IntegrationTableToolbar
					controller={controller}
					label={`${connections.length} total connections`}
					toggleColumnId="errorMessage"
					toggleVisibleLabel="Hide Error Column"
					toggleHiddenLabel="Show Error Column"
					pinColumnId="status"
					pinLabel="Status"
					resizeColumnId="connection"
					resizeLabel="Widen Connection"
				/>
			}
			emptyState={
				<div className="rounded-md border border-dashed p-8 text-center text-muted-foreground text-sm">
					No connections found
				</div>
			}
		/>
	);
}
