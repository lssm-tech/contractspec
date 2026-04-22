'use client';

import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from '@contractspec/lib.ui-kit-web/ui/card';
import { VStack } from '@contractspec/lib.ui-kit-web/ui/stack';
import { Text } from '@contractspec/lib.ui-kit-web/ui/text';
import type {
	AgentConsolePreviewAgent,
	AgentConsolePreviewTool,
	createAgentConsolePreviewMetrics,
} from './AgentConsolePreview.data';
import { formatAgentConsoleTokens } from './AgentConsolePreview.data';
import {
	AgentConsoleEntityCard,
	AgentConsoleResponsiveCards,
} from './AgentConsolePreviewCards';

export { AgentConsoleStatusBadge } from './AgentConsolePreviewCards';

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
		<AgentConsoleResponsiveCards
			items={stats}
			getKey={(stat) => stat.label}
			renderItem={(stat) => (
				<Card className="h-full w-full">
					<CardContent className="flex flex-col gap-1 pt-6">
						<Text className="text-muted-foreground text-sm">{stat.label}</Text>
						<Text className="font-bold text-2xl">{stat.value}</Text>
						<Text className="text-muted-foreground text-sm">{stat.hint}</Text>
					</CardContent>
				</Card>
			)}
		/>
	);
}

export function AgentConsoleAgentCards({
	agents,
}: {
	agents: readonly AgentConsolePreviewAgent[];
}) {
	return (
		<AgentConsoleResponsiveCards
			items={agents}
			getKey={(agent) => agent.id}
			renderItem={(agent) => (
				<AgentConsoleEntityCard
					description={agent.description}
					name={agent.name}
					status={agent.status}
					subtitle={`${agent.modelProvider} / ${agent.modelName}`}
				/>
			)}
		/>
	);
}

export function AgentConsoleToolCards({
	tools,
}: {
	tools: readonly AgentConsolePreviewTool[];
}) {
	return (
		<AgentConsoleResponsiveCards
			items={tools}
			getKey={(tool) => tool.id}
			renderItem={(tool) => (
				<AgentConsoleEntityCard
					description={tool.description}
					name={tool.name}
					status={tool.status}
					subtitle={`${tool.category} / ${tool.implementationType}`}
				/>
			)}
		/>
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
					<CardTitle>
						<Text>Run Outcomes</Text>
					</CardTitle>
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
