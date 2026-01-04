import { describe, expect, it } from 'bun:test';
import { generateWorkflowSpec } from './workflow';
import type { WorkflowSpecData } from '../types/spec-types';

describe('generateWorkflowSpec', () => {
  const baseData: WorkflowSpecData = {
    name: 'test.workflow',
    version: '1',
    description: 'Test workflow',
    owners: ['team-a'],
    tags: ['test'],
    stability: 'stable',
    title: 'Test Workflow',
    domain: 'test-domain',
    steps: [],
    transitions: [],
    policyFlags: [],
  };

  it('generates a workflow spec', () => {
    const code = generateWorkflowSpec(baseData);
    expect(code).toContain("import type { WorkflowSpec } from '@contractspec/lib.contracts/workflow'");
    expect(code).toContain('export const Test_workflowWorkflow: WorkflowSpec = {');
    expect(code).toContain("title: 'Test Workflow'");
  });

  it('renders steps', () => {
    const data: WorkflowSpecData = {
      ...baseData,
      steps: [
        {
          id: 'step1',
          type: 'human',
          label: 'Step 1',
          operation: { name: 'op.a', version: '1' },
          form: { key: 'form.a', version: '1' },
        },
      ],
    };
    const code = generateWorkflowSpec(data);
    expect(code).toContain("id: 'step1'");
    expect(code).toContain("type: 'human'");
    expect(code).toContain("label: 'Step 1'");
    expect(code).toContain("operation: { name: 'op.a', version: 1 }");
    expect(code).toContain("form: { key: 'form.a', version: 1 }");
  });

  it('renders transitions', () => {
    const data: WorkflowSpecData = {
      ...baseData,
      transitions: [
        { from: 'step1', to: 'step2', condition: 'valid' },
      ],
    };
    const code = generateWorkflowSpec(data);
    expect(code).toContain("from: 'step1'");
    expect(code).toContain("to: 'step2'");
    expect(code).toContain("condition: 'valid'");
  });

  it('renders policy flags', () => {
    const data: WorkflowSpecData = {
      ...baseData,
      policyFlags: ['flag-a'],
    };
    const code = generateWorkflowSpec(data);
    expect(code).toContain("flags: ['flag-a']");
  });
});
