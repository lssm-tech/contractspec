import { describe, expect, test } from 'bun:test';
import {
  parseGitSourceRef,
  isGitPackRef,
  gitSourceKey,
} from '../../src/sources/git-ref.js';

describe('parseGitSourceRef', () => {
  test('parses owner/repo (defaults to main)', () => {
    const ref = parseGitSourceRef('acme/agent-rules');
    expect(ref.owner).toBe('acme');
    expect(ref.repo).toBe('agent-rules');
    expect(ref.ref).toBe('main');
    expect(ref.path).toBe('');
  });

  test('parses owner/repo@ref', () => {
    const ref = parseGitSourceRef('acme/agent-rules@v2.0');
    expect(ref.owner).toBe('acme');
    expect(ref.repo).toBe('agent-rules');
    expect(ref.ref).toBe('v2.0');
    expect(ref.path).toBe('');
  });

  test('parses owner/repo@ref:path', () => {
    const ref = parseGitSourceRef('acme/agent-rules@main:packs/security');
    expect(ref.owner).toBe('acme');
    expect(ref.repo).toBe('agent-rules');
    expect(ref.ref).toBe('main');
    expect(ref.path).toBe('packs/security');
  });

  test('parses github: prefixed ref', () => {
    const ref = parseGitSourceRef('github:acme/agent-rules@v1:src/packs');
    expect(ref.owner).toBe('acme');
    expect(ref.repo).toBe('agent-rules');
    expect(ref.ref).toBe('v1');
    expect(ref.path).toBe('src/packs');
  });

  test('parses github: prefix without ref/path', () => {
    const ref = parseGitSourceRef('github:org/repo');
    expect(ref.owner).toBe('org');
    expect(ref.repo).toBe('repo');
    expect(ref.ref).toBe('main');
    expect(ref.path).toBe('');
  });

  test('throws on invalid format (no slash)', () => {
    expect(() => parseGitSourceRef('invalid')).toThrow(
      /Invalid git source reference/
    );
  });
});

describe('isGitPackRef', () => {
  test('identifies github: prefix as git', () => {
    expect(isGitPackRef('github:acme/rules')).toBe(true);
  });

  test('identifies owner/repo pattern as git', () => {
    expect(isGitPackRef('acme/agent-rules')).toBe(true);
  });

  test('rejects local paths', () => {
    expect(isGitPackRef('./packs/my-pack')).toBe(false);
    expect(isGitPackRef('../shared-packs')).toBe(false);
    expect(isGitPackRef('/absolute/path')).toBe(false);
  });

  test('rejects npm-style refs', () => {
    expect(isGitPackRef('@scope/package')).toBe(false);
    expect(isGitPackRef('npm:some-pack')).toBe(false);
  });

  test('rejects paths with node_modules', () => {
    expect(isGitPackRef('node_modules/pack')).toBe(false);
  });
});

describe('gitSourceKey', () => {
  test('returns owner/repo string', () => {
    const ref = parseGitSourceRef('acme/agent-rules@v2:packs/security');
    expect(gitSourceKey(ref)).toBe('acme/agent-rules');
  });
});
