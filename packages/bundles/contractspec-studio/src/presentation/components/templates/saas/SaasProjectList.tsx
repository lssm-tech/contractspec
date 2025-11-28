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
} from '@lssm/lib.design-system';
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

  if (!data?.projects.length) {
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
          <StatCard label="Total Projects" value={stats.total} />
          <StatCard label="Active" value={stats.activeCount} />
          <StatCard label="Draft" value={stats.draftCount} />
        </StatCardGroup>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {data.projects.map((project: Project) => (
          <EntityCard
            key={project.id}
            cardTitle={project.name}
            cardSubtitle={project.slug ?? project.id}
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
              <div className="flex gap-1">
                {project.tags.slice(0, 2).map((tag: string) => (
                  <span
                    key={tag}
                    className="bg-muted text-muted-foreground rounded px-1.5 py-0.5 text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
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
