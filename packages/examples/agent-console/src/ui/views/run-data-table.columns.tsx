'use client';

import { StatusChip } from '@contractspec/lib.design-system';
import type { ContractTableColumnDef } from '@contractspec/lib.presentation-runtime-react';
import { VStack } from '@contractspec/lib.ui-kit-web/ui/stack';
import { Text } from '@contractspec/lib.ui-kit-web/ui/text';
import type { Run } from '../hooks/useRunList';
import {
	formatCost,
	formatDuration,
	formatTokens,
	getStatusTone,
} from './run-list.shared';

export function createRunTableColumns(): readonly ContractTableColumnDef<Run>[] {
	return [
		{
			id: 'queuedAt',
			header: 'Run',
			label: 'Run',
			accessor: (run: Run) => run.queuedAt.getTime(),
			cell: ({ item }) => (
				<VStack gap="xs">
					<Text className="font-mono text-sm">{item.id.slice(-8)}</Text>
					<Text className="text-muted-foreground text-xs">
						{item.queuedAt.toLocaleString()}
					</Text>
				</VStack>
			),
			size: 220,
			minSize: 180,
			canSort: true,
			canHide: true,
			canResize: true,
		},
		{
			id: 'agentName',
			header: 'Agent',
			label: 'Agent',
			accessor: (run: Run) => run.agentName ?? 'Unknown Agent',
			cell: ({ value }) => (
				<Text className="font-medium">
					{typeof value === 'string' ? value : 'Unknown Agent'}
				</Text>
			),
			size: 220,
			canSort: true,
			canResize: true,
		},
		{
			id: 'status',
			header: 'Status',
			label: 'Status',
			accessorKey: 'status',
			cell: ({ value }) => {
				const status =
					typeof value === 'string' ? (value as Run['status']) : 'QUEUED';
				return <StatusChip tone={getStatusTone(status)} label={status} />;
			},
			size: 150,
			canSort: true,
			canResize: true,
		},
		{
			id: 'totalTokens',
			header: 'Tokens',
			label: 'Tokens',
			accessorKey: 'totalTokens',
			cell: ({ value }) => formatTokens(Number(value ?? 0)),
			align: 'right' as const,
			size: 140,
			canSort: true,
			canResize: true,
		},
		{
			id: 'durationMs',
			header: 'Duration',
			label: 'Duration',
			accessorKey: 'durationMs',
			cell: ({ value }) =>
				formatDuration(typeof value === 'number' ? value : undefined),
			align: 'right' as const,
			size: 140,
			canSort: true,
			canHide: true,
			canResize: true,
		},
		{
			id: 'estimatedCostUsd',
			header: 'Cost',
			label: 'Cost',
			accessorKey: 'estimatedCostUsd',
			cell: ({ value }) =>
				formatCost(typeof value === 'number' ? value : undefined),
			align: 'right' as const,
			size: 140,
			canSort: true,
			canHide: true,
			canResize: true,
		},
	];
}
