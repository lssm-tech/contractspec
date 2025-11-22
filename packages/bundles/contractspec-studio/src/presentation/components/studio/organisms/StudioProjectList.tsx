import * as React from 'react';
import { Filter, RefreshCcw } from 'lucide-react';
import { StudioProjectCard } from '../molecules/StudioProjectCard';
import type { StudioProjectSummary } from '../molecules/StudioProjectCard';
import {
  useStudioProjects,
  type StudioProjectRecord,
} from '../../../hooks/studio/queries/useStudioProjects';

type TierFilter = 'ALL' | StudioProjectSummary['tier'];
type ModeFilter = 'ALL' | StudioProjectSummary['deploymentMode'];

export interface StudioProjectListProps {
  organizationId?: string;
  onDeploy?: (projectId: string) => Promise<void> | void;
  onEdit?: (projectId: string) => void;
  onArchive?: (projectId: string) => void;
  emptyState?: React.ReactNode;
}

function toSummary(project: StudioProjectRecord): StudioProjectSummary {
  return {
    id: project.id,
    name: project.name,
    description: project.description,
    tier: project.tier,
    deploymentMode: project.deploymentMode,
    specCount: project.specs?.length ?? 0,
    overlayCount: 0,
    lastDeploymentAt: project.deployments?.[0]?.deployedAt ?? null,
  };
}

export function StudioProjectList({
  organizationId,
  onDeploy,
  onEdit,
  onArchive,
  emptyState,
}: StudioProjectListProps) {
  const [tierFilter, setTierFilter] = React.useState<TierFilter>('ALL');
  const [modeFilter, setModeFilter] = React.useState<ModeFilter>('ALL');
  const [deployingId, setDeployingId] = React.useState<string | null>(null);

  const { data, isLoading, refetch, isRefetching } = useStudioProjects({
    organizationId,
  });

  const projects = React.useMemo(() => {
    const items = data?.myStudioProjects ?? [];
    return items.filter((item) => {
      const matchesTier =
        tierFilter === 'ALL' ? true : item.tier === tierFilter;
      const matchesMode =
        modeFilter === 'ALL' ? true : item.deploymentMode === modeFilter;
      return matchesTier && matchesMode;
    });
  }, [data?.myStudioProjects, tierFilter, modeFilter]);

  const handleDeploy = async (projectId: string) => {
    if (!onDeploy) return;
    try {
      setDeployingId(projectId);
      await onDeploy(projectId);
      await refetch();
    } finally {
      setDeployingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {Array.from({ length: 3 }).map((_, idx) => (
          <div
            key={idx}
            className="h-32 animate-pulse rounded-xl border border-dashed border-muted-foreground/30 bg-muted/30"
          />
        ))}
      </div>
    );
  }

  if (!projects.length) {
    return (
      <div className="space-y-4">
        <FiltersRow
          tierFilter={tierFilter}
          modeFilter={modeFilter}
          onTierChange={setTierFilter}
          onModeChange={setModeFilter}
          isRefreshing={isRefetching}
          onRefresh={refetch}
        />
        <div className="card-subtle flex flex-col items-center justify-center gap-3 p-8 text-center">
          {emptyState ?? (
            <>
              <p className="text-lg font-semibold">No projects yet</p>
              <p className="text-muted-foreground text-sm">
                Create your first Studio project to start defining specs and
                deployments.
              </p>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <FiltersRow
        tierFilter={tierFilter}
        modeFilter={modeFilter}
        onTierChange={setTierFilter}
        onModeChange={setModeFilter}
        isRefreshing={isRefetching}
        onRefresh={refetch}
      />
      <div className="grid gap-4 md:grid-cols-2">
        {projects.map((project) => (
          <StudioProjectCard
            key={project.id}
            project={toSummary(project)}
            onDeploy={(id) => handleDeploy(id)}
            onEdit={onEdit}
            onArchive={onArchive}
            isDeploying={deployingId === project.id}
          />
        ))}
      </div>
    </div>
  );
}

interface FiltersRowProps {
  tierFilter: TierFilter;
  modeFilter: ModeFilter;
  onTierChange: (tier: TierFilter) => void;
  onModeChange: (mode: ModeFilter) => void;
  isRefreshing: boolean;
  onRefresh: () => void;
}

function FiltersRow({
  tierFilter,
  modeFilter,
  onTierChange,
  onModeChange,
  isRefreshing,
  onRefresh,
}: FiltersRowProps) {
  return (
    <div className="border-border flex flex-wrap items-center gap-3 rounded-xl border bg-card p-4">
      <div className="text-muted-foreground inline-flex items-center gap-2 text-sm uppercase tracking-wide">
        <Filter className="h-4 w-4" />
        Filters
      </div>
      <select
        className="border-border rounded-md border bg-background px-3 py-2 text-sm"
        aria-label="Filter by tier"
        value={tierFilter}
        onChange={(event) => onTierChange(event.target.value as TierFilter)}
      >
        <option value="ALL">All tiers</option>
        <option value="STARTER">Starter</option>
        <option value="PROFESSIONAL">Professional</option>
        <option value="ENTERPRISE">Enterprise</option>
      </select>
      <select
        className="border-border rounded-md border bg-background px-3 py-2 text-sm"
        aria-label="Filter by deployment mode"
        value={modeFilter}
        onChange={(event) => onModeChange(event.target.value as ModeFilter)}
      >
        <option value="ALL">All deployments</option>
        <option value="SHARED">Shared</option>
        <option value="DEDICATED">Dedicated</option>
      </select>
      <button
        type="button"
        className="btn-ghost inline-flex items-center gap-2 text-sm"
        onClick={onRefresh}
        disabled={isRefreshing}
      >
        <RefreshCcw className="h-3.5 w-3.5" />
        Refresh
      </button>
    </div>
  );
}

