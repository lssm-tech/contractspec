import { describe, expect, it } from 'bun:test';
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
    key: 'core.default',
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
      effect: 'allow',
      actions: ['write'],
      relationships: [
        {
          relation: 'manager_of',
          objectId: '$resource',
          objectType: 'resident',
        },
      ],
      resource: { type: 'resident' },
      reason: 'Managers can update assigned residents',
    },
    {
      effect: 'allow',
      actions: ['export'],
      subject: { roles: ['admin'] },
      resource: { type: 'resident' },
      requiresConsent: ['resident_export'],
      rateLimit: 'resident_export',
      reason: 'Exports require explicit resident consent',
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
  consents: [
    {
      id: 'resident_export',
      scope: 'resident',
      purpose: 'Export resident data',
      description: 'Allows exporting resident data outside the platform',
      expiresInDays: 365,
      required: true,
    },
  ],
  rateLimits: [
    {
      id: 'resident_export',
      rpm: 10,
      key: 'resident-export',
      windowSeconds: 60,
    },
  ],
};

describe('PolicyEngine', () => {
  const registry = new PolicyRegistry().register(policy);
  const engine = new PolicyEngine(registry);

  it('allows matching admin subject', () => {
    const decision = engine.decide({
      action: 'read',
      subject: { roles: ['admin'] },
      resource: { type: 'resident' },
      policies: [{ key: 'core.default', version: 1 }],
    });
    expect(decision.effect).toBe('allow');
    expect(decision.pii?.fields).toContain('contact.email');
  });

  it('denies suspended users even if another policy allows', () => {
    const decision = engine.decide({
      action: 'read',
      subject: { roles: ['user', 'suspended'] },
      resource: { type: 'resident' },
      policies: [{ key: 'core.default', version: 1 }],
    });
    expect(decision.effect).toBe('deny');
    expect(decision.reason).toBe('Suspended users cannot read residents');
  });

  it('provides field-level decisions', () => {
    const decision = engine.decide({
      action: 'read',
      subject: { roles: ['agent'] },
      resource: { type: 'resident', fields: ['contact.email'] },
      policies: [{ key: 'core.default', version: 1 }],
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

  it('requires consent before export', () => {
    const decision = engine.decide({
      action: 'export',
      subject: { roles: ['admin'] },
      resource: { type: 'resident' },
      policies: [{ key: 'core.default', version: 1 }],
    });
    expect(decision.effect).toBe('deny');
    expect(decision.reason).toBe('consent_required');
    expect(decision.requiredConsents?.[0]?.id).toBe('resident_export');
  });

  it('applies rate limits and allows when consent granted', () => {
    const decision = engine.decide({
      action: 'export',
      subject: { roles: ['admin'] },
      resource: { type: 'resident' },
      policies: [{ key: 'core.default', version: 1 }],
      consents: ['resident_export'],
    });
    expect(decision.effect).toBe('allow');
    expect(decision.rateLimit).toEqual({
      rpm: 10,
      key: 'resident-export',
      windowSeconds: 60,
      burst: undefined,
    });
  });

  it('honors relationship requirements', () => {
    const decision = engine.decide({
      action: 'write',
      subject: {
        roles: ['manager'],
        relationships: [
          {
            relation: 'manager_of',
            object: 'resident-123',
            objectType: 'resident',
          },
        ],
      },
      resource: { type: 'resident', id: 'resident-123' },
      policies: [{ key: 'core.default', version: 1 }],
    });
    expect(decision.effect).toBe('allow');
    expect(decision.reason).toBe('Managers can update assigned residents');
  });

  it('denies when relationship requirements are not met', () => {
    const decision = engine.decide({
      action: 'write',
      subject: { roles: ['manager'] },
      resource: { type: 'resident', id: 'resident-123' },
      policies: [{ key: 'core.default', version: 1 }],
    });
    expect(decision.effect).toBe('deny');
  });
});
