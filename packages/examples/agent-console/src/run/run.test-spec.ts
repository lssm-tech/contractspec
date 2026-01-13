import { defineTestSpec } from '@contractspec/lib.contracts';

export const runListTest = defineTestSpec({
  meta: {
    key: 'test.agent.run.list',
    version: '1.0.0',
    owners: ['@agent-console-team'],
    description: 'Test for listing runs',
    stability: 'stable',
    tags: ['test'],
  },
  target: {
    type: 'operation',
    operation: { key: 'agent.run.list', version: '1.0.0' },
  },
  scenarios: [
    {
      key: 'success',
      when: { operation: { key: 'agent.run.list' } },
      then: [{ type: 'expectOutput', match: {} }],
    },
    {
      key: 'error',
      when: { operation: { key: 'agent.run.list' } },
      then: [{ type: 'expectError' }],
    },
  ],
});

export const runGetTest = defineTestSpec({
  meta: {
    key: 'test.agent.run.get',
    version: '1.0.0',
    owners: ['@agent-console-team'],
    description: 'Test for getting run',
    stability: 'stable',
    tags: ['test'],
  },
  target: {
    type: 'operation',
    operation: { key: 'agent.run.get', version: '1.0.0' },
  },
  scenarios: [
    {
      key: 'success',
      when: { operation: { key: 'agent.run.get' } },
      then: [{ type: 'expectOutput', match: {} }],
    },
    {
      key: 'error',
      when: { operation: { key: 'agent.run.get' } },
      then: [{ type: 'expectError' }],
    },
  ],
});
