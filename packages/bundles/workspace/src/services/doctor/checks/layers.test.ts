import { describe, expect, it } from 'bun:test';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createNodeFsAdapter } from '../../../adapters/fs.node';
import { runLayerChecks } from './layers';
import type { CheckContext } from '../types';

function writeJson(filePath: string, value: unknown): void {
  writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function createContext(root: string): CheckContext {
  return {
    workspaceRoot: root,
    packageRoot: root,
    isMonorepo: true,
    packageName: 'contractspec',
    verbose: false,
  };
}

describe('runLayerChecks', () => {
  it('treats owner metadata as present when a feature references an owner constant', async () => {
    const root = mkdtempSync(join(tmpdir(), 'contractspec-layer-check-'));

    try {
      writeJson(join(root, 'package.json'), {
        name: 'contractspec-test',
        workspaces: ['packages/*'],
      });
      mkdirSync(join(root, 'packages', 'libs', 'demo', 'src'), {
        recursive: true,
      });
      writeFileSync(
        join(root, 'packages', 'libs', 'demo', 'src', 'demo.feature.ts'),
        [
          'const FEATURE_OWNERS = ["platform.demo"];',
          'export const DemoFeature = defineFeature({',
          '  meta: {',
          '    key: "platform.demo",',
          '    version: "1.0.0",',
          '    owners: FEATURE_OWNERS,',
          '  },',
          '});',
        ].join('\n'),
        'utf8'
      );

      const checks = await runLayerChecks(createNodeFsAdapter(root), createContext(root));
      const featureOwners = checks.find((check) => check.name === 'Feature Owners');

      expect(featureOwners?.status).toBe('pass');
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it('fails when a critical feature is missing owners entirely', async () => {
    const root = mkdtempSync(join(tmpdir(), 'contractspec-layer-policy-'));

    try {
      writeJson(join(root, 'package.json'), {
        name: 'contractspec-test',
        workspaces: ['packages/*'],
      });
      mkdirSync(join(root, 'config'), { recursive: true });
      writeJson(join(root, 'config', 'stability-policy.json'), {
        version: 1,
        criticalPackages: [],
        criticalFeatureKeys: ['platform.context'],
        smokePackages: [],
      });
      mkdirSync(join(root, 'packages', 'libs', 'demo', 'src'), {
        recursive: true,
      });
      writeFileSync(
        join(root, 'packages', 'libs', 'demo', 'src', 'context.feature.ts'),
        [
          'export const ContextFeature = defineFeature({',
          '  meta: {',
          '    key: "platform.context",',
          '    version: "1.0.0",',
          '  },',
          '});',
        ].join('\n'),
        'utf8'
      );

      const checks = await runLayerChecks(createNodeFsAdapter(root), createContext(root));
      const featureOwners = checks.find((check) => check.name === 'Feature Owners');

      expect(featureOwners?.status).toBe('fail');
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});
