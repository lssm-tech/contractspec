'use client';

/**
 * SaaS Project List - Standalone project list component
 */
import { StatCard, StatCardGroup, StatusChip, EntityCard, EmptyState, LoaderBlock, ErrorState } from '@lssm/lib.design-system';
import { useProjectList } from './hooks/useProjectList';

interface SaasProjectListProps {
  onProjectClick?: (projectId: string) => void;
}

const statusVariantMap: Record<string, 'success' | 'warning' | 'neutral' | 'danger'> = {
  ACTIVE: 'success',
  DRAFT: 'neutral',
  ARCHIVED: 'danger',
};

export function SaasProjectList({ onProjectClick }: SaasProjectListProps) {
  const { data, loading, error, stats, refetch } = useProjectList();

  if (loading && !data) {
    return <LoaderBlock label="Loading projects..." />;
  }

  if (error) {
    return (
      <ErrorState
        title="Failed to load projects"
        description={error.message}
        action={{ label: 'Retry', onClick: refetch }}
      />
    );
  }

  if (!data?.projects.length) {
    return (
      <EmptyState
        title="No projects found"
        description="Create your first project to get started."
        action={{ label: 'Create Project', onClick: () => {} }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {stats && (
        <StatCardGroup>
          <StatCard label="Total Projects" value={stats.total} />
          <StatCard label="Active" value={stats.activeCount} variant="success" />
          <StatCard label="Draft" value={stats.draftCount} variant="neutral" />
        </StatCardGroup>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {data.projects.map((project) => (
          <EntityCard
            key={project.id}
            title={project.name}
            subtitle={project.slug ?? project.id}
            description={project.description}
            onClick={() => onProjectClick?.(project.id)}
            footer={
              <div className="flex items-center justify-between">
                <StatusChip
                  status={project.status.toLowerCase() as 'active' | 'warning' | 'neutral'}
                  variant={statusVariantMap[project.status] ?? 'neutral'}
                >
                  {project.status}
                </StatusChip>
                <div className="flex gap-1">
                  {project.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            }
          />
        ))}
      </div>
    </div>
  );
}
