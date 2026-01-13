import type { TestSpec } from '@contractspec/lib.contracts';

function defineTestSpec(spec: TestSpec) {
  return spec;
}

export const DefinitionListTest = defineTestSpec({
  meta: {
    key: 'workflow.definition.list.test',
    version: '1.0.0',
    stability: 'experimental',
    owners: ['@example.workflow-system'],
    description: 'Test for listing workflow definitions',
    tags: ['test'],
  },
  target: {
    type: 'operation',
    operation: { key: 'workflow.definition.list', version: '1.0.0' },
  },
  scenarios: [
    {
      key: 'success',
      when: { operation: { key: 'workflow.definition.list' } },
      then: [{ type: 'expectOutput', match: {} }],
    },
    {
      key: 'error',
      when: { operation: { key: 'workflow.definition.list' } },
      then: [{ type: 'expectError' }],
    },
  ],
});

export const InstanceListTest = defineTestSpec({
  meta: {
    key: 'workflow.instance.list.test',
    version: '1.0.0',
    stability: 'experimental',
    owners: ['@example.workflow-system'],
    description: 'Test for listing workflow instances',
    tags: ['test'],
  },
  target: {
    type: 'operation',
    operation: { key: 'workflow.instance.list', version: '1.0.0' },
  },
  scenarios: [
    {
      key: 'success',
      when: { operation: { key: 'workflow.instance.list' } },
      then: [{ type: 'expectOutput', match: {} }],
    },
    {
      key: 'error',
      when: { operation: { key: 'workflow.instance.list' } },
      then: [{ type: 'expectError' }],
    },
  ],
});

export const ApprovalListMineTest = defineTestSpec({
  meta: {
    key: 'workflow.approval.list.mine.test',
    version: '1.0.0',
    stability: 'experimental',
    owners: ['@example.workflow-system'],
    description: 'Test for listing my approvals',
    tags: ['test'],
  },
  target: {
    type: 'operation',
    operation: { key: 'workflow.approval.list.mine', version: '1.0.0' },
  },
  scenarios: [
    {
      key: 'success',
      when: { operation: { key: 'workflow.approval.list.mine' } },
      then: [{ type: 'expectOutput', match: {} }],
    },
    {
      key: 'error',
      when: { operation: { key: 'workflow.approval.list.mine' } },
      then: [{ type: 'expectError' }],
    },
  ],
});

export const ApprovalDecideTest = defineTestSpec({
  meta: {
    key: 'workflow.approval.decide.test',
    version: '1.0.0',
    stability: 'experimental',
    owners: ['@example.workflow-system'],
    description: 'Test for deciding on approval',
    tags: ['test'],
  },
  target: {
    type: 'operation',
    operation: { key: 'workflow.approval.decide', version: '1.0.0' },
  },
  scenarios: [
    {
      key: 'success',
      when: { operation: { key: 'workflow.approval.decide' } },
      then: [{ type: 'expectOutput', match: {} }],
    },
    {
      key: 'error',
      when: { operation: { key: 'workflow.approval.decide' } },
      then: [{ type: 'expectError' }],
    },
  ],
});
