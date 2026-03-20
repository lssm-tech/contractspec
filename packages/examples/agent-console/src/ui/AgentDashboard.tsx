'use client';

import {
	Button,
	StatCard,
	StatCardGroup,
} from '@contractspec/lib.design-system';
/**
 * Agent Console Dashboard
 *
 * Fully integrated with ContractSpec example handlers,
 * design-system components, and command mutations.
 *
 * Commands wired:
 * - CreateAgentCommand -> Create Agent button + modal
 * - UpdateAgentCommand -> Status changes via modal
 * - ExecuteAgentCommand -> Execute agent via modal
 */
import { useCallback, useMemo, useState } from 'react';
import { type Agent, useAgentList } from './hooks/useAgentList';
import { useAgentMutations } from './hooks/useAgentMutations';
import { type RunMetrics, useRunList } from './hooks/useRunList';
import { AgentActionsModal } from './modals/AgentActionsModal';
import { CreateAgentModal } from './modals/CreateAgentModal';
import { AgentVisualizationOverview } from './AgentDashboard.visualizations';
// import { AgentListView } from './views/AgentListView';
import { RunListView } from './views/RunListView';
import { ToolRegistryView } from './views/ToolRegistryView';

type Tab = 'runs' | 'agents' | 'tools' | 'metrics';

export function AgentDashboard() {
	const [activeTab, setActiveTab] = useState<Tab>('runs');
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
	const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
	const [isAgentActionsOpen, setIsAgentActionsOpen] = useState(false);

	const { data: runData, metrics, refetch: refetchRuns } = useRunList();
	const { refetch: refetchAgents } = useAgentList();

	const mutations = useAgentMutations({
		onSuccess: () => {
			refetchAgents();
			refetchRuns();
		},
	});

	const handleAgentClick = useCallback((agent: Agent) => {
		setSelectedAgent(agent);
		setIsAgentActionsOpen(true);
	}, []);

	const tabs: { id: Tab; label: string; icon: string }[] = [
		{ id: 'runs', label: 'Runs', icon: '▶' },
		{ id: 'agents', label: 'Agents', icon: '🤖' },
		{ id: 'tools', label: 'Tools', icon: '🔧' },
		{ id: 'metrics', label: 'Metrics', icon: '📊' },
	];

	// Compute summary stats from metrics
	const summaryStats = useMemo(() => {
		if (!metrics) {
			return [
				{ label: 'Total Runs', value: '-', hint: 'Loading...' },
				{ label: 'Success Rate', value: '-', hint: '' },
				{ label: 'Total Tokens', value: '-', hint: '' },
				{ label: 'Total Cost', value: '-', hint: '' },
			];
		}
		return [
			{
				label: 'Total Runs',
				value: metrics.totalRuns.toLocaleString(),
				hint: `${(metrics.successRate * 100).toFixed(0)}% success`,
			},
			{
				label: 'Success Rate',
				value: `${(metrics.successRate * 100).toFixed(0)}%`,
				hint: 'of all runs',
			},
			{
				label: 'Total Tokens',
				value:
					metrics.totalTokens >= 1000000
						? `${(metrics.totalTokens / 1000000).toFixed(1)}M`
						: `${(metrics.totalTokens / 1000).toFixed(0)}K`,
				hint: 'This period',
			},
			{
				label: 'Total Cost',
				value: `$${metrics.totalCostUsd.toFixed(2)}`,
				hint: 'This period',
			},
		];
	}, [metrics]);

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<h2 className="font-bold text-2xl">AI Agent Console</h2>
				<Button onPress={() => setIsCreateModalOpen(true)}>
					<span className="mr-2">+</span> New Agent
				</Button>
			</div>

			{/* Summary Stats Row */}
			<StatCardGroup>
				{summaryStats.map((stat, i) => (
					<StatCard
						key={i}
						label={stat.label}
						value={stat.value}
						hint={stat.hint}
					/>
				))}
			</StatCardGroup>

			<AgentVisualizationOverview runs={runData?.items ?? []} />

			{/* Navigation Tabs */}
			<nav className="flex gap-1 rounded-lg bg-muted p-1" role="tablist">
				{tabs.map((tab) => (
					<button
						key={tab.id}
						type="button"
						role="tab"
						aria-selected={activeTab === tab.id}
						onClick={() => setActiveTab(tab.id)}
						className={`flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2 font-medium text-sm transition-colors ${
							activeTab === tab.id
								? 'bg-background text-foreground shadow-sm'
								: 'text-muted-foreground hover:text-foreground'
						}`}
					>
						<span>{tab.icon}</span>
						{tab.label}
					</button>
				))}
			</nav>

			{/* Tab Content */}
			<div className="min-h-[400px]" role="tabpanel">
				{activeTab === 'runs' && <RunListView />}
				{activeTab === 'agents' && (
					<AgentListViewWithActions onAgentClick={handleAgentClick} />
				)}
				{activeTab === 'tools' && <ToolRegistryView />}
				{activeTab === 'metrics' && <MetricsView metrics={metrics} />}
			</div>

			{/* Create Agent Modal */}
			<CreateAgentModal
				isOpen={isCreateModalOpen}
				onClose={() => setIsCreateModalOpen(false)}
				onSubmit={async (input) => {
					await mutations.createAgent(input);
				}}
				isLoading={mutations.createState.loading}
			/>

			{/* Agent Actions Modal */}
			<AgentActionsModal
				isOpen={isAgentActionsOpen}
				agent={selectedAgent}
				onClose={() => {
					setIsAgentActionsOpen(false);
					setSelectedAgent(null);
				}}
				onActivate={async (agentId) => {
					await mutations.activateAgent(agentId);
				}}
				onPause={async (agentId) => {
					await mutations.pauseAgent(agentId);
				}}
				onArchive={async (agentId) => {
					await mutations.archiveAgent(agentId);
				}}
				onExecute={async (agentId, message) => {
					await mutations.executeAgent({ agentId, message });
				}}
				isLoading={mutations.isLoading}
			/>
		</div>
	);
}

