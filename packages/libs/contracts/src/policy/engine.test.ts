import { describe, expect, it } from 'vitest';
import { PolicyEngine } from './engine';
import { PolicyRegistry, type PolicySpec } from './spec';
import { StabilityEnum, type Tag, type Owner } from '../ownership';

const baseMeta = {
  title: 'Core Policy' as const,
  description: 'Default policy' as const,
  domain: 'core' as const,
  owners: ['@team.core'] as Owner[],
  tags: ['policy'] as Tag[],
  stability: StabilityEnum.Experimental,
} as const;

const policy: PolicySpec = {
  meta: {
    ...baseMeta,
    name: 'core.default',
    version: 1,
    scope: 'global',
  },
  rules: [
    {
      effect: 'allow',
      actions: ['read'],
      subject: { roles: ['admin'] },
      resource: { type: 'resident' },
    },
    {
      effect: 'deny',
      actions: ['read'],
      subject: { roles: ['suspended'] },
      resource: { type: 'resident' },
      reason: 'Suspended users cannot read residents',
    },
  ],
  fieldPolicies: [
    {
      effect: 'deny',
      field: 'contact.email',
      actions: ['read'],
      subject: { roles: ['agent'] },
    },
    {
      effect: 'allow',
      field: 'contact.email',
      actions: ['read'],
      subject: { roles: ['admin'] },
    },
  ],
  pii: {
    fields: ['contact.email'],
    consentRequired: true,
  },
};

describe('PolicyEngine', () => {
  const registry = new PolicyRegistry().register(policy);
  const engine = new PolicyEngine(registry);

  it('allows matching admin subject', () => {
    const decision = engine.decide({
      action: 'read',
      subject: { roles: ['admin'] },
      resource: { type: 'resident' },
      policies: [{ name: 'core.default', version: 1 }],
    });
    expect(decision.effect).toBe('allow');
    expect(decision.pii?.fields).toContain('contact.email');
  });

  it('denies suspended users even if another policy allows', () => {
    const decision = engine.decide({
      action: 'read',
      subject: { roles: ['user', 'suspended'] },
      resource: { type: 'resident' },
      policies: [{ name: 'core.default', version: 1 }],
    });
    expect(decision.effect).toBe('deny');
    expect(decision.reason).toBe('Suspended users cannot read residents');
  });

  it('provides field-level decisions', () => {
    const decision = engine.decide({
      action: 'read',
      subject: { roles: ['agent'] },
      resource: { type: 'resident', fields: ['contact.email'] },
      policies: [{ name: 'core.default', version: 1 }],
    });
    expect(decision.effect).toBe('deny');
    expect(decision.fieldDecisions).toEqual([
      {
        field: 'contact.email',
        effect: 'deny',
        reason: 'core.default',
      },
    ]);
  });
});

