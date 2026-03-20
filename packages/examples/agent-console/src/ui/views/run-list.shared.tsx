'use client';

import { Button, StatusChip } from '@contractspec/lib.design-system';
import type { ContractTableController } from '@contractspec/lib.presentation-runtime-react';
import { HStack, VStack } from '@contractspec/lib.ui-kit-web/ui/stack';
import { Text } from '@contractspec/lib.ui-kit-web/ui/text';
import type { ReactNode } from 'react';
import type { Run } from '../hooks/useRunList';

export function getStatusTone(
	status: Run['status']
): 'success' | 'warning' | 'neutral' | 'danger' {
	switch (status) {
		case 'COMPLETED':
			return 'success';
		case 'RUNNING':
			return 'warning';
		case 'QUEUED':
			return 'neutral';
		case 'FAILED':
		case 'CANCELLED':
			return 'danger';
		default:
			return 'neutral';
	}
}

export function formatDuration(ms?: number): string {
	if (!ms) return '-';
	if (ms < 1000) return `${ms}ms`;
	if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
	return `${(ms / 60000).toFixed(1)}m`;
}

export function formatTokens(tokens: number): string {
	if (tokens < 1000) return tokens.toString();
	if (tokens < 1000000) return `${(tokens / 1000).toFixed(1)}K`;
	return `${(tokens / 1000000).toFixed(2)}M`;
}

export function formatCost(cost?: number): string {
	if (!cost) return '-';
	return `$${cost.toFixed(4)}`;
}

function formatJson(value: unknown) {
	return JSON.stringify(value ?? null, null, 2);
}

export function RunExpandedContent({ run }: { run: Run }) {
	return (
		<VStack gap="sm" className="py-2">
			<HStack justify="between" className="flex-wrap">
				<StatusChip tone={getStatusTone(run.status)} label={run.status} />
				<Text className="text-muted-foreground text-sm">
					Queued {run.queuedAt.toLocaleString()}
				</Text>
			</HStack>
			<HStack gap="lg" className="flex-wrap">
				<Text className="text-muted-foreground text-sm">
					Prompt {formatTokens(run.promptTokens)}
				</Text>
				<Text className="text-muted-foreground text-sm">
					Completion {formatTokens(run.completionTokens)}
				</Text>
				<Text className="text-muted-foreground text-sm">
					Duration {formatDuration(run.durationMs)}
				</Text>
			</HStack>
			<VStack gap="xs">
				<Text className="font-medium text-sm">Input</Text>
				<pre className="overflow-auto rounded-md bg-muted/40 p-3 text-xs">
					{formatJson(run.input)}
				</pre>
			</VStack>
			<VStack gap="xs">
				<Text className="font-medium text-sm">Output</Text>
				<pre className="overflow-auto rounded-md bg-muted/40 p-3 text-xs">
					{formatJson(run.output ?? run.errorMessage ?? 'Pending')}
				</pre>
			</VStack>
		</VStack>
	);
}

export function RunTableToolbar({
	controller,
	totalRuns,
}: {
	controller: ContractTableController<Run, ReactNode>;
	totalRuns: number;
}) {
	const firstRow = controller.rows[0];
	const queuedColumn = controller.columns.find(
		(column) => column.id === 'queuedAt'
	);
	const durationColumn = controller.columns.find(
		(column) => column.id === 'durationMs'
	);
	const costColumn = controller.columns.find(
		(column) => column.id === 'estimatedCostUsd'
	);

	return (
		<HStack gap="sm" className="flex-wrap">
			<Text className="text-muted-foreground text-sm">{totalRuns} runs</Text>
			<Button
				variant="outline"
				size="sm"
				onPress={() => firstRow?.toggleExpanded?.(!firstRow?.isExpanded)}
			>
				Expand Latest Run
			</Button>
			<Button
				variant="outline"
				size="sm"
				onPress={() => queuedColumn?.toggleVisibility?.(!queuedColumn?.visible)}
			>
				{queuedColumn?.visible ? 'Hide Time' : 'Show Time'}
			</Button>
			<Button
				variant="outline"
				size="sm"
				onPress={() =>
					durationColumn?.toggleVisibility?.(!durationColumn?.visible)
				}
			>
				{durationColumn?.visible ? 'Hide Duration' : 'Show Duration'}
			</Button>
			<Button
				variant="outline"
				size="sm"
				onPress={() => costColumn?.toggleVisibility?.(!costColumn?.visible)}
			>
				{costColumn?.visible ? 'Hide Cost' : 'Show Cost'}
			</Button>
		</HStack>
	);
}
