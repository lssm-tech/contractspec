'use client';

import {
	type ContractTableColumnDef,
	useContractTable,
} from '@contractspec/lib.presentation-runtime-react';
import { Card, CardContent } from '@contractspec/lib.ui-kit-web/ui/card';
import { DataTable } from '@contractspec/lib.ui-kit-web/ui/data-table';
import { VStack } from '@contractspec/lib.ui-kit-web/ui/stack';
import { Text } from '@contractspec/lib.ui-kit-web/ui/text';
import { useMemo } from 'react';
import {
	type AgentConsolePreviewRun,
	formatAgentConsoleDate,
	formatAgentConsoleDuration,
	formatAgentConsoleTokens,
} from './AgentConsolePreview.data';
import { AgentConsoleStatusBadge } from './AgentConsolePreviewPanels';

export function AgentConsoleRunHistoryTable({
	runs,
}: {
	runs: readonly AgentConsolePreviewRun[];
}) {
	const columns = useMemo<ContractTableColumnDef<AgentConsolePreviewRun>[]>(
		() => [
			{
				id: 'queuedAt',
				header: 'Run',
				label: 'Run',
				accessor: (run) => run.queuedAt.getTime(),
				cell: ({ item }) => (
					<VStack gap="xs">
						<Text className="font-mono text-sm">{item.id}</Text>
						<Text className="text-muted-foreground text-xs">
							{formatAgentConsoleDate(item.queuedAt)}
						</Text>
					</VStack>
				),
				size: 180,
				canSort: true,
				canHide: true,
			},
			{
				id: 'agentName',
				header: 'Agent',
				label: 'Agent',
				accessorKey: 'agentName',
				size: 220,
				canSort: true,
			},
			{
				id: 'status',
				header: 'Status',
				label: 'Status',
				accessorKey: 'status',
				cell: ({ value }) => <AgentConsoleStatusBadge status={String(value)} />,
				size: 140,
				canSort: true,
			},
			{
				id: 'totalTokens',
				header: 'Tokens',
				label: 'Tokens',
				accessorKey: 'totalTokens',
				cell: ({ value }) => formatAgentConsoleTokens(Number(value ?? 0)),
				align: 'right',
				size: 120,
				canSort: true,
			},
			{
				id: 'durationMs',
				header: 'Duration',
				label: 'Duration',
				accessorKey: 'durationMs',
				cell: ({ value }) =>
					formatAgentConsoleDuration(
						typeof value === 'number' ? value : undefined
					),
				align: 'right',
				size: 130,
				canHide: true,
			},
		],
		[]
	);
	const controller = useContractTable({
		data: runs,
		columns,
		initialState: { pagination: { pageIndex: 0, pageSize: 5 } },
		getRowId: (run) => run.id,
	});

	return (
		<DataTable
			controller={controller}
			toolbar={
				<Text className="text-muted-foreground text-sm">Run History</Text>
			}
			emptyState={
				<Card>
					<CardContent className="pt-6">
						<Text className="text-muted-foreground">No runs yet</Text>
					</CardContent>
				</Card>
			}
		/>
	);
}
