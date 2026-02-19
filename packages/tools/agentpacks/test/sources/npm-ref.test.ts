import { describe, expect, test } from 'bun:test';
import {
  parseNpmSourceRef,
  isNpmPackRef,
  npmSourceKey,
} from '../../src/sources/npm-ref.js';

describe('parseNpmSourceRef', () => {
  test('parses bare package name (defaults to latest)', () => {
    const ref = parseNpmSourceRef('npm:my-agent-rules');
    expect(ref.packageName).toBe('my-agent-rules');
    expect(ref.version).toBe('latest');
    expect(ref.path).toBe('');
  });

  test('parses scoped package', () => {
    const ref = parseNpmSourceRef('@acme/agent-rules');
    expect(ref.packageName).toBe('@acme/agent-rules');
    expect(ref.version).toBe('latest');
    expect(ref.path).toBe('');
  });

  test('parses package with version', () => {
    const ref = parseNpmSourceRef('npm:my-rules@2.1.0');
    expect(ref.packageName).toBe('my-rules');
    expect(ref.version).toBe('2.1.0');
    expect(ref.path).toBe('');
  });

  test('parses scoped package with version', () => {
    const ref = parseNpmSourceRef('@acme/rules@^3.0.0');
    expect(ref.packageName).toBe('@acme/rules');
    expect(ref.version).toBe('^3.0.0');
    expect(ref.path).toBe('');
  });

  test('parses package with version and path', () => {
    const ref = parseNpmSourceRef('npm:my-rules@1.0.0:packs/security');
    expect(ref.packageName).toBe('my-rules');
    expect(ref.version).toBe('1.0.0');
    expect(ref.path).toBe('packs/security');
  });

  test('parses scoped package with version and path', () => {
    const ref = parseNpmSourceRef('@acme/rules@2.0:packs/base');
    expect(ref.packageName).toBe('@acme/rules');
    expect(ref.version).toBe('2.0');
    expect(ref.path).toBe('packs/base');
  });

  test('parses scoped package with path but no version', () => {
    const ref = parseNpmSourceRef('@acme/rules:packs/base');
    expect(ref.packageName).toBe('@acme/rules');
    expect(ref.version).toBe('latest');
    expect(ref.path).toBe('packs/base');
  });

  test('throws on empty source', () => {
    expect(() => parseNpmSourceRef('npm:')).toThrow(/Invalid npm source/);
  });
});

describe('isNpmPackRef', () => {
  test('identifies npm: prefix', () => {
    expect(isNpmPackRef('npm:some-pack')).toBe(true);
  });

  test('identifies scoped packages', () => {
    expect(isNpmPackRef('@acme/agent-rules')).toBe(true);
  });

  test('rejects local paths', () => {
    expect(isNpmPackRef('./packs/local')).toBe(false);
    expect(isNpmPackRef('../other')).toBe(false);
  });

  test('rejects git-style refs', () => {
    expect(isNpmPackRef('github:acme/rules')).toBe(false);
  });

  test('rejects bare owner/repo (git pattern)', () => {
    expect(isNpmPackRef('acme/rules')).toBe(false);
  });
});

describe('npmSourceKey', () => {
  test('returns npm: prefixed package name', () => {
    const ref = parseNpmSourceRef('@acme/rules@2.0:packs/security');
    expect(npmSourceKey(ref)).toBe('npm:@acme/rules');
  });

  test('returns key for unscoped package', () => {
    const ref = parseNpmSourceRef('npm:my-rules@1.0.0');
    expect(npmSourceKey(ref)).toBe('npm:my-rules');
  });
});
