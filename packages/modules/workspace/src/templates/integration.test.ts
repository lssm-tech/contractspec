import { describe, expect, it } from 'bun:test';
import { generateIntegrationSpec } from './integration';
import type { IntegrationSpecData } from '../types/spec-types';

describe('generateIntegrationSpec', () => {
  const baseData: IntegrationSpecData = {
    name: 'test.integration',
    version: '1',
    description: 'Test integration',
    owners: ['team-a'],
    tags: ['test'],
    stability: 'stable',
    title: 'Test Integration',
    domain: 'test-domain',
    displayName: 'Test Integration',
    category: 'custom',
    supportedModes: ['managed'],
    capabilitiesProvided: [],
    capabilitiesRequired: [],
    configFields: [],
    secretFields: [],
    healthCheckMethod: 'ping',
  };

  it('generates an integration spec', () => {
    const code = generateIntegrationSpec(baseData);
    expect(code).toContain(
      "import { StabilityEnum } from '@contractspec/lib.contracts/ownership'"
    );
    expect(code).toContain(
      'export const IntegrationIntegrationSpec: IntegrationSpec = {'
    );
    expect(code).toContain("category: 'custom'");
    expect(code).toContain("supportedModes: ['managed']");
  });

  it('includes capabilities', () => {
    const data: IntegrationSpecData = {
      ...baseData,
      capabilitiesProvided: [{ key: 'cap.a', version: '1' }],
      capabilitiesRequired: [{ key: 'cap.b', version: '1' }],
    };
    const code = generateIntegrationSpec(data);
    expect(code).toContain('provides: [');
    expect(code).toContain("key: 'cap.a'");
    expect(code).toContain('requires: [');
    expect(code).toContain("key: 'cap.b'");
  });

  it('renders config and secret schemas', () => {
    const data: IntegrationSpecData = {
      ...baseData,
      configFields: [{ key: 'apiKey', type: 'string', required: true }],
      secretFields: [{ key: 'apiSecret', type: 'string', required: true }],
    };
    const code = generateIntegrationSpec(data);
    expect(code).toContain("apiKey: { type: 'string' }");
    expect(code).toContain("apiSecret: { type: 'string' }");
  });

  it('renders byok setup if mode is supported', () => {
    const data: IntegrationSpecData = {
      ...baseData,
      supportedModes: ['byok'],
      byokSetupInstructions: 'Enter your keys',
      byokRequiredScopes: ['scope.read'],
    };
    const code = generateIntegrationSpec(data);
    expect(code).toContain('byokSetup: {');
    expect(code).toContain("setupInstructions: 'Enter your keys'");
    expect(code).toContain("requiredScopes: ['scope.read']");
  });
});
