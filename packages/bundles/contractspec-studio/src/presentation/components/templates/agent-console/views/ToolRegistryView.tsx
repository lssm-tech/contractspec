'use client';

/**
 * Tool Registry View - Shows available tools organized by category
 */
import {
  StatCard,
  StatCardGroup,
  StatusChip,
  EntityCard,
  EmptyState,
  LoaderBlock,
  ErrorState,
  Button,
} from '@lssm/lib.design-system';
import { useToolList, type Tool } from '../hooks/useToolList';

interface ToolRegistryViewProps {
  onToolClick?: (toolId: string) => void;
  onCreateTool?: () => void;
}

const categoryIcons: Record<string, string> = {
  RETRIEVAL: '🔍',
  COMPUTATION: '🧮',
  COMMUNICATION: '📧',
  INTEGRATION: '🔗',
  UTILITY: '🛠️',
  CUSTOM: '⚙️',
};

function getStatusTone(
  status: Tool['status']
): 'success' | 'warning' | 'neutral' | 'danger' {
  switch (status) {
    case 'ACTIVE':
      return 'success';
    case 'DRAFT':
      return 'neutral';
    case 'DEPRECATED':
      return 'warning';
    case 'DISABLED':
      return 'danger';
    default:
      return 'neutral';
  }
}

export function ToolRegistryView({
  onToolClick,
  onCreateTool,
}: ToolRegistryViewProps) {
  const { data, loading, error, groupedByCategory, categoryStats, refetch } =
    useToolList();

  if (loading && !data) {
    return <LoaderBlock label="Loading tools..." />;
  }

  if (error) {
    return (
      <ErrorState
        title="Failed to load tools"
        description={error.message}
        onRetry={refetch}
        retryLabel="Retry"
      />
    );
  }

  if (!data?.items.length) {
    return (
      <EmptyState
        title="No tools registered"
        description="Create your first tool to extend agent capabilities."
        primaryAction={
          onCreateTool ? (
            <Button onPress={onCreateTool}>Create Tool</Button>
          ) : undefined
        }
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* Category Stats */}
      <StatCardGroup>
        <StatCard label="Total Tools" value={data.total} />
        {categoryStats.slice(0, 3).map(({ category, count }) => (
          <StatCard
            key={category}
            label={`${categoryIcons[category] ?? ''} ${category}`}
            value={count}
          />
        ))}
      </StatCardGroup>

      {/* Tools by Category */}
      {Object.entries(groupedByCategory).map(([category, tools]) => (
        <section key={category} className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{categoryIcons[category]}</span>
            <h3 className="text-lg font-semibold">{category}</h3>
            <span className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-xs">
              {(tools as Tool[]).length}
            </span>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {(tools as Tool[]).map((tool) => (
              <EntityCard
                key={tool.id}
                cardTitle={tool.name}
                cardSubtitle={`v${tool.version}`}
                meta={
                  <p className="text-muted-foreground text-sm">
                    {tool.description}
                  </p>
                }
                chips={
                  <StatusChip
                    tone={getStatusTone(tool.status)}
                    label={tool.status}
                  />
                }
                footer={
                  <code className="text-muted-foreground text-xs">
                    {tool.slug}
                  </code>
                }
                onClick={onToolClick ? () => onToolClick(tool.id) : undefined}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
