import { describe, expect, test, beforeAll, afterAll } from 'bun:test';
import { mkdirSync, writeFileSync, rmSync } from 'fs';
import { join } from 'path';
import { diffFile } from '../../src/utils/diff.js';

const TEST_DIR = join(import.meta.dirname, '..', '__fixtures__', 'diff-test');

beforeAll(() => {
  mkdirSync(TEST_DIR, { recursive: true });
  writeFileSync(join(TEST_DIR, 'existing.md'), 'line 1\nline 2\nline 3\n');
  writeFileSync(join(TEST_DIR, 'unchanged.md'), 'same content\n');
});

afterAll(() => {
  rmSync(TEST_DIR, { recursive: true, force: true });
});

describe('diffFile', () => {
  test('detects added files (file does not exist on disk)', () => {
    const result = diffFile(join(TEST_DIR, 'new-file.md'), 'new content\n');
    expect(result.status).toBe('added');
    expect(result.diffLines.length).toBeGreaterThan(0);
    expect(result.diffLines.some((l) => l.startsWith('+'))).toBe(true);
  });

  test('detects unchanged files', () => {
    const result = diffFile(join(TEST_DIR, 'unchanged.md'), 'same content\n');
    expect(result.status).toBe('unchanged');
    expect(result.diffLines).toHaveLength(0);
  });

  test('detects modified files', () => {
    const result = diffFile(
      join(TEST_DIR, 'existing.md'),
      'line 1\nline 2 modified\nline 3\n'
    );
    expect(result.status).toBe('modified');
    expect(result.diffLines.length).toBeGreaterThan(0);
  });

  test('added diff contains +++ header', () => {
    const result = diffFile(join(TEST_DIR, 'brand-new.md'), 'hello\n');
    expect(result.diffLines.some((l) => l.startsWith('+++'))).toBe(true);
    expect(result.diffLines.some((l) => l.startsWith('---'))).toBe(true);
  });

  test('modified diff contains @@ hunks', () => {
    const result = diffFile(
      join(TEST_DIR, 'existing.md'),
      'line 1\nchanged\nline 3\n'
    );
    expect(result.diffLines.some((l) => l.startsWith('@@'))).toBe(true);
  });
});
