import { describe, it, expect } from 'bun:test';
import { generateOperationSpec } from './operation.template';
import type { OperationSpecData } from '../types';

describe('generateOperationSpec', () => {
  it('should generate valid command spec', () => {
    const data: OperationSpecData = {
      kind: 'command',
      name: 'user.signup',
      version: '1.0.0',
      description: 'Start user signup flow',
      goal: 'Allow users to create accounts',
      context: 'Email-based signup with magic link',
      stability: 'stable',
      owners: ['@team'],
      tags: ['auth', 'signup'],
      auth: 'anonymous',
      hasInput: true,
      hasOutput: true,
      flags: ['signup_v2'],
      emitsEvents: true,
    };

    const code = generateOperationSpec(data);

    // Should contain key elements
    expect(code).toContain('defineCommand');
    expect(code).toContain('user.signup');
    expect(code).toContain("version: '1.0.0'");
    expect(code).toContain("stability: 'stable'");
    expect(code).toContain('@team');
    expect(code).toContain('SchemaModel');
    expect(code).toContain('SignupInput');
    expect(code).toContain('SignupOutput');
  });

  it('should generate valid query spec', () => {
    const data: OperationSpecData = {
      kind: 'query',
      name: 'user.getProfile',
      version: '1.0.0',
      description: 'Get user profile',
      goal: 'Retrieve user data',
      context: 'Read-only profile access',
      stability: 'beta',
      owners: ['@team'],
      tags: ['user'],
      auth: 'user',
      hasInput: true,
      hasOutput: true,
      flags: [],
      emitsEvents: false,
    };

    const code = generateOperationSpec(data);

    expect(code).toContain('defineQuery');
    expect(code).toContain('user.getProfile');
    expect(code).toContain("method: 'GET'");
  });

  it('should handle flags correctly', () => {
    const withFlags: OperationSpecData = {
      kind: 'command',
      name: 'test.operation',
      version: '1.0.0',
      description: 'Test',
      goal: 'Test',
      context: 'Test',
      stability: 'experimental',
      owners: ['@team'],
      tags: [],
      auth: 'user',
      hasInput: false,
      hasOutput: true,
      flags: ['feature_a', 'feature_b'],
      emitsEvents: false,
    };

    const code = generateOperationSpec(withFlags);
    expect(code).toContain("'feature_a'");
    expect(code).toContain("'feature_b'");
  });
});
