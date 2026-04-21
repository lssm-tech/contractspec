'use client';

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
import { useMemo, useState } from 'react';
import { MOCK_AGENTS } from '../shared/mock-agents';
import { MOCK_RUNS } from '../shared/mock-runs';
import { MOCK_TOOLS } from '../shared/mock-tools';
import { createAgentVisualizationItems } from '../visualizations';
import {
	AGENT_CONSOLE_PREVIEW_TABS,
	type AgentConsolePreviewAgent,
	type AgentConsolePreviewRun,
	type AgentConsolePreviewTab,
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
	const [activeTab, setActiveTab] = useState<AgentConsolePreviewTab>('runs');
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

			<HStack className="rounded-lg bg-muted p-1" gap="xs">
				{AGENT_CONSOLE_PREVIEW_TABS.map((tab) => (
					<Button
						key={tab.id}
						size="sm"
						variant={activeTab === tab.id ? 'secondary' : 'ghost'}
						className="flex-1"
						{...getAgentConsolePressProps(() => setActiveTab(tab.id))}
					>
						<Text>
							{tab.icon} {tab.label}
						</Text>
					</Button>
				))}
			</HStack>

			{activeTab === 'runs' ? (
				<AgentConsoleRunHistoryTable runs={runs} />
			) : null}
			{activeTab === 'agents' ? (
				<AgentConsoleAgentCards agents={agents} />
			) : null}
			{activeTab === 'tools' ? <AgentConsoleToolCards tools={tools} /> : null}
			{activeTab === 'metrics' ? (
				<AgentConsoleMetricsPanel metrics={metrics} />
			) : null}
		</VStack>
	);
}
