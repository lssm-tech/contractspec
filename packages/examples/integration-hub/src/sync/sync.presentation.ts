import { definePresentation, StabilityEnum } from '@contractspec/lib.contracts';
import {
  SyncConfigModel,
  SyncRunModel,
  FieldMappingModel,
} from './sync.schema';

export const SyncConfigListPresentation = definePresentation({
  meta: {
    key: 'integration.syncConfig.list',
    version: '1.0.0',
    title: 'Sync Config List',
    description: 'List of sync configurations',
    domain: 'integration',
    owners: ['@integration-team'],
    tags: ['integration', 'sync', 'config', 'list'],
    stability: StabilityEnum.Experimental,
    goal: 'Show users their current sync configurations.',
    context: 'Management view for data synchronization.',
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
});

export const SyncConfigEditorPresentation = definePresentation({
  meta: {
    key: 'integration.syncConfig.editor',
    version: '1.0.0',
    title: 'Sync Config Editor',
    description: 'Editor for sync configuration settings',
    domain: 'integration',
    owners: ['@integration-team'],
    tags: ['integration', 'sync', 'config', 'editor'],
    stability: StabilityEnum.Experimental,
    goal: 'Allow users to configure schedule, filters, and settings for a sync.',
    context: 'Configuration interface for sync jobs.',
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
});

export const FieldMappingEditorPresentation = definePresentation({
  meta: {
    key: 'integration.fieldMapping.editor',
    version: '1.0.0',
    title: 'Field Mapping Editor',
    description: 'Visual field mapping editor',
    domain: 'integration',
    owners: ['@integration-team'],
    tags: ['integration', 'field-mapping', 'editor'],
    stability: StabilityEnum.Experimental,
    goal: 'Allow users to map source fields to target fields visually.',
    context: 'Schema mapping tool for data consistency.',
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
});

export const SyncRunListPresentation = definePresentation({
  meta: {
    key: 'integration.syncRun.list',
    version: '1.0.0',
    title: 'Sync Run History',
    description: 'History of sync runs',
    domain: 'integration',
    owners: ['@integration-team'],
    tags: ['integration', 'sync', 'runs', 'history'],
    stability: StabilityEnum.Experimental,
    goal: 'Provide a historical log of all sync attempts and their results.',
    context: 'Audit and troubleshooting view for sync jobs.',
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
});

export const SyncRunDetailPresentation = definePresentation({
  meta: {
    key: 'integration.syncRun.detail',
    version: '1.0.0',
    title: 'Sync Run Details',
    description: 'Detailed view of a sync run with logs',
    domain: 'integration',
    owners: ['@integration-team'],
    tags: ['integration', 'sync', 'run', 'detail'],
    stability: StabilityEnum.Experimental,
    goal: 'Show granular details and logs for a specific sync run.',
    context: 'Detailed troubleshooting view.',
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
});

export const SyncActivityPresentation = definePresentation({
  meta: {
    key: 'integration.sync.activity',
    version: '1.0.0',
    title: 'Sync Activity Monitor',
    description: 'Real-time sync activity monitor',
    domain: 'integration',
    owners: ['@integration-team'],
    tags: ['integration', 'sync', 'activity', 'realtime'],
    stability: StabilityEnum.Experimental,
    goal: 'Monitor live data flow and sync performance.',
    context: 'Real-time operations monitor.',
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
});
