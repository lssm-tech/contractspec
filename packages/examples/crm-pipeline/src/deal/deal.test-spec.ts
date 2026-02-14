import { defineTestSpec } from '@contractspec/lib.contracts-spec/tests';

export const dealListTest = defineTestSpec({
  meta: {
    key: 'test.crm.deal.list',
    version: '1.0.0',
    owners: ['@example.crm-pipeline'],
    description: 'Test for listing deals',
    stability: 'stable',
    tags: ['test'],
  },
  target: {
    type: 'operation',
    operation: { key: 'crm.deal.list', version: '1.0.0' },
  },
  scenarios: [
    {
      key: 'success',
      when: { operation: { key: 'crm.deal.list' } },
      then: [{ type: 'expectOutput', match: {} }],
    },
    {
      key: 'error',
      when: { operation: { key: 'crm.deal.list' } },
      then: [{ type: 'expectError' }],
    },
  ],
});

export const dealMoveTest = defineTestSpec({
  meta: {
    key: 'test.crm.deal.move',
    version: '1.0.0',
    owners: ['@example.crm-pipeline'],
    description: 'Test for moving deal',
    stability: 'stable',
    tags: ['test'],
  },
  target: {
    type: 'operation',
    operation: { key: 'crm.deal.move', version: '1.0.0' },
  },
  scenarios: [
    {
      key: 'success',
      when: { operation: { key: 'crm.deal.move' } },
      then: [{ type: 'expectOutput', match: {} }],
    },
    {
      key: 'error',
      when: { operation: { key: 'crm.deal.move' } },
      then: [{ type: 'expectError' }],
    },
  ],
});
