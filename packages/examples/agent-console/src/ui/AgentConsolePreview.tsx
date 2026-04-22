'use client';

import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from '@contractspec/lib.design-system';
import { createVisualizationModel } from '@contractspec/lib.presentation-runtime-core';
import { Button } from '@contractspec/lib.ui-kit-web/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@contractspec/lib.ui-kit-web/ui/card';
import { HStack, VStack } from '@contractspec/lib.ui-kit-web/ui/stack';
import { Text } from '@contractspec/lib.ui-kit-web/ui/text';
import { Visualization } from '@contractspec/lib.ui-kit-web/ui/visualization';
import { useMemo } from 'react';
import { MOCK_AGENTS } from '../shared/mock-agents';
import { MOCK_RUNS } from '../shared/mock-runs';
import { MOCK_TOOLS } from '../shared/mock-tools';
import { createAgentVisualizationItems } from '../visualizations';
import {
	AGENT_CONSOLE_PREVIEW_TABS,
	type AgentConsolePreviewAgent,
	type AgentConsolePreviewRun,
	type AgentConsolePreviewTool,
	createAgentConsolePreviewMetrics,
	getAgentConsolePressProps,
} from './AgentConsolePreview.data';
import {
	AgentConsoleAgentCards,
	AgentConsoleMetricCards,
	AgentConsoleMetricsPanel,
	AgentConsoleToolCards,
} from './AgentConsolePreviewPanels';
import { AgentConsoleRunHistoryTable } from './AgentConsolePreviewTable';

export interface AgentConsolePreviewProps {
	agents?: readonly AgentConsolePreviewAgent[];
	runs?: readonly AgentConsolePreviewRun[];
	showHeaderAction?: boolean;
	tools?: readonly AgentConsolePreviewTool[];
}

export function AgentConsolePreview({
	agents = MOCK_AGENTS,
	runs = MOCK_RUNS,
	showHeaderAction = true,
	tools = MOCK_TOOLS,
}: AgentConsolePreviewProps) {
	const metrics = useMemo(() => createAgentConsolePreviewMetrics(runs), [runs]);
	const visualizationItems = useMemo(
		() => createAgentVisualizationItems(runs),
		[runs]
	);

	return (
		<VStack gap="xl" align="stretch">
			<HStack justify="between" align="center" className="gap-3">
				<Text className="font-bold text-2xl">AI Agent Console</Text>
				{showHeaderAction ? (
					<Button {...getAgentConsolePressProps(() => undefined)}>
						<Text>+ New Agent</Text>
					</Button>
				) : null}
			</HStack>

			<AgentConsoleMetricCards metrics={metrics} />
			<VStack gap="md">
				<VStack gap="xs">
					<Text className="font-semibold text-lg">
						Operational Visualizations
					</Text>
					<Text className="text-muted-foreground text-sm">
						Contract-backed charts derived from recent run activity.
					</Text>
				</VStack>
				<VStack gap="md">
					{visualizationItems.map((item) => (
						<Card key={item.key}>
							<CardHeader>
								<CardTitle>{item.title}</CardTitle>
								<CardDescription>{item.description}</CardDescription>
							</CardHeader>
							<CardContent>
								<Visualization
									height={item.height}
									model={createVisualizationModel(item.spec, item.data)}
								/>
							</CardContent>
						</Card>
					))}
				</VStack>
			</VStack>

			<Tabs defaultValue="runs" className="w-full gap-4">
				<TabsList className="h-auto w-full flex-wrap">
					{AGENT_CONSOLE_PREVIEW_TABS.map((tab) => (
						<TabsTrigger
							key={tab.id}
							value={tab.id}
							className="min-h-8 min-w-24 flex-1"
						>
							<Text>
								{tab.icon} {tab.label}
							</Text>
						</TabsTrigger>
					))}
				</TabsList>

				<TabsContent value="runs">
					<AgentConsoleRunHistoryTable runs={runs} />
				</TabsContent>
				<TabsContent value="agents">
					<AgentConsoleAgentCards agents={agents} />
				</TabsContent>
				<TabsContent value="tools">
					<AgentConsoleToolCards tools={tools} />
				</TabsContent>
				<TabsContent value="metrics">
					<AgentConsoleMetricsPanel metrics={metrics} />
				</TabsContent>
			</Tabs>
		</VStack>
	);
}
