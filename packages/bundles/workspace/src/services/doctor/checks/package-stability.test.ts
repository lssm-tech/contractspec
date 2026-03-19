import { describe, expect, it } from 'bun:test';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createNodeFsAdapter } from '../../../adapters/fs.node';
import { runPackageStabilityChecks } from './package-stability';
import type { CheckContext } from '../types';

function writeJson(filePath: string, value: unknown): void {
  writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function createCheckContext(root: string): CheckContext {
  return {
    workspaceRoot: root,
    packageRoot: root,
    isMonorepo: true,
    packageName: 'contractspec',
    verbose: false,
  };
}

function withTempRepo(run: (root: string) => Promise<void>): Promise<void> {
  const root = mkdtempSync(join(tmpdir(), 'contractspec-package-audit-'));
  writeJson(join(root, 'package.json'), {
    name: 'contractspec-test',
    workspaces: ['packages/*'],
  });
  mkdirSync(join(root, 'config'), { recursive: true });
  writeJson(join(root, 'config', 'stability-policy.json'), {
    version: 1,
    criticalPackages: ['packages/libs/schema'],
    criticalFeatureKeys: [],
    smokePackages: [],
  });

  return run(root).finally(() => {
    rmSync(root, { recursive: true, force: true });
  });
}

describe('runPackageStabilityChecks', () => {
  it('fails when a critical package has tests on disk but no test script', async () => {
    await withTempRepo(async (root) => {
      const packageDir = join(root, 'packages', 'libs', 'schema', 'src');
      mkdirSync(packageDir, { recursive: true });
      writeJson(join(root, 'packages', 'libs', 'schema', 'package.json'), {
        name: '@contractspec/lib.schema',
        scripts: {
          build: 'bun run build',
          typecheck: 'tsc --noEmit',
          lint: 'eslint src',
        },
      });
      writeFileSync(
        join(packageDir, 'schema.test.ts'),
        'import { expect, it } from "bun:test"; it("works", () => expect(true).toBe(true));\n',
        'utf8'
      );

      const checks = await runPackageStabilityChecks(
        createNodeFsAdapter(root),
        createCheckContext(root)
      );

      const criticalCheck = checks.find(
        (check) => check.name === 'Critical Package Gates'
      );
      const testScriptCheck = checks.find(
        (check) => check.name === 'Package Test Scripts'
      );

      expect(criticalCheck?.status).toBe('fail');
      expect(testScriptCheck?.status).toBe('fail');
    });
  });

  it('passes wired critical packages and warns on non-critical build-only packages', async () => {
    await withTempRepo(async (root) => {
      const criticalDir = join(root, 'packages', 'libs', 'schema');
      mkdirSync(join(criticalDir, 'src'), { recursive: true });
      writeJson(join(criticalDir, 'package.json'), {
        name: '@contractspec/lib.schema',
        scripts: {
          build: 'bun run build',
          typecheck: 'tsc --noEmit',
          lint: 'eslint src',
          test: 'bun test',
        },
      });
      writeFileSync(
        join(criticalDir, 'src', 'schema.test.ts'),
        'import { expect, it } from "bun:test"; it("works", () => expect(true).toBe(true));\n',
        'utf8'
      );

      const nonCriticalDir = join(root, 'packages', 'apps', 'web-landing');
      mkdirSync(join(nonCriticalDir, 'src'), { recursive: true });
      writeJson(join(nonCriticalDir, 'package.json'), {
        name: '@contractspec/app.web-landing',
        scripts: {
          build: 'bun run build',
        },
      });

      const checks = await runPackageStabilityChecks(
        createNodeFsAdapter(root),
        createCheckContext(root)
      );

      const criticalCheck = checks.find(
        (check) => check.name === 'Critical Package Gates'
      );
      const buildCheck = checks.find(
        (check) => check.name === 'Buildable Packages Without Tests'
      );

      expect(criticalCheck?.status).toBe('pass');
      expect(buildCheck?.status).toBe('warn');
    });
  });
});
