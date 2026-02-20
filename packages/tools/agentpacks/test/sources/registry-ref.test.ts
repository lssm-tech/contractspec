import { describe, expect, test } from 'bun:test';
import {
  parseRegistrySourceRef,
  isRegistryPackRef,
  registrySourceKey,
} from '../../src/sources/registry-ref.js';

describe('parseRegistrySourceRef', () => {
  test('parses simple pack name', () => {
    const ref = parseRegistrySourceRef('registry:typescript-best-practices');
    expect(ref.packName).toBe('typescript-best-practices');
    expect(ref.version).toBe('latest');
  });

  test('parses pack name with version', () => {
    const ref = parseRegistrySourceRef('registry:my-pack@1.2.0');
    expect(ref.packName).toBe('my-pack');
    expect(ref.version).toBe('1.2.0');
  });

  test('parses pack name with latest tag', () => {
    const ref = parseRegistrySourceRef('registry:my-pack@latest');
    expect(ref.packName).toBe('my-pack');
    expect(ref.version).toBe('latest');
  });

  test('throws on empty source', () => {
    expect(() => parseRegistrySourceRef('registry:')).toThrow(
      'Expected pack name'
    );
  });

  test('throws on invalid pack name characters', () => {
    expect(() => parseRegistrySourceRef('registry:My_Invalid_Pack')).toThrow(
      'lowercase alphanumeric'
    );
  });

  test('throws on pack name starting with hyphen', () => {
    expect(() => parseRegistrySourceRef('registry:-bad-name')).toThrow(
      'lowercase alphanumeric'
    );
  });

  test('allows single character pack name', () => {
    const ref = parseRegistrySourceRef('registry:a');
    expect(ref.packName).toBe('a');
  });

  test('handles numeric pack names', () => {
    const ref = parseRegistrySourceRef('registry:pack123');
    expect(ref.packName).toBe('pack123');
    expect(ref.version).toBe('latest');
  });
});

describe('isRegistryPackRef', () => {
  test('returns true for registry: prefix', () => {
    expect(isRegistryPackRef('registry:my-pack')).toBe(true);
  });

  test('returns false for git prefix', () => {
    expect(isRegistryPackRef('github:org/repo')).toBe(false);
  });

  test('returns false for npm prefix', () => {
    expect(isRegistryPackRef('npm:package')).toBe(false);
  });

  test('returns false for local path', () => {
    expect(isRegistryPackRef('./local/pack')).toBe(false);
  });
});

describe('registrySourceKey', () => {
  test('builds canonical key', () => {
    const ref = parseRegistrySourceRef('registry:my-pack@1.0.0');
    expect(registrySourceKey(ref)).toBe('registry:my-pack');
  });
});
