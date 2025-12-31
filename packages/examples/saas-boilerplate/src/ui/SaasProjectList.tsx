'use client';

/**
 * SaaS Project List - Standalone project list component
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
} from '@contractspec/lib.design-system';
import { useProjectList, type Project } from './hooks/useProjectList';

interface SaasProjectListProps {
  onProjectClick?: (projectId: string) => void;
  onCreateProject?: () => void;
}

function getStatusTone(
  status: Project['status']
): 'success' | 'warning' | 'neutral' | 'danger' {
  switch (status) {
    case 'ACTIVE':
      return 'success';
    case 'DRAFT':
      return 'neutral';
    case 'ARCHIVED':
      return 'danger';
    default:
      return 'neutral';
  }
}

export function SaasProjectList({
  onProjectClick,
  onCreateProject,
}: SaasProjectListProps) {
  const { data, loading, error, stats, refetch } = useProjectList();

  if (loading && !data) {
    return <LoaderBlock label="Loading projects..." />;
  }

  if (error) {
    return (
      <ErrorState
        title="Failed to load projects"
        description={error.message}
        onRetry={refetch}
        retryLabel="Retry"
      />
    );
  }

  if (!data?.items.length) {
    return (
      <EmptyState
        title="No projects found"
        description="Create your first project to get started."
        primaryAction={
          onCreateProject ? (
            <Button onPress={onCreateProject}>Create Project</Button>
          ) : undefined
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      {stats && (
        <StatCardGroup>
          <StatCard label="Total Projects" value={stats.total.toString()} />
          <StatCard label="Active" value={stats.activeCount.toString()} />
          <StatCard label="Draft" value={stats.draftCount.toString()} />
        </StatCardGroup>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {data.items.map((project: Project) => (
          <EntityCard
            key={project.id}
            cardTitle={project.name}
            cardSubtitle={project.tier}
            meta={
              <p className="text-muted-foreground text-sm">
                {project.description}
              </p>
            }
            chips={
              <StatusChip
                tone={getStatusTone(project.status)}
                label={project.status}
              />
            }
            footer={
              <span className="text-muted-foreground text-xs">
                {project.updatedAt.toLocaleDateString()}
              </span>
            }
            onClick={
              onProjectClick ? () => onProjectClick(project.id) : undefined
            }
          />
        ))}
      </div>
    </div>
  );
}
