/**
 * Markdown renderers for Integration Hub presentations
 */
import type { PresentationRenderer } from '@lssm/lib.contracts';

// Mock data for integration rendering
const mockIntegrations = [
  {
    id: 'int-1',
    name: 'Salesforce',
    type: 'CRM',
    status: 'ACTIVE',
    connectionCount: 3,
  },
  {
    id: 'int-2',
    name: 'HubSpot',
    type: 'MARKETING',
    status: 'ACTIVE',
    connectionCount: 2,
  },
  {
    id: 'int-3',
    name: 'Stripe',
    type: 'PAYMENT',
    status: 'ACTIVE',
    connectionCount: 1,
  },
  {
    id: 'int-4',
    name: 'Slack',
    type: 'COMMUNICATION',
    status: 'INACTIVE',
    connectionCount: 0,
  },
  {
    id: 'int-5',
    name: 'Google Sheets',
    type: 'DATA',
    status: 'ACTIVE',
    connectionCount: 5,
  },
];

const mockConnections = [
  {
    id: 'conn-1',
    integrationId: 'int-1',
    name: 'Production Salesforce',
    status: 'CONNECTED',
    lastSyncAt: '2024-01-16T10:00:00Z',
  },
  {
    id: 'conn-2',
    integrationId: 'int-1',
    name: 'Sandbox Salesforce',
    status: 'CONNECTED',
    lastSyncAt: '2024-01-15T14:00:00Z',
  },
  {
    id: 'conn-3',
    integrationId: 'int-2',
    name: 'Marketing HubSpot',
    status: 'CONNECTED',
    lastSyncAt: '2024-01-16T08:00:00Z',
  },
  {
    id: 'conn-4',
    integrationId: 'int-3',
    name: 'Stripe Live',
    status: 'CONNECTED',
    lastSyncAt: '2024-01-16T12:00:00Z',
  },
  {
    id: 'conn-5',
    integrationId: 'int-5',
    name: 'Analytics Sheet',
    status: 'ERROR',
    lastSyncAt: '2024-01-14T09:00:00Z',
    error: 'Authentication expired',
  },
];

const mockSyncConfigs = [
  {
    id: 'sync-1',
    connectionId: 'conn-1',
    name: 'Contacts Sync',
    frequency: 'HOURLY',
    lastRunAt: '2024-01-16T10:00:00Z',
    status: 'SUCCESS',
    recordsSynced: 1250,
  },
  {
    id: 'sync-2',
    connectionId: 'conn-1',
    name: 'Opportunities Sync',
    frequency: 'DAILY',
    lastRunAt: '2024-01-16T00:00:00Z',
    status: 'SUCCESS',
    recordsSynced: 340,
  },
  {
    id: 'sync-3',
    connectionId: 'conn-3',
    name: 'Orders Sync',
    frequency: 'REALTIME',
    lastRunAt: '2024-01-16T12:30:00Z',
    status: 'SUCCESS',
    recordsSynced: 89,
  },
  {
    id: 'sync-4',
    connectionId: 'conn-5',
    name: 'Metrics Export',
    frequency: 'DAILY',
    lastRunAt: '2024-01-14T09:00:00Z',
    status: 'FAILED',
    recordsSynced: 0,
  },
];

/**
 * Markdown renderer for Integration Dashboard
 */