/**
 * Agent List View with click handler
 */
function AgentListViewWithActions({
	onAgentClick,
}: {
	onAgentClick: (agent: Agent) => void;
}) {
	const { data, loading, error, stats, refetch } = useAgentList();

	if (loading && !data) {
		return (
			<div className="flex h-64 items-center justify-center text-muted-foreground">
				Loading agents...
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex h-64 flex-col items-center justify-center text-destructive">
				<p>Failed to load agents: {error.message}</p>
				<Button variant="outline" onPress={refetch} className="mt-2">
					Retry
				</Button>
			</div>
		);
	}

	if (!data?.items.length) {
		return (
			<div className="flex h-64 flex-col items-center justify-center text-muted-foreground">
				<p className="font-medium text-lg">No agents yet</p>
				<p className="text-sm">Create your first AI agent to get started.</p>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			{/* Stats */}
			{stats && (
				<div className="flex gap-4 text-sm">
					<span>Total: {stats.total}</span>
					<span className="text-green-600">Active: {stats.active}</span>
					<span className="text-yellow-600">Paused: {stats.paused}</span>
					<span className="text-blue-600">Draft: {stats.draft}</span>
				</div>
			)}

			{/* Agent Grid */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				{data.items.map((agent) => (
					<AgentCard
						key={agent.id}
						agent={agent}
						onClick={() => onAgentClick(agent)}
					/>
				))}
			</div>
		</div>
	);
}

/**
 * Agent Card Component
 */
function AgentCard({ agent, onClick }: { agent: Agent; onClick: () => void }) {
	const statusColors: Record<string, string> = {
		ACTIVE:
			'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
		DRAFT: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
		PAUSED:
			'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
		ARCHIVED: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400',
	};

	return (
		<div
			onClick={onClick}
			className="cursor-pointer rounded-xl border border-border bg-card p-4 transition-all hover:shadow-md"
			role="button"
			tabIndex={0}
			onKeyDown={(e) => {
				if (e.key === 'Enter' || e.key === ' ') onClick();
			}}
		>
			<div className="flex items-start justify-between">
				<div className="min-w-0 flex-1">
					<h3 className="truncate font-semibold">{agent.name}</h3>
					<p className="text-muted-foreground text-sm">
						{agent.modelProvider} / {agent.modelName}
					</p>
				</div>
				<span
					className={`rounded-full px-2 py-0.5 font-medium text-xs ${statusColors[agent.status]}`}
				>
					{agent.status}
				</span>
			</div>
			{agent.description && (
				<p className="mt-2 line-clamp-2 text-muted-foreground text-sm">
					{agent.description}
				</p>
			)}
			<div className="mt-3 flex items-center justify-between">
				<span className="text-muted-foreground text-xs">{agent.modelName}</span>
				<Button variant="ghost" size="sm" onPress={onClick}>
					Actions
				</Button>
			</div>
		</div>
	);
}

/**
 * Metrics View - Shows usage analytics
 */
function MetricsView({ metrics }: { metrics: RunMetrics | null }) {
	if (!metrics) {
		return (
			<div className="flex h-64 items-center justify-center text-muted-foreground">
				Loading metrics...
			</div>
		);
	}

	// Calculate derived metrics
	const completedRuns = Math.round(metrics.totalRuns * metrics.successRate);
	const failedRuns = metrics.totalRuns - completedRuns;

	return (
		<div className="space-y-6">
			<h3 className="font-semibold text-lg">Usage Analytics</h3>

			<div className="grid gap-6 md:grid-cols-2">
				{/* Success/Failure breakdown */}
				<div className="rounded-xl border border-border bg-card p-4">
					<h4 className="font-medium">Run Outcomes</h4>
					<div className="mt-4 space-y-3">
						<ProgressBar
							label="Completed"
							value={completedRuns}
							total={metrics.totalRuns}
							color="bg-green-500"
						/>
						<ProgressBar
							label="Failed"
							value={failedRuns}
							total={metrics.totalRuns}
							color="bg-red-500"
						/>
					</div>
				</div>

				{/* Key Stats */}
				<div className="rounded-xl border border-border bg-card p-4">
					<h4 className="font-medium">Performance</h4>
					<dl className="mt-4 grid grid-cols-2 gap-4">
						<div>
							<dt className="text-muted-foreground text-sm">Avg Duration</dt>
							<dd className="font-semibold text-xl">
								{(metrics.averageDurationMs / 1000).toFixed(1)}s
							</dd>
						</div>
						<div>
							<dt className="text-muted-foreground text-sm">Success Rate</dt>
							<dd className="font-semibold text-xl">
								{(metrics.successRate * 100).toFixed(0)}%
							</dd>
						</div>
					</dl>
				</div>
			</div>

			{/* Key Metrics */}
			<div className="rounded-xl border border-border bg-card p-4">
				<h4 className="font-medium">Key Metrics</h4>
				<dl className="mt-4 grid gap-4 sm:grid-cols-3">
					<div>
						<dt className="text-muted-foreground text-sm">Total Runs</dt>
						<dd className="font-semibold text-2xl">
							{metrics.totalRuns.toLocaleString()}
						</dd>
					</div>
					<div>
						<dt className="text-muted-foreground text-sm">Total Tokens</dt>
						<dd className="font-semibold text-2xl">
							{(metrics.totalTokens / 1000).toFixed(0)}K
						</dd>
					</div>
					<div>
						<dt className="text-muted-foreground text-sm">Cost per Run</dt>
						<dd className="font-semibold text-2xl">
							$
							{metrics.totalRuns > 0
								? (metrics.totalCostUsd / metrics.totalRuns).toFixed(4)
								: '0'}
						</dd>
					</div>
				</dl>
			</div>
		</div>
	);
}

function ProgressBar({
	label,
	value,
	total,
	color,
}: {
	label: string;
	value: number;
	total: number;
	color: string;
}) {
	const pct = total > 0 ? (value / total) * 100 : 0;
	return (
		<div>
			<div className="flex justify-between text-sm">
				<span>{label}</span>
				<span className="text-muted-foreground">
					{value} ({pct.toFixed(0)}%)
				</span>
			</div>
			<div className="mt-1 h-2 overflow-hidden rounded-full bg-muted">
				<div className={`h-full ${color}`} style={{ width: `${pct}%` }} />
			</div>
		</div>
	);
}
