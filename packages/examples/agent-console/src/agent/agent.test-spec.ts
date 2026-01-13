
import { describe, expect, it } from 'bun:test';
import { GetAgentQuery, ListAgentsQuery } from './agent.operation';
import type { TestSpec } from '@contractspec/lib.contracts';

function defineTestSpec(spec: TestSpec) {
  return spec;
}

export const agentListTest = defineTestSpec({
  meta: {
    key: 'test.agent-console.agent.list',
    version: '1.0.0',
    owners: ['@agent-console-team'],
    description: 'Test for listing agents',
    stability: 'stable',
    tags: ['test'],
  },
  target: {
    type: 'operation',
    operation: { key: 'agent-console.agent.list', version: '1.0.0' },
  },
  scenarios: [
    {
      key: 'success',
      when: { operation: { key: 'agent-console.agent.list' } },
      then: [{ type: 'expectOutput', match: {} }],
    },
    {
      key: 'error',
      when: { operation: { key: 'agent-console.agent.list' } },
      then: [{ type: 'expectError' }],
    },
  ],
});

export const agentGetTest = defineTestSpec({
  meta: {
    key: 'test.agent-console.agent.get',
    version: '1.0.0',
    owners: ['@agent-console-team'],
    description: 'Test for getting agent',
    stability: 'stable',
    tags: ['test'],
  },
  target: {
    type: 'operation',
    operation: { key: 'agent-console.agent.get', version: '1.0.0' },
  },
  scenarios: [
    {
      key: 'success',
      when: { operation: { key: 'agent-console.agent.get' } },
      then: [{ type: 'expectOutput', match: {} }],
    },
    {
      key: 'error',
      when: { operation: { key: 'agent-console.agent.get' } },
      then: [{ type: 'expectError' }],
    },
  ],
});
