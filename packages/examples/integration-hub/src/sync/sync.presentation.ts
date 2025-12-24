import type { PresentationSpec } from '@lssm/lib.contracts';
import { StabilityEnum } from '@lssm/lib.contracts';
import {
  SyncConfigModel,
  SyncRunModel,
  FieldMappingModel,
} from './sync.schema';

export const SyncConfigListPresentation: PresentationSpec = {
  meta: {
    key: 'integration.syncConfig.list',
    version: 1,
    title: 'Sync Config List',
    description: 'List of sync configurations',
    domain: 'integration',
    owners: ['@integration-team'],
    tags: ['integration', 'sync', 'config', 'list'],
    stability: StabilityEnum.Experimental,
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
    key: 'integration.syncConfig.editor',
    version: 1,
    title: 'Sync Config Editor',
    description: 'Editor for sync configuration settings',
    domain: 'integration',
    owners: ['@integration-team'],
    tags: ['integration', 'sync', 'config', 'editor'],
    stability: StabilityEnum.Experimental,
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
    key: 'integration.fieldMapping.editor',
    version: 1,
    title: 'Field Mapping Editor',
    description: 'Visual field mapping editor',
    domain: 'integration',
    owners: ['@integration-team'],
    tags: ['integration', 'field-mapping', 'editor'],
    stability: StabilityEnum.Experimental,
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
    key: 'integration.syncRun.list',
    version: 1,
    title: 'Sync Run History',
    description: 'History of sync runs',
    domain: 'integration',
    owners: ['@integration-team'],
    tags: ['integration', 'sync', 'runs', 'history'],
    stability: StabilityEnum.Experimental,
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
    key: 'integration.syncRun.detail',
    version: 1,
    title: 'Sync Run Details',
    description: 'Detailed view of a sync run with logs',
    domain: 'integration',
    owners: ['@integration-team'],
    tags: ['integration', 'sync', 'run', 'detail'],
    stability: StabilityEnum.Experimental,
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
    key: 'integration.sync.activity',
    version: 1,
    title: 'Sync Activity Monitor',
    description: 'Real-time sync activity monitor',
    domain: 'integration',
    owners: ['@integration-team'],
    tags: ['integration', 'sync', 'activity', 'realtime'],
    stability: StabilityEnum.Experimental,
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
