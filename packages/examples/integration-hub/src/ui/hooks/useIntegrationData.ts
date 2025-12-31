'use client';

import { useCallback, useEffect, useState } from 'react';
import type {
  Connection,
  Integration,
  IntegrationHandlers,
  SyncConfig,
} from '../../handlers/integration.handlers';
import { useTemplateRuntime } from '@contractspec/lib.example-shared-ui';

export interface IntegrationStats {
  totalIntegrations: number;
  activeIntegrations: number;
  totalConnections: number;
  connectedCount: number;
  totalSyncs: number;
  activeSyncs: number;
}

export function useIntegrationData(projectId = 'local-project') {
  const { handlers } = useTemplateRuntime<{
    integration: IntegrationHandlers;
  }>();
  const integration = handlers.integration;
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [syncConfigs, setSyncConfigs] = useState<SyncConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [integResult, connResult, syncResult] = await Promise.all([
        integration.listIntegrations({ projectId, limit: 100 }),
        integration.listConnections({ limit: 100 }),
        integration.listSyncConfigs({ limit: 100 }),
      ]);

      setIntegrations(integResult.integrations);
      setConnections(connResult.connections);
      setSyncConfigs(syncResult.configs);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error('Failed to load integrations')
      );
    } finally {
      setLoading(false);
    }
  }, [integration, projectId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const stats: IntegrationStats = {
    totalIntegrations: integrations.length,
    activeIntegrations: integrations.filter((i) => i.status === 'ACTIVE')
      .length,
    totalConnections: connections.length,
    connectedCount: connections.filter((c) => c.status === 'CONNECTED').length,
    totalSyncs: syncConfigs.length,
    activeSyncs: syncConfigs.filter((s) => s.status === 'ACTIVE').length,
  };

  return {
    integrations,
    connections,
    syncConfigs,
    loading,
    error,
    stats,
    refetch: fetchData,
  };
}
