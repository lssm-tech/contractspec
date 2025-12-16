'use client';

import * as React from 'react';
import { Button, Input } from '@lssm/lib.design-system';
import { Card } from '@lssm/lib.ui-kit-web/ui/card';
import { IntegrationMarketplace } from '@lssm/bundle.contractspec-studio/presentation/components';
import {
  useConnectIntegration,
  useDisconnectIntegration,
  useStudioIntegrations,
} from '@lssm/bundle.contractspec-studio/presentation/hooks/studio';
import { useSelectedProject } from '../SelectedProjectContext';

export default function ProjectIntegrationsClient() {
  const project = useSelectedProject();
  const { data, isLoading, refetch } = useStudioIntegrations({
    projectId: project.id,
  });
  const connect = useConnectIntegration();
  const disconnect = useDisconnectIntegration();

  const [repoPath, setRepoPath] = React.useState('');

  const integrations = data?.studioIntegrations ?? [];

  if (isLoading) {
    return (
      <Card className="p-6">
        <p className="text-muted-foreground text-sm">Loading integrations…</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <p className="text-sm font-semibold">Link a repo (GitHub)</p>
        <p className="text-muted-foreground mt-1 text-sm">
          This creates a Studio integration record scoped to the project.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <div className="min-w-[260px] flex-1">
            <Input
              aria-label="Repo path"
              placeholder="github.com/org/repo"
              value={repoPath}
              onChange={(e) => setRepoPath(e.target.value)}
            />
          </div>
          <Button
            loading={connect.isPending}
            onPress={async () => {
              const path = repoPath.trim();
              if (!path) return;
              await connect.mutateAsync({
                provider: 'GITHUB',
                projectId: project.id,
                name: `GitHub: ${path}`,
                ownershipMode: 'byok',
                secretProvider: 'env',
                secretRef: 'GITHUB_TOKEN',
                config: { repoPath: path },
              });
              setRepoPath('');
              await refetch();
            }}
          >
            Link repo
          </Button>
        </div>
      </Card>

      <IntegrationMarketplace
        integrations={integrations.map((i) => ({
          id: i.id,
          provider: i.provider,
          name: i.name,
          category: 'repo',
          enabled: i.enabled,
          status: i.enabled ? 'connected' : 'disconnected',
          lastSyncAt: i.lastUsed ?? null,
        }))}
        onToggle={async (id, enabled) => {
          if (!enabled) {
            await disconnect.mutateAsync({ id });
            await refetch();
            return;
          }
          // enable flow not implemented yet (reconnect is connect)
        }}
        onConfigure={() => void 0}
      />
    </div>
  );
}