export const integrationDashboardMarkdownRenderer: PresentationRenderer<{
  mimeType: string;
  body: string;
}> = {
  target: 'markdown',
  render: async (desc) => {
    if (
      desc.source.type !== 'component' ||
      desc.source.componentKey !== 'IntegrationDashboard'
    ) {
      throw new Error(
        'integrationDashboardMarkdownRenderer: not IntegrationDashboard'
      );
    }

    const integrations = mockIntegrations;
    const connections = mockConnections;
    const syncs = mockSyncConfigs;

    // Calculate stats
    const activeIntegrations = integrations.filter(
      (i) => i.status === 'ACTIVE'
    );
    const connectedConnections = connections.filter(
      (c) => c.status === 'CONNECTED'
    );
    const errorConnections = connections.filter((c) => c.status === 'ERROR');
    const successfulSyncs = syncs.filter((s) => s.status === 'SUCCESS');
    const totalRecordsSynced = successfulSyncs.reduce(
      (sum, s) => sum + s.recordsSynced,
      0
    );

    const lines: string[] = [
      '# Integration Hub',
      '',
      '> Connect and sync data with external services',
      '',
      '## Overview',
      '',
      '| Metric | Value |',
      '|--------|-------|',
      `| Active Integrations | ${activeIntegrations.length} |`,
      `| Connected Services | ${connectedConnections.length} |`,
      `| Error Connections | ${errorConnections.length} |`,
      `| Sync Configs | ${syncs.length} |`,
      `| Records Synced (24h) | ${totalRecordsSynced.toLocaleString()} |`,
      '',
      '## Integrations',
      '',
      '| Name | Type | Connections | Status |',
      '|------|------|-------------|--------|',
    ];

    for (const integration of integrations) {
      const statusIcon = integration.status === 'ACTIVE' ? '🟢' : '⚫';
      lines.push(
        `| ${integration.name} | ${integration.type} | ${integration.connectionCount} | ${statusIcon} ${integration.status} |`
      );
    }

    lines.push('');
    lines.push('## Recent Sync Activity');
    lines.push('');
    lines.push('| Sync | Frequency | Last Run | Records | Status |');
    lines.push('|------|-----------|----------|---------|--------|');

    for (const sync of syncs) {
      const lastRun = new Date(sync.lastRunAt).toLocaleString();
      const statusIcon = sync.status === 'SUCCESS' ? '✅' : '❌';
      lines.push(
        `| ${sync.name} | ${sync.frequency} | ${lastRun} | ${sync.recordsSynced} | ${statusIcon} ${sync.status} |`
      );
    }

    if (errorConnections.length > 0) {
      lines.push('');
      lines.push('## ⚠️ Connections with Errors');
      lines.push('');
      for (const conn of errorConnections) {
        const integration = integrations.find(
          (i) => i.id === conn.integrationId
        );
        lines.push(
          `- **${conn.name}** (${integration?.name ?? 'Unknown'}): ${(conn as { error?: string }).error ?? 'Unknown error'}`
        );
      }
    }

    return {
      mimeType: 'text/markdown',
      body: lines.join('\n'),
    };
  },
};

/**
 * Markdown renderer for Connection List
 */
export const connectionListMarkdownRenderer: PresentationRenderer<{
  mimeType: string;
  body: string;
}> = {
  target: 'markdown',
  render: async (desc) => {
    if (
      desc.source.type !== 'component' ||
      desc.source.componentKey !== 'ConnectionList'
    ) {
      throw new Error('connectionListMarkdownRenderer: not ConnectionList');
    }

    const connections = mockConnections;
    const integrations = mockIntegrations;

    const lines: string[] = [
      '# Connections',
      '',
      '> Manage connections to external services',
      '',
    ];

    // Group by integration
    for (const integration of integrations) {
      const intConnections = connections.filter(
        (c) => c.integrationId === integration.id
      );

      if (intConnections.length === 0) continue;

      lines.push(`## ${integration.name}`);
      lines.push('');
      lines.push('| Connection | Status | Last Sync |');
      lines.push('|------------|--------|-----------|');

      for (const conn of intConnections) {
        const lastSync = new Date(conn.lastSyncAt).toLocaleString();
        const statusIcon =
          conn.status === 'CONNECTED'
            ? '🟢'
            : conn.status === 'ERROR'
              ? '🔴'
              : '⚫';
        lines.push(
          `| ${conn.name} | ${statusIcon} ${conn.status} | ${lastSync} |`
        );
      }

      lines.push('');
    }

    return {
      mimeType: 'text/markdown',
      body: lines.join('\n'),
    };
  },
};

/**
 * Markdown renderer for Sync Config
 */
export const syncConfigMarkdownRenderer: PresentationRenderer<{
  mimeType: string;
  body: string;
}> = {
  target: 'markdown',
  render: async (desc) => {
    if (
      desc.source.type !== 'component' ||
      desc.source.componentKey !== 'SyncConfigEditor'
    ) {
      throw new Error('syncConfigMarkdownRenderer: not SyncConfigEditor');
    }

    const syncs = mockSyncConfigs;
    const connections = mockConnections;

    const lines: string[] = [
      '# Sync Configurations',
      '',
      '> Configure automated data synchronization',
      '',
    ];

    for (const sync of syncs) {
      const connection = connections.find((c) => c.id === sync.connectionId);
      const statusIcon = sync.status === 'SUCCESS' ? '✅' : '❌';

      lines.push(`## ${sync.name}`);
      lines.push('');
      lines.push(`**Connection:** ${connection?.name ?? 'Unknown'}`);
      lines.push(`**Frequency:** ${sync.frequency}`);
      lines.push(`**Status:** ${statusIcon} ${sync.status}`);
      lines.push(`**Last Run:** ${new Date(sync.lastRunAt).toLocaleString()}`);
      lines.push(`**Records Synced:** ${sync.recordsSynced.toLocaleString()}`);
      lines.push('');
    }

    lines.push('## Frequency Options');
    lines.push('');
    lines.push('- **REALTIME**: Sync on every change');
    lines.push('- **HOURLY**: Sync every hour');
    lines.push('- **DAILY**: Sync once per day');
    lines.push('- **WEEKLY**: Sync once per week');
    lines.push('- **MANUAL**: Sync only when triggered');

    return {
      mimeType: 'text/markdown',
      body: lines.join('\n'),
    };
  },
};

