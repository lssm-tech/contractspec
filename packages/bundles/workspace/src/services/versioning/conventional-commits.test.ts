/**
 * Conventional commits test suite.
 */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { describe, it, expect } from 'bun:test';
import {
  parseConventionalCommit,
  isConventionalCommit,
  getBumpTypeFromCommit,
  getHighestBumpType,
  commitToChangeEntry,
  filterCommitsByScope,
  filterBumpableCommits,
  DEFAULT_COMMIT_TYPE_MAP,
} from './conventional-commits';

describe('conventional-commits', () => {
  describe('parseConventionalCommit', () => {
    it('should parse a simple feat commit', () => {
      const result = parseConventionalCommit('feat: add new feature');
      expect(result).not.toBeNull();
      expect(result?.type).toBe('feat');
      expect(result?.description).toBe('add new feature');
      expect(result?.breaking).toBe(false);
      expect(result?.scope).toBeUndefined();
    });

    it('should parse a commit with scope', () => {
      const result = parseConventionalCommit('fix(auth): resolve login bug');
      expect(result).not.toBeNull();
      expect(result?.type).toBe('fix');
      expect(result?.scope).toBe('auth');
      expect(result?.description).toBe('resolve login bug');
    });

    it('should parse a breaking change with !', () => {
      const result = parseConventionalCommit('feat!: breaking API change');
      expect(result).not.toBeNull();
      expect(result?.breaking).toBe(true);
    });

    it('should parse a breaking change with scope and !', () => {
      const result = parseConventionalCommit(
        'feat(api)!: remove deprecated endpoint'
      );
      expect(result).not.toBeNull();
      expect(result?.type).toBe('feat');
      expect(result?.scope).toBe('api');
      expect(result?.breaking).toBe(true);
    });

    it('should parse BREAKING CHANGE in body', () => {
      const message = `feat: new feature

BREAKING CHANGE: This changes the API`;
      const result = parseConventionalCommit(message);
      expect(result).not.toBeNull();
      expect(result?.breaking).toBe(true);
      expect(result?.breakingDescription).toBe('This changes the API');
    });

    it('should return null for non-conventional commit', () => {
      const result = parseConventionalCommit('random commit message');
      expect(result).toBeNull();
    });

    it('should return null for empty message', () => {
      const result = parseConventionalCommit('');
      expect(result).toBeNull();
    });
  });

  describe('isConventionalCommit', () => {
    it('should return true for valid conventional commit', () => {
      expect(isConventionalCommit('feat: something')).toBe(true);
      expect(isConventionalCommit('fix(scope): something')).toBe(true);
    });

    it('should return false for invalid commit', () => {
      expect(isConventionalCommit('random message')).toBe(false);
    });
  });

  describe('getBumpTypeFromCommit', () => {
    it('should return major for breaking changes', () => {
      const commit = parseConventionalCommit('feat!: breaking change');
      expect(getBumpTypeFromCommit(commit!)).toBe('major');
    });

    it('should return minor for feat', () => {
      const commit = parseConventionalCommit('feat: new feature');
      expect(getBumpTypeFromCommit(commit!)).toBe('minor');
    });

    it('should return patch for fix', () => {
      const commit = parseConventionalCommit('fix: bug fix');
      expect(getBumpTypeFromCommit(commit!)).toBe('patch');
    });

    it('should return null for docs', () => {
      const commit = parseConventionalCommit('docs: update readme');
      expect(getBumpTypeFromCommit(commit!)).toBeNull();
    });

    it('should return null for chore', () => {
      const commit = parseConventionalCommit('chore: update deps');
      expect(getBumpTypeFromCommit(commit!)).toBeNull();
    });

    it('should use custom type map', () => {
      const commit = parseConventionalCommit('custom: something');
      const customMap = {
        ...DEFAULT_COMMIT_TYPE_MAP,
        custom: 'minor' as const,
      };
      expect(getBumpTypeFromCommit(commit!, customMap)).toBe('minor');
    });
  });

  describe('getHighestBumpType', () => {
    it('should return major if any commit is breaking', () => {
      const commits = [
        parseConventionalCommit('fix: bug fix')!,
        parseConventionalCommit('feat!: breaking')!,
        parseConventionalCommit('feat: feature')!,
      ];
      expect(getHighestBumpType(commits)).toBe('major');
    });

    it('should return minor if highest is feat', () => {
      const commits = [
        parseConventionalCommit('fix: bug fix')!,
        parseConventionalCommit('feat: feature')!,
        parseConventionalCommit('docs: docs')!,
      ];
      expect(getHighestBumpType(commits)).toBe('minor');
    });

    it('should return patch if only fixes', () => {
      const commits = [
        parseConventionalCommit('fix: bug fix')!,
        parseConventionalCommit('chore: update')!,
      ];
      expect(getHighestBumpType(commits)).toBe('patch');
    });

    it('should return null if no bumpable commits', () => {
      const commits = [
        parseConventionalCommit('docs: readme')!,
        parseConventionalCommit('chore: update')!,
      ];
      expect(getHighestBumpType(commits)).toBeNull();
    });
  });

  describe('commitToChangeEntry', () => {
    it('should convert feat to added', () => {
      const commit = parseConventionalCommit('feat: new feature')!;
      const entry = commitToChangeEntry(commit);
      expect(entry.type).toBe('added');
      expect(entry.description).toBe('new feature');
    });

    it('should convert fix to fixed', () => {
      const commit = parseConventionalCommit('fix: bug fix')!;
      const entry = commitToChangeEntry(commit);
      expect(entry.type).toBe('fixed');
    });

    it('should convert breaking to breaking', () => {
      const commit = parseConventionalCommit('feat!: breaking change')!;
      const entry = commitToChangeEntry(commit);
      expect(entry.type).toBe('breaking');
    });

    it('should include scope as path', () => {
      const commit = parseConventionalCommit('feat(auth): login feature')!;
      const entry = commitToChangeEntry(commit);
      expect(entry.path).toBe('auth');
    });
  });

  describe('filterCommitsByScope', () => {
    it('should filter commits by scope', () => {
      const commits = [
        parseConventionalCommit('feat(auth): login')!,
        parseConventionalCommit('feat(api): endpoint')!,
        parseConventionalCommit('feat(auth): logout')!,
      ];
      const filtered = filterCommitsByScope(commits, 'auth');
      expect(filtered).toHaveLength(2);
    });

    it('should be case insensitive', () => {
      const commits = [parseConventionalCommit('feat(Auth): login')!];
      const filtered = filterCommitsByScope(commits, 'auth');
      expect(filtered).toHaveLength(1);
    });
  });

  describe('filterBumpableCommits', () => {
    it('should filter out non-bumpable commits', () => {
      const commits = [
        parseConventionalCommit('feat: feature')!,
        parseConventionalCommit('docs: readme')!,
        parseConventionalCommit('fix: bug')!,
        parseConventionalCommit('chore: update')!,
      ];
      const filtered = filterBumpableCommits(commits);
      expect(filtered).toHaveLength(2);
    });
  });
});
