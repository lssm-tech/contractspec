'use client';

import * as React from 'react';
import { EnvironmentEnum } from '@contractspec/lib.gql-client-studio';

import { Card } from '@contractspec/lib.ui-kit-web/ui/card';
import type { DeploymentHistoryItem } from '@contractspec/bundle.studio/presentation/components/studio/molecules/DeploymentPanel';
import { DeploymentPanel } from '@contractspec/bundle.studio/presentation/components/studio/molecules/DeploymentPanel';
import { useDeployStudioProject } from '@contractspec/bundle.studio/presentation/hooks/studio/mutations/useDeployProject';
import { useSelectedProject } from '../SelectedProjectContext';
import {
  StudioLearningEventNames,
  useStudioLearningEventRecorder,
  useStudioProjectBySlug,
} from '@contractspec/bundle.studio/presentation/hooks/studio';
import { useParams } from 'next/navigation';

function isEnvironment(
  value: string
): value is DeploymentHistoryItem['environment'] {
  return (
    value === 'DEVELOPMENT' || value === 'STAGING' || value === 'PRODUCTION'
  );
}

function isStatus(value: string): value is DeploymentHistoryItem['status'] {
  return (
    value === 'PENDING' ||
    value === 'DEPLOYING' ||
    value === 'DEPLOYED' ||
    value === 'FAILED' ||
    value === 'ROLLED_BACK'
  );
}

export default function ProjectDeployClient() {
  const project = useSelectedProject();
  const params = useParams<{ projectSlug: string }>();
  const { data, isLoading, refetch } = useStudioProjectBySlug(
    params.projectSlug
  );
  const deployments = data?.studioProjectBySlug.project.deployments ?? [];
  const deploy = useDeployStudioProject();
  const { recordFireAndForget: recordLearningEvent } =
    useStudioLearningEventRecorder();

  if (isLoading) {
    return (
      <Card className="p-6">
        <p className="text-muted-foreground text-sm">Loading deployments…</p>
      </Card>
    );
  }

  return (
    <DeploymentPanel
      projectId={project.id}
      deployments={deployments.reduce<DeploymentHistoryItem[]>((acc, d) => {
        if (!isEnvironment(d.environment) || !isStatus(d.status)) return acc;
        acc.push({
          id: d.id,
          environment: d.environment,
          status: d.status,
          version: d.version,
          url: d.url ?? null,
          deployedAt: d.deployedAt ?? null,
        });
        return acc;
      }, [])}
      onDeploy={async (environment) => {
        await deploy.mutateAsync({
          projectId: project.id,
          environment: environment as EnvironmentEnum,
        });
        await refetch();
        recordLearningEvent({
          projectId: project.id,
          name: StudioLearningEventNames.REGENERATION_COMPLETED,
          payload: { environment, source: 'deploy' },
        });
      }}
      onRollback={async () => {
        // TODO: add rollback mutation; DB-backed deployments exist but rollback isn't implemented yet.
      }}
    />
  );
}
