/**
 * Unit tests for workspace detection utilities.
 *
 * Tests meta-repo detection, git submodule parsing, and repository type classification.
 */

import { describe, expect, it, beforeEach, afterEach } from 'bun:test';
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import {
  detectRepositoryType,
  findMetaRepoRoot,
  findPackageRoot,
  findWorkspaceRoot,
  getWorkspaceInfo,
  isMonorepo,
  parseGitModules,
} from './workspace';

// Test directory setup
const TEST_DIR = join(tmpdir(), 'contractspec-workspace-test');

function createTestDir(path: string): void {
  mkdirSync(path, { recursive: true });
}

function writeFile(path: string, content: string): void {
  writeFileSync(path, content, 'utf-8');
}

describe('Workspace Detection', () => {
  beforeEach(() => {
    createTestDir(TEST_DIR);
  });

  afterEach(() => {
    rmSync(TEST_DIR, { recursive: true, force: true });
  });

  describe('findPackageRoot', () => {
    it('should find the nearest package.json directory', () => {
      const projectDir = join(TEST_DIR, 'project');
      const srcDir = join(projectDir, 'src', 'deep', 'nested');
      createTestDir(srcDir);
      writeFile(join(projectDir, 'package.json'), '{"name": "test"}');

      const result = findPackageRoot(srcDir);
      expect(result).toBe(projectDir);
    });

    it('should return start directory when no package.json found', () => {
      const noPackageDir = join(TEST_DIR, 'no-package');
      createTestDir(noPackageDir);

      const result = findPackageRoot(noPackageDir);
      expect(result).toBe(noPackageDir);
    });
  });

  describe('findWorkspaceRoot', () => {
    it('should find monorepo root with workspaces field', () => {
      const monorepoRoot = join(TEST_DIR, 'monorepo');
      const packageDir = join(monorepoRoot, 'packages', 'app');
      createTestDir(packageDir);

      writeFile(
        join(monorepoRoot, 'package.json'),
        '{"name": "monorepo", "workspaces": ["packages/*"]}'
      );
      writeFile(join(packageDir, 'package.json'), '{"name": "@test/app"}');

      const result = findWorkspaceRoot(packageDir);
      expect(result).toBe(monorepoRoot);
    });

    it('should find monorepo root with pnpm-workspace.yaml', () => {
      const monorepoRoot = join(TEST_DIR, 'pnpm-monorepo');
      const packageDir = join(monorepoRoot, 'packages', 'lib');
      createTestDir(packageDir);

      writeFile(
        join(monorepoRoot, 'pnpm-workspace.yaml'),
        'packages:\n  - "packages/*"'
      );
      writeFile(join(monorepoRoot, 'package.json'), '{"name": "root"}');
      writeFile(join(packageDir, 'package.json'), '{"name": "@test/lib"}');

      const result = findWorkspaceRoot(packageDir);
      expect(result).toBe(monorepoRoot);
    });
  });

  describe('isMonorepo', () => {
    it('should return true for workspace with workspaces field', () => {
      const monorepoRoot = join(TEST_DIR, 'ws-monorepo');
      createTestDir(monorepoRoot);
      writeFile(
        join(monorepoRoot, 'package.json'),
        '{"name": "root", "workspaces": ["packages/*"]}'
      );

      expect(isMonorepo(monorepoRoot)).toBe(true);
    });

    it('should return false for single package', () => {
      const singlePkg = join(TEST_DIR, 'single-pkg');
      createTestDir(singlePkg);
      writeFile(join(singlePkg, 'package.json'), '{"name": "single"}');

      expect(isMonorepo(singlePkg)).toBe(false);
    });

    it('should return true for pnpm-workspace.yaml', () => {
      const pnpmRoot = join(TEST_DIR, 'pnpm-root');
      createTestDir(pnpmRoot);
      writeFile(join(pnpmRoot, 'pnpm-workspace.yaml'), 'packages:\n  - "."');

      expect(isMonorepo(pnpmRoot)).toBe(true);
    });

    it('should return true for turbo.json', () => {
      const turboRoot = join(TEST_DIR, 'turbo-root');
      createTestDir(turboRoot);
      writeFile(join(turboRoot, 'turbo.json'), '{}');

      expect(isMonorepo(turboRoot)).toBe(true);
    });
  });

  describe('parseGitModules', () => {
    it('should parse .gitmodules file correctly', () => {
      const metaRoot = join(TEST_DIR, 'meta-repo');
      const submoduleDir = join(metaRoot, 'packages', 'core');
      createTestDir(submoduleDir);

      writeFile(
        join(metaRoot, '.gitmodules'),
        `[submodule "packages/core"]
\tpath = packages/core
\turl = git@github.com:org/core.git
[submodule "packages/utils"]
\tpath = packages/utils
\turl = git@github.com:org/utils.git`
      );

      writeFile(
        join(submoduleDir, 'package.json'),
        '{"name": "@org/core", "workspaces": ["src/*"]}'
      );

      const result = parseGitModules(metaRoot);

      expect(result.length).toBe(2);
      expect(result[0]?.name).toBe('packages/core');
      expect(result[0]?.path).toBe('packages/core');
      expect(result[0]?.url).toBe('git@github.com:org/core.git');
      expect(result[0]?.hasWorkspaces).toBe(true);

      expect(result[1]?.name).toBe('packages/utils');
      expect(result[1]?.hasWorkspaces).toBe(false);
    });

    it('should return empty array when no .gitmodules exists', () => {
      const noModules = join(TEST_DIR, 'no-modules');
      createTestDir(noModules);

      const result = parseGitModules(noModules);
      expect(result).toEqual([]);
    });
  });

  describe('findMetaRepoRoot', () => {
    it('should find meta-repo root with .gitmodules', () => {
      const metaRoot = join(TEST_DIR, 'meta-find');
      const subDir = join(metaRoot, 'packages', 'sub', 'deep');
      createTestDir(subDir);

      writeFile(
        join(metaRoot, '.gitmodules'),
        '[submodule "pkg"]\n\tpath = pkg\n\turl = test.git'
      );

      const result = findMetaRepoRoot(subDir);
      expect(result).toBe(metaRoot);
    });

    it('should return undefined when no .gitmodules found', () => {
      const noMeta = join(TEST_DIR, 'no-meta');
      createTestDir(noMeta);

      const result = findMetaRepoRoot(noMeta);
      expect(result).toBeUndefined();
    });
  });

  describe('detectRepositoryType', () => {
    it('should detect meta-repo type', () => {
      const metaRoot = join(TEST_DIR, 'meta-detect');
      createTestDir(metaRoot);

      writeFile(
        join(metaRoot, '.gitmodules'),
        '[submodule "sub"]\n\tpath = sub\n\turl = test.git'
      );

      const result = detectRepositoryType(metaRoot, false);
      expect(result).toBe('meta-repo');
    });

    it('should detect monorepo type', () => {
      const monoRoot = join(TEST_DIR, 'mono-detect');
      createTestDir(monoRoot);

      const result = detectRepositoryType(monoRoot, true);
      expect(result).toBe('monorepo');
    });

    it('should detect classic type', () => {
      const classicRoot = join(TEST_DIR, 'classic-detect');
      createTestDir(classicRoot);

      const result = detectRepositoryType(classicRoot, false);
      expect(result).toBe('classic');
    });
  });

  describe('getWorkspaceInfo', () => {
    it('should return complete workspace info for meta-repo', () => {
      const metaRoot = join(TEST_DIR, 'meta-info');
      const subDir = join(metaRoot, 'packages', 'core');
      createTestDir(subDir);

      writeFile(
        join(metaRoot, '.gitmodules'),
        '[submodule "packages/core"]\n\tpath = packages/core\n\turl = test.git'
      );
      writeFile(join(metaRoot, 'package.json'), '{"name": "meta"}');
      writeFile(
        join(subDir, 'package.json'),
        '{"name": "@meta/core", "workspaces": ["libs/*"]}'
      );
      writeFile(join(metaRoot, 'bun.lockb'), '');

      const result = getWorkspaceInfo(subDir);

      expect(result.repositoryType).toBe('meta-repo');
      expect(result.metaRepo).toBeDefined();
      expect(result.metaRepo?.submodules.length).toBeGreaterThan(0);
      expect(result.packageManager).toBe('bun');
    });

    it('should return complete workspace info for monorepo', () => {
      const monoRoot = join(TEST_DIR, 'mono-info');
      const pkgDir = join(monoRoot, 'packages', 'app');
      createTestDir(pkgDir);

      writeFile(
        join(monoRoot, 'package.json'),
        '{"name": "monorepo", "workspaces": ["packages/*"]}'
      );
      writeFile(join(pkgDir, 'package.json'), '{"name": "@mono/app"}');
      writeFile(join(monoRoot, 'bun.lockb'), '');

      const result = getWorkspaceInfo(pkgDir);

      expect(result.repositoryType).toBe('monorepo');
      expect(result.isMonorepo).toBe(true);
      expect(result.workspaceRoot).toBe(monoRoot);
      expect(result.packageRoot).toBe(pkgDir);
    });

    it('should return complete workspace info for classic repo', () => {
      const classicRoot = join(TEST_DIR, 'classic-info');
      createTestDir(classicRoot);

      writeFile(join(classicRoot, 'package.json'), '{"name": "classic"}');
      writeFile(join(classicRoot, 'package-lock.json'), '{}');

      const result = getWorkspaceInfo(classicRoot);

      expect(result.repositoryType).toBe('classic');
      expect(result.isMonorepo).toBe(false);
      expect(result.packageManager).toBe('npm');
    });
  });
});
