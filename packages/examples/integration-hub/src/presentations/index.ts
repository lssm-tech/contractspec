/**
 * Integration Hub Presentation Descriptors
 */
import type { PresentationDescriptorV2 } from '@lssm/lib.contracts';
import {
  IntegrationModel,
  ConnectionModel,
  SyncConfigModel,
  SyncRunModel,
} from '../contracts';

// ============ Integration Presentations ============

export const IntegrationListPresentation: PresentationDescriptorV2 = {
  meta: {
    name: 'integration.list',
    version: 1,
    description: 'List of configured integrations',
    domain: 'integration-hub',
    owners: ['integration-team'],
    tags: ['integration', 'list'],
  },
  source: {
    type: 'component',
    framework: 'react',
    componentKey: 'IntegrationList',
    props: IntegrationModel,
  },
  targets: ['react', 'markdown'],
  policy: {
    flags: ['integration.enabled'],
  },
};

export const IntegrationDetailPresentation: PresentationDescriptorV2 = {
  meta: {
    name: 'integration.detail',
    version: 1,
    description: 'Integration detail with connections and syncs',
    domain: 'integration-hub',
    owners: ['integration-team'],
    tags: ['integration', 'detail'],
  },
  source: {
    type: 'component',
    framework: 'react',
    componentKey: 'IntegrationDetail',
    props: IntegrationModel,
  },
  targets: ['react', 'markdown'],
  policy: {
    flags: ['integration.enabled'],
  },
};

// ============ Connection Presentations ============

export const ConnectionListPresentation: PresentationDescriptorV2 = {
  meta: {
    name: 'integration.connection.list',
    version: 1,
    description: 'List of connections for an integration',
    domain: 'integration-hub',
    owners: ['integration-team'],
    tags: ['integration', 'connection', 'list'],
  },
  source: {
    type: 'component',
    framework: 'react',
    componentKey: 'ConnectionList',
    props: ConnectionModel,
  },
  targets: ['react', 'markdown'],
  policy: {
    flags: ['integration.enabled'],
  },
};

export const ConnectionSetupPresentation: PresentationDescriptorV2 = {
  meta: {
    name: 'integration.connection.setup',
    version: 1,
    description: 'Connection setup wizard',
    domain: 'integration-hub',
    owners: ['integration-team'],
    tags: ['integration', 'connection', 'setup'],
  },
  source: {
    type: 'component',
    framework: 'react',
    componentKey: 'ConnectionSetup',
  },
  targets: ['react'],
  policy: {
    flags: ['integration.enabled'],
  },
};

// ============ Sync Config Presentations ============

export const SyncConfigListPresentation: PresentationDescriptorV2 = {
  meta: {
    name: 'integration.syncConfig.list',
    version: 1,
    description: 'List of sync configurations',
    domain: 'integration-hub',
    owners: ['integration-team'],
    tags: ['integration', 'sync', 'config', 'list'],
  },
  source: {
    type: 'component',
    framework: 'react',
    componentKey: 'SyncConfigList',
    props: SyncConfigModel,
  },
  targets: ['react', 'markdown'],
  policy: {
    flags: ['integration.sync.enabled'],
  },
};

export const SyncConfigEditorPresentation: PresentationDescriptorV2 = {
  meta: {
    name: 'integration.syncConfig.editor',
    version: 1,
    description: 'Sync configuration editor with field mappings',
    domain: 'integration-hub',
    owners: ['integration-team'],
    tags: ['integration', 'sync', 'config', 'editor'],
  },
  source: {
    type: 'component',
    framework: 'react',
    componentKey: 'SyncConfigEditor',
    props: SyncConfigModel,
  },
  targets: ['react'],
  policy: {
    flags: ['integration.sync.enabled'],
  },
};

export const FieldMappingEditorPresentation: PresentationDescriptorV2 = {
  meta: {
    name: 'integration.fieldMapping.editor',
    version: 1,
    description: 'Visual field mapping editor',
    domain: 'integration-hub',
    owners: ['integration-team'],
    tags: ['integration', 'mapping', 'editor'],
  },
  source: {
    type: 'component',
    framework: 'react',
    componentKey: 'FieldMappingEditor',
  },
  targets: ['react'],
  policy: {
    flags: ['integration.sync.enabled'],
  },
};

// ============ Sync Run Presentations ============

export const SyncRunListPresentation: PresentationDescriptorV2 = {
  meta: {
    name: 'integration.syncRun.list',
    version: 1,
    description: 'Sync run history with status and stats',
    domain: 'integration-hub',
    owners: ['integration-team'],
    tags: ['integration', 'sync', 'run', 'history'],
  },
  source: {
    type: 'component',
    framework: 'react',
    componentKey: 'SyncRunList',
    props: SyncRunModel,
  },
  targets: ['react', 'markdown'],
  policy: {
    flags: ['integration.sync.enabled'],
  },
};

export const SyncRunDetailPresentation: PresentationDescriptorV2 = {
  meta: {
    name: 'integration.syncRun.detail',
    version: 1,
    description: 'Sync run detail with logs and records',
    domain: 'integration-hub',
    owners: ['integration-team'],
    tags: ['integration', 'sync', 'run', 'detail'],
  },
  source: {
    type: 'component',
    framework: 'react',
    componentKey: 'SyncRunDetail',
    props: SyncRunModel,
  },
  targets: ['react', 'markdown'],
  policy: {
    flags: ['integration.sync.enabled'],
  },
};

// ============ Dashboard Widgets ============

export const IntegrationHealthPresentation: PresentationDescriptorV2 = {
  meta: {
    name: 'integration.health',
    version: 1,
    description: 'Integration health dashboard widget',
    domain: 'integration-hub',
    owners: ['integration-team'],
    tags: ['integration', 'health', 'dashboard'],
  },
  source: {
    type: 'component',
    framework: 'react',
    componentKey: 'IntegrationHealthWidget',
  },
  targets: ['react'],
  policy: {
    flags: ['integration.enabled'],
  },
};

export const SyncActivityPresentation: PresentationDescriptorV2 = {
  meta: {
    name: 'integration.sync.activity',
    version: 1,
    description: 'Recent sync activity widget',
    domain: 'integration-hub',
    owners: ['integration-team'],
    tags: ['integration', 'sync', 'activity', 'dashboard'],
  },
  source: {
    type: 'component',
    framework: 'react',
    componentKey: 'SyncActivityWidget',
  },
  targets: ['react'],
  policy: {
    flags: ['integration.sync.enabled'],
  },
};

// ============ All Presentations ============

export const IntegrationHubPresentations = {
  IntegrationListPresentation,
  IntegrationDetailPresentation,
  ConnectionListPresentation,
  ConnectionSetupPresentation,
  SyncConfigListPresentation,
  SyncConfigEditorPresentation,
  FieldMappingEditorPresentation,
  SyncRunListPresentation,
  SyncRunDetailPresentation,
  IntegrationHealthPresentation,
  SyncActivityPresentation,
};
