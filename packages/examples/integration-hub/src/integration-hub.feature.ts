/**
 * Integration Hub Feature Module Specification
 */
import type { FeatureModuleSpec } from '@lssm/lib.contracts';

export const IntegrationHubFeature: FeatureModuleSpec = {
  meta: {
    key: 'integration-hub',
    title: 'Integration Hub',
    description:
      'Connect and sync data with external systems through configurable integrations',
    domain: 'integration',
    owners: ['integration-team'],
    tags: ['integration', 'sync', 'etl', 'connectors'],
    stability: 'experimental',
  },

  operations: [
    { name: 'integration.create', version: 1 },
    { name: 'integration.connection.create', version: 1 },
    { name: 'integration.syncConfig.create', version: 1 },
    { name: 'integration.fieldMapping.add', version: 1 },
    { name: 'integration.sync.trigger', version: 1 },
    { name: 'integration.syncRun.list', version: 1 },
  ],

  events: [
    { name: 'integration.created', version: 1 },
    { name: 'integration.connection.created', version: 1 },
    { name: 'integration.connection.statusChanged', version: 1 },
    { name: 'integration.syncConfig.created', version: 1 },
    { name: 'integration.sync.started', version: 1 },
    { name: 'integration.sync.completed', version: 1 },
    { name: 'integration.sync.failed', version: 1 },
    { name: 'integration.record.synced', version: 1 },
  ],

  presentations: [
    { name: 'integration.list', version: 1 },
    { name: 'integration.detail', version: 1 },
    { name: 'integration.connection.list', version: 1 },
    { name: 'integration.connection.setup', version: 1 },
    { name: 'integration.syncConfig.list', version: 1 },
    { name: 'integration.syncConfig.editor', version: 1 },
    { name: 'integration.fieldMapping.editor', version: 1 },
    { name: 'integration.syncRun.list', version: 1 },
    { name: 'integration.syncRun.detail', version: 1 },
    { name: 'integration.health', version: 1 },
    { name: 'integration.sync.activity', version: 1 },
  ],

  opToPresentation: [
    {
      op: { name: 'integration.syncConfig.create', version: 1 },
      pres: { name: 'integration.syncConfig.editor', version: 1 },
    },
    {
      op: { name: 'integration.fieldMapping.add', version: 1 },
      pres: { name: 'integration.fieldMapping.editor', version: 1 },
    },
    {
      op: { name: 'integration.syncRun.list', version: 1 },
      pres: { name: 'integration.syncRun.list', version: 1 },
    },
  ],

  presentationsTargets: [
    { name: 'integration.list', version: 1, targets: ['react', 'markdown'] },
    { name: 'integration.detail', version: 1, targets: ['react', 'markdown'] },
    {
      name: 'integration.syncConfig.list',
      version: 1,
      targets: ['react', 'markdown'],
    },
    { name: 'integration.syncConfig.editor', version: 1, targets: ['react'] },
    { name: 'integration.fieldMapping.editor', version: 1, targets: ['react'] },
    {
      name: 'integration.syncRun.list',
      version: 1,
      targets: ['react', 'markdown'],
    },
    {
      name: 'integration.syncRun.detail',
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
