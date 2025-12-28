/**
 * Integration Hub Feature Module Specification
 */
import type { FeatureModuleSpec } from '@contractspec/lib.contracts';

export const IntegrationHubFeature: FeatureModuleSpec = {
  meta: {
    key: 'integration-hub',
    version: 1,
    title: 'Integration Hub',
    description:
      'Connect and sync data with external systems through configurable integrations',
    domain: 'integration',
    owners: ['@integration-team'],
    tags: ['integration', 'sync', 'etl', 'connectors'],
    stability: 'experimental',
  },

  operations: [
    { key: 'integration.create', version: 1 },
    { key: 'integration.connection.create', version: 1 },
    { key: 'integration.syncConfig.create', version: 1 },
    { key: 'integration.fieldMapping.add', version: 1 },
    { key: 'integration.sync.trigger', version: 1 },
    { key: 'integration.syncRun.list', version: 1 },
  ],

  events: [
    { key: 'integration.created', version: 1 },
    { key: 'integration.connection.created', version: 1 },
    { key: 'integration.connection.statusChanged', version: 1 },
    { key: 'integration.syncConfig.created', version: 1 },
    { key: 'integration.sync.started', version: 1 },
    { key: 'integration.sync.completed', version: 1 },
    { key: 'integration.sync.failed', version: 1 },
    { key: 'integration.record.synced', version: 1 },
    { key: 'integration.fieldMapping.added', version: 1 },
  ],

  presentations: [
    { key: 'integration.list', version: 1 },
    { key: 'integration.detail', version: 1 },
    { key: 'integration.connection.list', version: 1 },
    { key: 'integration.connection.setup', version: 1 },
    { key: 'integration.syncConfig.list', version: 1 },
    { key: 'integration.syncConfig.editor', version: 1 },
    { key: 'integration.fieldMapping.editor', version: 1 },
    { key: 'integration.syncRun.list', version: 1 },
    { key: 'integration.syncRun.detail', version: 1 },
    { key: 'integration.health', version: 1 },
    { key: 'integration.sync.activity', version: 1 },
  ],

  opToPresentation: [
    {
      op: { key: 'integration.syncConfig.create', version: 1 },
      pres: { key: 'integration.syncConfig.editor', version: 1 },
    },
    {
      op: { key: 'integration.fieldMapping.add', version: 1 },
      pres: { key: 'integration.fieldMapping.editor', version: 1 },
    },
    {
      op: { key: 'integration.syncRun.list', version: 1 },
      pres: { key: 'integration.syncRun.list', version: 1 },
    },
  ],

  presentationsTargets: [
    { key: 'integration.list', version: 1, targets: ['react', 'markdown'] },
    { key: 'integration.detail', version: 1, targets: ['react', 'markdown'] },
    {
      key: 'integration.syncConfig.list',
      version: 1,
      targets: ['react', 'markdown'],
    },
    { key: 'integration.syncConfig.editor', version: 1, targets: ['react'] },
    { key: 'integration.fieldMapping.editor', version: 1, targets: ['react'] },
    {
      key: 'integration.syncRun.list',
      version: 1,
      targets: ['react', 'markdown'],
    },
    {
      key: 'integration.syncRun.detail',
      version: 1,
      targets: ['react', 'markdown'],
    },
  ],

  capabilities: {
    requires: [
      { key: 'identity', version: 1 },
      { key: 'audit-trail', version: 1 },
      { key: 'feature-flags', version: 1 },
      { key: 'jobs', version: 1 },
      { key: 'files', version: 1 },
    ],
    provides: [
      { key: 'integration', version: 1 },
      { key: 'sync', version: 1 },
      { key: 'etl', version: 1 },
    ],
  },
};
