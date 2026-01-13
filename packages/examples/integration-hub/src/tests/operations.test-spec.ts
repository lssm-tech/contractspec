import { defineTestSpec } from '@contractspec/lib.contracts';

export const SyncConfigCreateTest = defineTestSpec({
  meta: {
    key: 'integration.syncConfig.create.test',
    version: '1.0.0',
    stability: 'experimental',
    owners: ['@example.integration-hub'],
    description: 'Test for creating sync config',
    tags: ['test'],
  },
  target: {
    type: 'operation',
    operation: { key: 'integration.syncConfig.create', version: '1.0.0' },
  },
  scenarios: [
    {
      key: 'success',
      when: { operation: { key: 'integration.syncConfig.create' } },
      then: [{ type: 'expectOutput', match: {} }],
    },
    {
      key: 'error',
      when: { operation: { key: 'integration.syncConfig.create' } },
      then: [{ type: 'expectError' }],
    },
  ],
});

export const FieldMappingAddTest = defineTestSpec({
  meta: {
    key: 'integration.fieldMapping.add.test',
    version: '1.0.0',
    stability: 'experimental',
    owners: ['@example.integration-hub'],
    description: 'Test for adding field mapping',
    tags: ['test'],
  },
  target: {
    type: 'operation',
    operation: { key: 'integration.fieldMapping.add', version: '1.0.0' },
  },
  scenarios: [
    {
      key: 'success',
      when: { operation: { key: 'integration.fieldMapping.add' } },
      then: [{ type: 'expectOutput', match: {} }],
    },
    {
      key: 'error',
      when: { operation: { key: 'integration.fieldMapping.add' } },
      then: [{ type: 'expectError' }],
    },
  ],
});

export const SyncRunListTest = defineTestSpec({
  meta: {
    key: 'integration.syncRun.list.test',
    version: '1.0.0',
    stability: 'experimental',
    owners: ['@example.integration-hub'],
    description: 'Test for listing sync runs',
    tags: ['test'],
  },
  target: {
    type: 'operation',
    operation: { key: 'integration.syncRun.list', version: '1.0.0' },
  },
  scenarios: [
    {
      key: 'success',
      when: { operation: { key: 'integration.syncRun.list' } },
      then: [{ type: 'expectOutput', match: {} }],
    },
    {
      key: 'error',
      when: { operation: { key: 'integration.syncRun.list' } },
      then: [{ type: 'expectError' }],
    },
  ],
});
