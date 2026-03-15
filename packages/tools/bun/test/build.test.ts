import { afterEach, describe, expect, test } from 'bun:test';
import { access, mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { runTranspile } from '../lib/build.mjs';
import { selectEntriesForTarget } from '../lib/config.mjs';

const tempDirs: string[] = [];

async function createTempDir() {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), 'contractspec-bun-build-'));
  tempDirs.push(tempDir);
  return tempDir;
}

async function exists(filePath: string) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

afterEach(async () => {
  await Promise.all(
    tempDirs.splice(0, tempDirs.length).map((tempDir) =>
      rm(tempDir, { recursive: true, force: true })
    )
  );
});

describe('selectEntriesForTarget', () => {
  const entries = [
    'src/index.ts',
    'src/foo.web.ts',
    'src/foo.native.ts',
    'src/foo.node.ts',
    'src/foo.bun.ts',
    'src/foo.browser.ts',
  ];

  test('excludes native files from bun builds', () => {
    expect(selectEntriesForTarget(entries, 'bun')).toEqual([
      'src/index.ts',
      'src/foo.web.ts',
      'src/foo.node.ts',
      'src/foo.bun.ts',
      'src/foo.browser.ts',
    ]);
  });

  test('excludes browser and native variants from node builds', () => {
    expect(selectEntriesForTarget(entries, 'node')).toEqual([
      'src/index.ts',
      'src/foo.node.ts',
      'src/foo.bun.ts',
    ]);
  });

  test('excludes node, bun, and native variants from browser builds', () => {
    expect(selectEntriesForTarget(entries, 'browser')).toEqual([
      'src/index.ts',
      'src/foo.web.ts',
      'src/foo.browser.ts',
    ]);
  });

  test('includes only native files for native builds', () => {
    expect(selectEntriesForTarget(entries, 'native')).toEqual([
      'src/foo.native.ts',
    ]);
  });
});

describe('runTranspile', () => {
  test('emits native files only under dist/native', async () => {
    const cwd = await createTempDir();
    const srcDir = path.join(cwd, 'src');
    await mkdir(srcDir, { recursive: true });
    await writeFile(path.join(srcDir, 'index.ts'), 'export const base = 1;\n');
    await writeFile(path.join(srcDir, 'view.web.ts'), 'export const web = 1;\n');
    await writeFile(
      path.join(srcDir, 'view.native.ts'),
      'export const native = 1;\n'
    );

    const entries = ['src/index.ts', 'src/view.web.ts', 'src/view.native.ts'];
    await runTranspile({
      cwd,
      entries,
      external: [],
      targets: {
        node: true,
        browser: true,
      },
      targetRoots: {
        bun: 'src',
        node: 'src',
        browser: 'src',
        native: 'src',
      },
      noBundle: true,
    });

    expect(await exists(path.join(cwd, 'dist', 'index.js'))).toBe(true);
    expect(await exists(path.join(cwd, 'dist', 'view.web.js'))).toBe(true);
    expect(await exists(path.join(cwd, 'dist', 'view.native.js'))).toBe(false);
    expect(await exists(path.join(cwd, 'dist', 'browser', 'view.web.js'))).toBe(
      true
    );
    expect(await exists(path.join(cwd, 'dist', 'browser', 'view.native.js'))).toBe(
      false
    );
    expect(await exists(path.join(cwd, 'dist', 'node', 'view.web.js'))).toBe(
      false
    );
    expect(await exists(path.join(cwd, 'dist', 'native', 'view.native.js'))).toBe(
      true
    );
  });
});
