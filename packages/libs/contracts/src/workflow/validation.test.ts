import { describe, expect, it } from 'vitest';
import { ScalarTypeEnum, SchemaModel } from '@lssm/lib.schema';
import { WorkflowRegistry, type WorkflowSpec } from './spec';
import {
  assertWorkflowSpecValid,
  validateWorkflowSpec,
  type WorkflowValidationIssue,
} from './validation';
import { StabilityEnum, OwnersEnum, TagsEnum } from '../ownership';
import { SpecRegistry } from '../registry';
import type { ContractSpec } from '../spec';
import { FormRegistry, type FormSpec } from '../forms';

const DummyModel = new SchemaModel({
  name: 'DummyModel',
  fields: {
    ok: { type: ScalarTypeEnum.Boolean(), isOptional: false },
  },
});

function createOperation(
  name: string,
  version: number
): ContractSpec<typeof DummyModel, typeof DummyModel> {
  return {
    meta: {
      name,
      version,
      kind: 'command',
      stability: StabilityEnum.Experimental,
      owners: [OwnersEnum.PlatformSigil],
      tags: [TagsEnum.Auth],
      description: 'Dummy operation for tests',
      goal: 'Test',
      context: 'Testing',
    },
    io: {
      input: DummyModel,
      output: DummyModel,
    },
    policy: {
      auth: 'user',
    },
    sideEffects: {},
  };
}

function createForm(key: string, version: number): FormSpec<typeof DummyModel> {
  return {
    meta: {
      key,
      version,
      title: 'Test Form',
      description: 'Testing form',
      domain: 'testing',
      owners: [OwnersEnum.PlatformSigil],
      tags: [TagsEnum.Auth],
      stability: StabilityEnum.Experimental,
    },
    model: DummyModel,
    fields: [],
  };
}

function sampleWorkflowSpec(): WorkflowSpec {
  return {
    meta: {
      name: 'sigil.workflow.sample',
      version: 1,
      title: 'Sample Workflow',
      description: 'Workflow used in tests',
      domain: 'testing',
      owners: [OwnersEnum.PlatformSigil],
      tags: [TagsEnum.Auth],
      stability: StabilityEnum.Experimental,
    },
    definition: {
      entryStepId: 'start',
      steps: [
        {
          id: 'start',
          type: 'automation',
          label: 'Start',
          action: { operation: { name: 'sigil.start', version: 1 } },
        },
        {
          id: 'review',
          type: 'human',
          label: 'Review',
          action: { form: { key: 'reviewForm', version: 1 } },
        },
        {
          id: 'finish',
          type: 'automation',
          label: 'Finish',
          action: { operation: { name: 'sigil.finish', version: 1 } },
        },
      ],
      transitions: [
        { from: 'start', to: 'review' },
        { from: 'review', to: 'finish' },
      ],
    },
  };
}

function errors(issues: WorkflowValidationIssue[]) {
  return issues.filter((issue) => issue.level === 'error');
}

describe('WorkflowRegistry', () => {
  it('registers workflows and retrieves the latest version by name', () => {
    const registry = new WorkflowRegistry();
    const specV1 = sampleWorkflowSpec();
    registry.register(specV1);

    const specV2: WorkflowSpec = {
      ...specV1,
      meta: { ...specV1.meta, version: 2 },
    };
    registry.register(specV2);

    expect(registry.get(specV1.meta.name)).toEqual(specV2);
    expect(registry.get(specV1.meta.name, 1)).toEqual(specV1);
  });

  it('rejects duplicate workflow versions', () => {
    const registry = new WorkflowRegistry();
    const spec = sampleWorkflowSpec();
    registry.register(spec);
    expect(() => registry.register(spec)).toThrowError(/Duplicate workflow/);
  });
});

describe('validateWorkflowSpec', () => {
  it('returns no errors for a valid workflow', () => {
    const spec = sampleWorkflowSpec();
    const operations = new SpecRegistry();
    operations.register(createOperation('sigil.start', 1));
    operations.register(createOperation('sigil.finish', 1));
    const forms = new FormRegistry();
    forms.register(createForm('reviewForm', 1));

    const issues = validateWorkflowSpec(spec, { operations, forms });
    expect(errors(issues)).toHaveLength(0);
    expect(() =>
      assertWorkflowSpecValid(spec, { operations, forms })
    ).not.toThrow();
  });

  it('flags transitions pointing to unknown steps', () => {
    const spec = sampleWorkflowSpec();
    spec.definition.transitions.push({ from: 'finish', to: 'missing' });
    const issues = validateWorkflowSpec(spec);
    expect(errors(issues)).toHaveLength(1);
    expect(errors(issues)[0]?.message).toMatch(/unknown "to" step "missing"/);
  });

  it('flags unreachable steps', () => {
    const spec = sampleWorkflowSpec();
    spec.definition.steps.push({
      id: 'ghost',
      type: 'automation',
      label: 'Ghost',
    });
    const issues = validateWorkflowSpec(spec);
    expect(errors(issues)).toHaveLength(1);
    expect(errors(issues)[0]?.message).toMatch(/unreachable/);
  });

  it('detects cycles in transitions', () => {
    const spec = sampleWorkflowSpec();
    spec.definition.transitions.push({ from: 'finish', to: 'start' });
    const issues = validateWorkflowSpec(spec);
    expect(errors(issues).some((issue) => /cycle/.test(issue.message))).toBe(
      true
    );
  });

  it('flags missing operation references when registry provided', () => {
    const spec = sampleWorkflowSpec();
    const operations = new SpecRegistry();
    operations.register(createOperation('sigil.start', 1));
    const issues = validateWorkflowSpec(spec, { operations });
    expect(
      errors(issues).some((issue) => /unknown operation/.test(issue.message))
    ).toBe(true);
  });

  it('flags missing form references when registry provided', () => {
    const spec = sampleWorkflowSpec();
    const forms = new FormRegistry();
    const issues = validateWorkflowSpec(spec, { forms });
    expect(
      errors(issues).some((issue) => /unknown form/.test(issue.message))
    ).toBe(true);
  });
});
