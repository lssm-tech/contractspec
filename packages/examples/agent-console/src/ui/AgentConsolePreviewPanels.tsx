'use client';

import { Badge } from '@contractspec/lib.ui-kit-web/ui/badge';
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from '@contractspec/lib.ui-kit-web/ui/card';
import { HStack, VStack } from '@contractspec/lib.ui-kit-web/ui/stack';
import { Text } from '@contractspec/lib.ui-kit-web/ui/text';
import type {
	AgentConsolePreviewAgent,
	AgentConsolePreviewTool,
	createAgentConsolePreviewMetrics,
} from './AgentConsolePreview.data';
import { formatAgentConsoleTokens } from './AgentConsolePreview.data';

type PreviewMetrics = ReturnType<typeof createAgentConsolePreviewMetrics>;

export function AgentConsoleMetricCards({
	metrics,
}: {
	metrics: PreviewMetrics;
}) {
	const stats = [
		{
			label: 'Total Runs',
			value: String(metrics.totalRuns),
			hint: `${Math.round(metrics.successRate * 100)}% success`,
		},
		{
			label: 'Success Rate',
			value: `${Math.round(metrics.successRate * 100)}%`,
			hint: 'of all runs',
		},
		{
			label: 'Total Tokens',
			value: formatAgentConsoleTokens(metrics.totalTokens),
			hint: 'This period',
		},
		{
			label: 'Total Cost',
			value: `$${metrics.totalCostUsd.toFixed(2)}`,
			hint: 'This period',
		},
	];

	return (
		<HStack gap="md" className="flex-wrap">
			{stats.map((stat) => (
				<Card key={stat.label} className="min-w-52 flex-1">
					<CardContent className="flex flex-col gap-1 pt-6">
						<Text className="text-muted-foreground text-sm">{stat.label}</Text>
						<Text className="font-bold text-2xl">{stat.value}</Text>
						<Text className="text-muted-foreground text-sm">{stat.hint}</Text>
					</CardContent>
				</Card>
			))}
		</HStack>
	);
}

export function AgentConsoleAgentCards({
	agents,
}: {
	agents: readonly AgentConsolePreviewAgent[];
}) {
	return (
		<VStack gap="md">
			{agents.map((agent) => (
				<Card key={agent.id}>
					<CardContent className="flex flex-col gap-2 pt-6">
						<HStack justify="between" align="start">
							<VStack gap="xs" className="flex-1">
								<Text className="font-semibold text-lg">{agent.name}</Text>
								<Text className="text-muted-foreground text-sm">
									{agent.modelProvider} / {agent.modelName}
								</Text>
							</VStack>
							<AgentConsoleStatusBadge status={agent.status} />
						</HStack>
						<Text className="text-muted-foreground text-sm">
							{agent.description}
						</Text>
					</CardContent>
				</Card>
			))}
		</VStack>
	);
}

export function AgentConsoleToolCards({
	tools,
}: {
	tools: readonly AgentConsolePreviewTool[];
}) {
	return (
		<VStack gap="md">
			{tools.map((tool) => (
				<Card key={tool.id}>
					<CardContent className="flex flex-col gap-2 pt-6">
						<HStack justify="between" align="start">
							<VStack gap="xs" className="flex-1">
								<Text className="font-semibold text-lg">{tool.name}</Text>
								<Text className="text-muted-foreground text-sm">
									{tool.category} / {tool.implementationType}
								</Text>
							</VStack>
							<AgentConsoleStatusBadge status={tool.status} />
						</HStack>
						<Text className="text-muted-foreground text-sm">
							{tool.description}
						</Text>
					</CardContent>
				</Card>
			))}
		</VStack>
	);
}

export function AgentConsoleMetricsPanel({
	metrics,
}: {
	metrics: PreviewMetrics;
}) {
	return (
		<VStack gap="md">
			<Text className="font-semibold text-lg">Usage Analytics</Text>
			<Card>
				<CardHeader>
					<CardTitle>Run Outcomes</CardTitle>
				</CardHeader>
				<CardContent className="flex flex-col gap-3">
					<Text>Completed: {metrics.completedRuns}</Text>
					<Text>Failed: {metrics.totalRuns - metrics.completedRuns}</Text>
					<Text>
						Average duration: {(metrics.averageDurationMs / 1000).toFixed(1)}s
					</Text>
				</CardContent>
			</Card>
		</VStack>
	);
}

export function AgentConsoleStatusBadge({ status }: { status: string }) {
	const variant =
		status === 'FAILED' || status === 'CANCELLED'
			? 'destructive'
			: status === 'ACTIVE' || status === 'COMPLETED'
				? 'secondary'
				: 'outline';

	return (
		<Badge variant={variant}>
			<Text className="font-semibold text-xs">{status}</Text>
		</Badge>
	);
}
