import { describe, expect, it } from 'bun:test';
import { OPAPolicyAdapter, buildOPAInput, type OPAClient } from './opa-adapter';
import { PolicyRegistry } from './registry';
import type { PolicySpec } from './spec';
import type { DecisionContext } from './engine';
import type { PolicyDecision } from '../types';
import { StabilityEnum } from '../ownership';

class FakeOPAClient implements OPAClient {
  public lastInput: unknown;
  constructor(private readonly result: unknown) {}
  async evaluate<T>(_decisionPath: string, input: unknown): Promise<T> {
    this.lastInput = input;
    return this.result as T;
  }
}

const registry = new PolicyRegistry();

const samplePolicy: PolicySpec = {
  meta: {
    title: 'Sample Policy',
    description: 'Test policy for OPA adapter',
    domain: 'core',
    owners: ['@team.core'],
    tags: ['policy'],
    stability: StabilityEnum.Experimental,
    key: 'core.sample',
    version: '1.0.0',
  },
  rules: [
    {
      effect: 'allow',
      actions: ['read'],
    },
  ],
  consents: [
    {
      id: 'export',
      scope: 'resident',
      purpose: 'Export resident data via OPA',
      required: true,
    },
  ],
};

registry.register(samplePolicy);

const context: DecisionContext = {
  action: 'read',
  subject: { roles: ['admin'] },
  resource: { type: 'resident' },
  policies: [{ key: 'core.sample', version: '1.0.0' }],
};

const engineDecision: PolicyDecision = {
  effect: 'allow',
  reason: 'engine',
  evaluatedBy: 'engine',
};

describe('OPAPolicyAdapter', () => {
  it('builds OPA input with decision and policies', () => {
    const input = buildOPAInput(context, [samplePolicy], engineDecision);
    expect(input).toMatchObject({
      context: expect.any(Object),
      decision: engineDecision,
      policies: [
        expect.objectContaining({
          meta: samplePolicy.meta,
          rules: samplePolicy.rules,
        }),
      ],
    });
  });

  it('merges OPA evaluation result with engine decision', async () => {
    const client = new FakeOPAClient({
      effect: 'deny',
      reason: 'opa_override',
      requiredConsents: ['export'],
    });
    const adapter = new OPAPolicyAdapter(client, {
      decisionPath: 'core/authz/allow',
    });

    const decision = await adapter.evaluate(
      context,
      [samplePolicy],
      engineDecision
    );
    expect(client.lastInput).toBeDefined();
    expect(decision.effect).toBe('deny');
    expect(decision.reason).toBe('opa_override');
    expect(decision.requiredConsents?.[0]?.id).toBe('export');
    expect(decision.evaluatedBy).toBe('opa');
  });
});
