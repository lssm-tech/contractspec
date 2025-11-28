'use client';

/**
 * Tool Registry View - Shows available tools organized by category
 */
import { StatCard, StatCardGroup, StatusChip, EntityCard, EmptyState, LoaderBlock, ErrorState } from '@lssm/lib.design-system';
import { useToolList } from '../hooks/useToolList';

interface ToolRegistryViewProps {
  onToolClick?: (toolId: string) => void;
}

const categoryIcons: Record<string, string> = {
  RETRIEVAL: '🔍',
  COMPUTATION: '🧮',
  COMMUNICATION: '📧',
  INTEGRATION: '🔗',
  UTILITY: '🛠️',
  CUSTOM: '⚙️',
};

const statusVariantMap: Record<string, 'success' | 'warning' | 'neutral' | 'danger'> = {
  ACTIVE: 'success',
  DRAFT: 'neutral',
  DEPRECATED: 'warning',
  DISABLED: 'danger',
};

export function ToolRegistryView({ onToolClick }: ToolRegistryViewProps) {
  const { data, loading, error, groupedByCategory, categoryStats, refetch } = useToolList();

  if (loading && !data) {
    return <LoaderBlock label="Loading tools..." />;
  }

  if (error) {
    return (
      <ErrorState
        title="Failed to load tools"
        description={error.message}
        action={{ label: 'Retry', onClick: refetch }}
      />
    );
  }

  if (!data?.items.length) {
    return (
      <EmptyState
        title="No tools registered"
        description="Create your first tool to extend agent capabilities."
        action={{ label: 'Create Tool', onClick: () => {} }}
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
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
              {tools.length}
            </span>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {tools.map((tool) => (
              <EntityCard
                key={tool.id}
                title={tool.name}
                subtitle={`v${tool.version}`}
                description={tool.description}
                onClick={() => onToolClick?.(tool.id)}
                footer={
                  <div className="flex items-center justify-between">
                    <StatusChip
                      status={tool.status.toLowerCase() as 'active' | 'warning' | 'neutral'}
                      variant={statusVariantMap[tool.status] ?? 'neutral'}
                    >
                      {tool.status}
                    </StatusChip>
                    <code className="text-xs text-muted-foreground">{tool.slug}</code>
                  </div>
                }
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

