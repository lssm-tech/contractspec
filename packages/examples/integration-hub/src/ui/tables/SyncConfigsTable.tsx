'use client';

import { DataTable } from '@contractspec/lib.design-system';
import { useContractTable } from '@contractspec/lib.presentation-runtime-react';
import { VStack } from '@contractspec/lib.ui-kit-web/ui/stack';
import { Text } from '@contractspec/lib.ui-kit-web/ui/text';
import type { SyncConfig } from '../../handlers/integration.handlers';
import {
	formatDateTime,
	IntegrationTableToolbar,
	StatusBadge,
} from './integration-table.shared';

export function SyncConfigsTable({ syncConfigs }: { syncConfigs: SyncConfig[] }) {
	const controller = useContractTable<SyncConfig>({
		data: syncConfigs,
		columns: [
			{
				id: 'sync',
				header: 'Sync Config',
				label: 'Sync Config',
				accessor: (sync) => sync.name,
				cell: ({ item }) => (
					<VStack gap="xs">
						<Text className="font-medium text-sm">{item.name}</Text>
						<Text className="text-muted-foreground text-xs">
							{item.sourceEntity} → {item.targetEntity}
						</Text>
					</VStack>
				),
				size: 260,
				minSize: 200,
				canSort: true,
				canPin: true,
				canResize: true,
			},
			{
				id: 'frequency',
				header: 'Frequency',
				label: 'Frequency',
				accessorKey: 'frequency',
				size: 160,
				canSort: true,
				canHide: true,
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
				id: 'recordsSynced',
				header: 'Records',
				label: 'Records',
				accessorKey: 'recordsSynced',
				align: 'right',
				size: 140,
				canSort: true,
				canResize: true,
			},
			{
				id: 'lastRunAt',
				header: 'Last Run',
				label: 'Last Run',
				accessor: (sync) => sync.lastRunAt?.getTime() ?? 0,
				cell: ({ item }) => formatDateTime(item.lastRunAt),
				size: 200,
				canSort: true,
				canHide: true,
				canResize: true,
			},
		],
		initialState: {
			pagination: { pageIndex: 0, pageSize: 3 },
			columnVisibility: { lastRunAt: false },
			columnPinning: { left: ['sync'], right: [] },
		},
		renderExpandedContent: (sync) => (
			<VStack gap="sm" className="py-2">
				<Text className="text-muted-foreground text-sm">
					Connection {sync.connectionId}
				</Text>
				<Text className="text-muted-foreground text-sm">
					Last run: {formatDateTime(sync.lastRunAt)}
				</Text>
				<Text className="text-muted-foreground text-sm">
					Last status: {sync.lastRunStatus ?? 'No runs recorded'}
				</Text>
				<Text className="text-muted-foreground text-sm">
					Updated {sync.updatedAt.toLocaleString()}
				</Text>
			</VStack>
		),
		getCanExpand: () => true,
	});

	return (
		<DataTable
			controller={controller}
			title="Sync Configs"
			description="Shared table primitives applied to sync monitoring without changing the surrounding dashboard layout."
			toolbar={
				<IntegrationTableToolbar
					controller={controller}
					label={`${syncConfigs.length} syncs`}
					toggleColumnId="lastRunAt"
					toggleVisibleLabel="Hide Last Run"
					toggleHiddenLabel="Show Last Run"
					pinColumnId="status"
					pinLabel="Status"
					resizeColumnId="sync"
					resizeLabel="Widen Sync"
				/>
			}
			emptyState={
				<div className="rounded-md border border-dashed p-8 text-center text-muted-foreground text-sm">
					No sync configurations found
				</div>
			}
		/>
	);
}
