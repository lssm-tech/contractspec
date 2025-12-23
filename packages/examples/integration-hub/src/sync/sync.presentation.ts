import type { PresentationSpec } from '@lssm/lib.contracts';
import {
  SyncConfigModel,
  SyncRunModel,
  FieldMappingModel,
} from './sync.schema';

export const SyncConfigListPresentation: PresentationSpec = {
  meta: {
    name: 'integration.syncConfig.list',
    version: 1,
    description: 'List of sync configurations',
    domain: 'integration',
    owners: ['@integration-team'],
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

export const SyncConfigEditorPresentation: PresentationSpec = {
  meta: {
    name: 'integration.syncConfig.editor',
    version: 1,
    description: 'Editor for sync configuration settings',
    domain: 'integration',
    owners: ['@integration-team'],
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

export const FieldMappingEditorPresentation: PresentationSpec = {
  meta: {
    name: 'integration.fieldMapping.editor',
    version: 1,
    description: 'Visual field mapping editor',
    domain: 'integration',
    owners: ['@integration-team'],
    tags: ['integration', 'field-mapping', 'editor'],
  },
  source: {
    type: 'component',
    framework: 'react',
    componentKey: 'FieldMappingEditor',
    props: FieldMappingModel,
  },
  targets: ['react'],
  policy: {
    flags: ['integration.sync.enabled'],
  },
};

export const SyncRunListPresentation: PresentationSpec = {
  meta: {
    name: 'integration.syncRun.list',
    version: 1,
    description: 'History of sync runs',
    domain: 'integration',
    owners: ['@integration-team'],
    tags: ['integration', 'sync', 'runs', 'history'],
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

export const SyncRunDetailPresentation: PresentationSpec = {
  meta: {
    name: 'integration.syncRun.detail',
    version: 1,
    description: 'Detailed view of a sync run with logs',
    domain: 'integration',
    owners: ['@integration-team'],
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

export const SyncActivityPresentation: PresentationSpec = {
  meta: {
    name: 'integration.sync.activity',
    version: 1,
    description: 'Real-time sync activity monitor',
    domain: 'integration',
    owners: ['@integration-team'],
    tags: ['integration', 'sync', 'activity', 'realtime'],
  },
  source: {
    type: 'component',
    framework: 'react',
    componentKey: 'SyncActivity',
  },
  targets: ['react', 'markdown'],
  policy: {
    flags: ['integration.sync.enabled'],
  },
};
