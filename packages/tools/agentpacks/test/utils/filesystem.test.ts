import { describe, expect, test, beforeEach, afterEach } from 'bun:test';
import { existsSync, readFileSync, mkdirSync, rmSync, writeFileSync } from 'fs';
import { join } from 'path';
import {
  ensureDir,
  writeGeneratedFile,
  writeGeneratedJson,
  readFileOrNull,
  readJsonOrNull,
  listFiles,
  listDirs,
  isGeneratedFile,
  relPath,
} from '../../src/utils/filesystem.js';

const TEST_DIR = join(
  import.meta.dirname,
  '..',
  '__fixtures__',
  'filesystem-test'
);

beforeEach(() => {
  mkdirSync(TEST_DIR, { recursive: true });
});

afterEach(() => {
  rmSync(TEST_DIR, { recursive: true, force: true });
});

describe('ensureDir', () => {
  test('creates directory if it does not exist', () => {
    const dir = join(TEST_DIR, 'new-dir', 'nested');
    ensureDir(dir);
    expect(existsSync(dir)).toBe(true);
  });

  test('does not error if directory already exists', () => {
    ensureDir(TEST_DIR);
    expect(existsSync(TEST_DIR)).toBe(true);
  });
});

describe('writeGeneratedFile', () => {
  test('writes a file with generated header', () => {
    const filepath = join(TEST_DIR, 'output.md');
    writeGeneratedFile(filepath, 'Hello world');
    const content = readFileSync(filepath, 'utf-8');
    expect(content).toContain('Hello world');
  });

  test('creates parent directories', () => {
    const filepath = join(TEST_DIR, 'sub', 'dir', 'output.md');
    writeGeneratedFile(filepath, 'Nested file');
    expect(existsSync(filepath)).toBe(true);
  });
});

describe('writeGeneratedJson', () => {
  test('writes JSON with proper formatting', () => {
    const filepath = join(TEST_DIR, 'config.json');
    writeGeneratedJson(filepath, { key: 'value' });
    const content = readFileSync(filepath, 'utf-8');
    const parsed = JSON.parse(content.replace(/^\/\/.*\n/gm, ''));
    expect(parsed.key).toBe('value');
  });
});

describe('readFileOrNull', () => {
  test('reads existing file', () => {
    const filepath = join(TEST_DIR, 'read-me.txt');
    writeFileSync(filepath, 'hello');
    expect(readFileOrNull(filepath)).toBe('hello');
  });

  test('returns null for non-existent file', () => {
    expect(readFileOrNull(join(TEST_DIR, 'missing.txt'))).toBeNull();
  });
});

describe('readJsonOrNull', () => {
  test('reads and parses JSON file', () => {
    const filepath = join(TEST_DIR, 'data.json');
    writeFileSync(filepath, '{"a": 1}');
    const data = readJsonOrNull<{ a: number }>(filepath);
    expect(data?.a).toBe(1);
  });

  test('returns null for missing file', () => {
    expect(readJsonOrNull(join(TEST_DIR, 'nope.json'))).toBeNull();
  });
});

describe('listFiles', () => {
  test('lists files in a directory', () => {
    writeFileSync(join(TEST_DIR, 'a.md'), 'a');
    writeFileSync(join(TEST_DIR, 'b.md'), 'b');
    writeFileSync(join(TEST_DIR, 'c.txt'), 'c');
    const files = listFiles(TEST_DIR);
    expect(files.length).toBeGreaterThanOrEqual(3);
  });

  test('filters by extension', () => {
    writeFileSync(join(TEST_DIR, 'a.md'), 'a');
    writeFileSync(join(TEST_DIR, 'b.txt'), 'b');
    const mdFiles = listFiles(TEST_DIR, { extension: '.md' });
    expect(mdFiles).toHaveLength(1);
    expect(mdFiles[0]).toContain('a.md');
  });

  test('returns empty for empty directory', () => {
    const emptyDir = join(TEST_DIR, 'empty');
    mkdirSync(emptyDir);
    expect(listFiles(emptyDir)).toEqual([]);
  });
});

describe('listDirs', () => {
  test('lists subdirectories', () => {
    mkdirSync(join(TEST_DIR, 'dir-a'));
    mkdirSync(join(TEST_DIR, 'dir-b'));
    writeFileSync(join(TEST_DIR, 'file.txt'), 'not a dir');
    const dirs = listDirs(TEST_DIR);
    expect(dirs).toHaveLength(2);
  });
});

describe('relPath', () => {
  test('returns relative path from project root', () => {
    const result = relPath('/project', '/project/src/file.ts');
    expect(result).toBe('src/file.ts');
  });
});

describe('isGeneratedFile', () => {
  test('detects generated file by header comment', () => {
    const filepath = join(TEST_DIR, 'gen.md');
    writeGeneratedFile(filepath, 'content');
    expect(isGeneratedFile(filepath)).toBe(true);
  });

  test('non-generated file returns false', () => {
    const filepath = join(TEST_DIR, 'manual.md');
    writeFileSync(filepath, 'manual content');
    expect(isGeneratedFile(filepath)).toBe(false);
  });
});
