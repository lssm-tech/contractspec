'use client';

/**
 * Agent List View
 *
 * Displays a list of AI agents with their status and basic info.
 * Uses design-system components with correct props.
 */
import { Button, StatCard, StatCardGroup, EntityCard, StatusChip, LoaderBlock, ErrorState, EmptyState } from '@lssm/lib.design-system';
import { useAgentList, type Agent } from '../hooks/useAgentList';

function getStatusTone(status: Agent['status']): 'success' | 'warning' | 'neutral' {
  switch (status) {
    case 'ACTIVE':
      return 'success';
    case 'PAUSED':
    case 'DRAFT':
      return 'warning';
    case 'ARCHIVED':
      return 'neutral';
    default:
      return 'neutral';
  }
}

export function AgentListView() {
  const { data, loading, error, stats, refetch } = useAgentList();

  if (loading && !data) {
    return <LoaderBlock label="Loading agents..." />;
  }

  if (error) {
    return (
      <ErrorState
        title="Failed to load agents"
        description={error.message}
        onRetry={refetch}
        retryLabel="Retry"
      />
    );
  }

  if (!data?.items.length) {
    return (
      <EmptyState
        title="No agents yet"
        description="Create your first AI agent to get started."
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      {stats && (
        <StatCardGroup>
          <StatCard label="Total Agents" value={stats.total} />
          <StatCard label="Active" value={stats.active} />
          <StatCard label="Paused" value={stats.paused} />
          <StatCard label="Draft" value={stats.draft} />
        </StatCardGroup>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Agents</h3>
        <Button onPress={() => alert('Create Agent clicked!')}>
          Create Agent
        </Button>
      </div>

      {/* Agent List */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data.items.map((agent) => (
          <EntityCard
            key={agent.id}
            cardTitle={agent.name}
            cardSubtitle={agent.modelName}
            meta={
              <p className="text-muted-foreground text-sm">{agent.description}</p>
            }
            chips={
              <StatusChip
                tone={getStatusTone(agent.status)}
                label={agent.status}
              />
            }
            footer={
              <span className="text-muted-foreground text-xs">
                Created {agent.createdAt.toLocaleDateString()}
              </span>
            }
            onClick={() => alert(`View agent: ${agent.name}`)}
          />
        ))}
      </div>
    </div>
  );
}
