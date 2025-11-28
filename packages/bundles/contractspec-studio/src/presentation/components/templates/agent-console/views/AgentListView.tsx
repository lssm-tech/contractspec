'use client';

/**
 * Agent List View - Uses design-system components and hooks
 */
import { StatCard, StatCardGroup, StatusChip, EntityCard, EmptyState, LoaderBlock, ErrorState } from '@lssm/lib.design-system';
import { useAgentList } from '../hooks/useAgentList';

interface AgentListViewProps {
  onAgentClick?: (agentId: string) => void;
}

const statusVariantMap: Record<string, 'success' | 'warning' | 'neutral' | 'danger'> = {
  ACTIVE: 'success',
  PAUSED: 'warning',
  DRAFT: 'neutral',
  ARCHIVED: 'danger',
};

const modelProviderIcons: Record<string, string> = {
  OPENAI: '🤖',
  ANTHROPIC: '🧠',
  GOOGLE: '🔍',
  MISTRAL: '💨',
  CUSTOM: '⚙️',
};

export function AgentListView({ onAgentClick }: AgentListViewProps) {
  const { data, loading, error, stats, refetch } = useAgentList();

  if (loading && !data) {
    return <LoaderBlock label="Loading agents..." />;
  }

  if (error) {
    return (
      <ErrorState
        title="Failed to load agents"
        description={error.message}
        action={{ label: 'Retry', onClick: refetch }}
      />
    );
  }

  if (!data?.items.length) {
    return (
      <EmptyState
        title="No agents found"
        description="Create your first AI agent to get started."
        action={{ label: 'Create Agent', onClick: () => {} }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Row */}
      {stats && (
        <StatCardGroup>
          <StatCard label="Total Agents" value={stats.total} />
          <StatCard label="Active" value={stats.activeCount} variant="success" />
          <StatCard label="Paused" value={stats.pausedCount} variant="warning" />
          <StatCard label="Draft" value={stats.draftCount} variant="neutral" />
        </StatCardGroup>
      )}

      {/* Agent Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {data.items.map((agent) => (
          <EntityCard
            key={agent.id}
            title={agent.name}
            subtitle={`${modelProviderIcons[agent.modelProvider] ?? ''} ${agent.modelName} · v${agent.version}`}
            description={agent.description}
            onClick={() => onAgentClick?.(agent.id)}
            footer={
              <div className="flex items-center justify-between">
                <StatusChip
                  status={agent.status.toLowerCase() as 'active' | 'warning' | 'neutral'}
                  variant={statusVariantMap[agent.status] ?? 'neutral'}
                >
                  {agent.status}
                </StatusChip>
                <span className="text-xs text-muted-foreground">
                  {agent.createdAt.toLocaleDateString()}
                </span>
              </div>
            }
          />
        ))}
      </div>

      {/* Pagination indicator */}
      <div className="text-center text-sm text-muted-foreground">
        Showing {data.items.length} of {data.total} agents
        {data.hasMore && ' • Scroll for more'}
      </div>
    </div>
  );
}

