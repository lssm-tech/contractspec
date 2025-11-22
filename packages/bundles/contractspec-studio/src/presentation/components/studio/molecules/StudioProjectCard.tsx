import * as React from 'react';
import { Play, Pencil, Archive, Layers, Server } from 'lucide-react';
import {
  EntityCard,
  StatusChip,
} from '@lssm/lib.design-system';

export interface StudioProjectSummary {
  id: string;
  name: string;
  description?: string | null;
  tier: 'STARTER' | 'PROFESSIONAL' | 'ENTERPRISE';
  deploymentMode: 'SHARED' | 'DEDICATED';
  specCount?: number;
  overlayCount?: number;
  lastDeploymentAt?: string | Date | null;
  environmentStatus?: string;
}

export interface StudioProjectCardProps {
  project: StudioProjectSummary;
  onDeploy?: (projectId: string) => void;
  onEdit?: (projectId: string) => void;
  onArchive?: (projectId: string) => void;
  deployLabel?: string;
  isDeploying?: boolean;
  disabled?: boolean;
}

const tierColor: Record<
  StudioProjectSummary['tier'],
  { tone: React.ComponentProps<typeof StatusChip>['tone']; label: string }
> = {
  STARTER: { tone: 'info', label: 'Starter' },
  PROFESSIONAL: { tone: 'warning', label: 'Professional' },
  ENTERPRISE: { tone: 'success', label: 'Enterprise' },
};

const deploymentLabel: Record<StudioProjectSummary['deploymentMode'], string> = {
  SHARED: 'Shared deployment',
  DEDICATED: 'Dedicated deployment',
};

export function StudioProjectCard({
  project,
  onDeploy,
  onEdit,
  onArchive,
  deployLabel = 'Deploy',
  isDeploying,
  disabled,
}: StudioProjectCardProps) {
  const lastDeployment =
    typeof project.lastDeploymentAt === 'string'
      ? new Date(project.lastDeploymentAt)
      : project.lastDeploymentAt;

  return (
    <EntityCard
      cardTitle={
        <span className="flex items-center gap-2">
          {project.name}
          <StatusChip
            size="sm"
            tone={tierColor[project.tier].tone}
            label={tierColor[project.tier].label}
          />
        </span>
      }
      cardSubtitle={
        <span className="text-muted-foreground flex items-center gap-1 text-base">
          <Server className="h-3.5 w-3.5 text-muted-foreground" />
          {deploymentLabel[project.deploymentMode]}
        </span>
      }
      meta={
        <div className="text-muted-foreground space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <Layers className="h-3.5 w-3.5 text-muted-foreground" />
            <span>
              {project.specCount ?? 0} specs · {project.overlayCount ?? 0}{' '}
              overlays
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Play className="h-3.5 w-3.5 text-muted-foreground" />
            {lastDeployment ? (
              <span>
                Last deployment:{' '}
                {lastDeployment.toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            ) : (
              <span>No deployments yet</span>
            )}
          </div>
          {project.description && (
            <p className="text-foreground text-sm">{project.description}</p>
          )}
        </div>
      }
      footer={
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            className="btn-primary inline-flex items-center gap-1 text-sm"
            onClick={() => onDeploy?.(project.id)}
            disabled={disabled || isDeploying}
            aria-label={`${deployLabel} ${project.name}`}
          >
            {isDeploying ? (
              <span className="h-3 w-3 animate-spin rounded-full border border-white border-t-transparent" />
            ) : (
              <Play className="h-3.5 w-3.5" />
            )}
            {deployLabel}
          </button>
          <button
            type="button"
            className="btn-ghost inline-flex items-center gap-1 text-sm"
            onClick={() => onEdit?.(project.id)}
            disabled={disabled}
          >
            <Pencil className="h-3.5 w-3.5" />
            Edit
          </button>
          <button
            type="button"
            className="btn-ghost inline-flex items-center gap-1 text-sm text-destructive hover:text-destructive"
            onClick={() => onArchive?.(project.id)}
            disabled={disabled}
          >
            <Archive className="h-3.5 w-3.5" />
            Archive
          </button>
        </div>
      }
    />
  );
}




