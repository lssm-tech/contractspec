'use client';

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
import { useState, useMemo, useCallback } from 'react';
import { StatCard, StatCardGroup, Button } from '@lssm/lib.design-system';
import { AgentListView } from './views/AgentListView';
import { RunListView } from './views/RunListView';
import { ToolRegistryView } from './views/ToolRegistryView';
import { useRunList, type RunMetrics } from './hooks/useRunList';
import { useAgentList, type Agent } from './hooks/useAgentList';
import { useAgentMutations } from './hooks/useAgentMutations';
import { CreateAgentModal } from './modals/CreateAgentModal';
import { AgentActionsModal } from './modals/AgentActionsModal';

type Tab = 'runs' | 'agents' | 'tools' | 'metrics';

export function AgentDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('runs');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [isAgentActionsOpen, setIsAgentActionsOpen] = useState(false);

  const { metrics, refetch: refetchRuns } = useRunList();
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

  const tabs: Array<{ id: Tab; label: string; icon: string }> = [
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
        <h2 className="text-2xl font-bold">AI Agent Console</h2>
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

      {/* Navigation Tabs */}
      <nav className="bg-muted flex gap-1 rounded-lg p-1" role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
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
      <div className="text-muted-foreground flex h-64 items-center justify-center">
        Loading agents...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-destructive flex h-64 flex-col items-center justify-center">
        <p>Failed to load agents: {error.message}</p>
        <Button variant="outline" onPress={refetch} className="mt-2">
          Retry
        </Button>
      </div>
    );
  }

  if (!data?.items.length) {
    return (
      <div className="text-muted-foreground flex h-64 flex-col items-center justify-center">
        <p className="text-lg font-medium">No agents yet</p>
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
          <AgentCard key={agent.id} agent={agent} onClick={() => onAgentClick(agent)} />
        ))}
      </div>
    </div>
  );
}

/**
 * Agent Card Component
 */
function AgentCard({
  agent,
  onClick,
}: {
  agent: Agent;
  onClick: () => void;
}) {
  const statusColors: Record<string, string> = {
    ACTIVE: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    DRAFT: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    PAUSED: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    ARCHIVED: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400',
  };

  return (
    <div
      onClick={onClick}
      className="border-border bg-card cursor-pointer rounded-xl border p-4 transition-all hover:shadow-md"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold truncate">{agent.name}</h3>
          <p className="text-muted-foreground text-sm">
            {agent.modelProvider} / {agent.modelName}
          </p>
        </div>
        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[agent.status]}`}>
          {agent.status}
        </span>
      </div>
      {agent.description && (
        <p className="text-muted-foreground mt-2 text-sm line-clamp-2">
          {agent.description}
        </p>
      )}
      <div className="mt-3 flex items-center justify-between">
        <span className="text-muted-foreground text-xs">v{agent.version}</span>
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
      <div className="text-muted-foreground flex h-64 items-center justify-center">
        Loading metrics...
      </div>
    );
  }

  // Calculate derived metrics
  const completedRuns = Math.round(metrics.totalRuns * metrics.successRate);
  const failedRuns = metrics.totalRuns - completedRuns;

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Usage Analytics</h3>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Success/Failure breakdown */}
        <div className="border-border bg-card rounded-xl border p-4">
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
        <div className="border-border bg-card rounded-xl border p-4">
          <h4 className="font-medium">Performance</h4>
          <dl className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <dt className="text-muted-foreground text-sm">Avg Duration</dt>
              <dd className="text-xl font-semibold">
                {(metrics.averageDurationMs / 1000).toFixed(1)}s
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground text-sm">Success Rate</dt>
              <dd className="text-xl font-semibold">
                {(metrics.successRate * 100).toFixed(0)}%
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="border-border bg-card rounded-xl border p-4">
        <h4 className="font-medium">Key Metrics</h4>
        <dl className="mt-4 grid gap-4 sm:grid-cols-3">
          <div>
            <dt className="text-muted-foreground text-sm">Total Runs</dt>
            <dd className="text-2xl font-semibold">
              {metrics.totalRuns.toLocaleString()}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground text-sm">Total Tokens</dt>
            <dd className="text-2xl font-semibold">
              {(metrics.totalTokens / 1000).toFixed(0)}K
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground text-sm">Cost per Run</dt>
            <dd className="text-2xl font-semibold">
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
      <div className="bg-muted mt-1 h-2 overflow-hidden rounded-full">
        <div className={`h-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
