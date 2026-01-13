function defineTestSpec(spec: TestSpec) {
  return spec;
}

export const toolListTest = defineTestSpec({
  meta: {
    key: 'test.agent.tool.list',
    version: '1.0.0',
    owners: ['@agent-console-team'],
    description: 'Test for listing tools',
    stability: 'stable',
    tags: ['test'],
  },
  target: {
    type: 'operation',
    operation: { key: 'agent.tool.list', version: '1.0.0' },
  },
  scenarios: [
    {
      key: 'success',
      when: { operation: { key: 'agent.tool.list' } },
      then: [{ type: 'expectOutput', match: {} }],
    },
    {
      key: 'error',
      when: { operation: { key: 'agent.tool.list' } },
      then: [{ type: 'expectError' }],
    },
  ],
});

export const toolGetTest = defineTestSpec({
  meta: {
    key: 'test.agent.tool.get',
    version: '1.0.0',
    owners: ['@agent-console-team'],
    description: 'Test for getting tool',
    stability: 'stable',
    tags: ['test'],
  },
  target: {
    type: 'operation',
    operation: { key: 'agent.tool.get', version: '1.0.0' },
  },
  scenarios: [
    {
      key: 'success',
      when: { operation: { key: 'agent.tool.get' } },
      then: [{ type: 'expectOutput', match: {} }],
    },
    {
      key: 'error',
      when: { operation: { key: 'agent.tool.get' } },
      then: [{ type: 'expectError' }],
    },
  ],
});
