#!/usr/bin/env bun

import path from 'node:path';
import {
  inferBuildRoot,
  loadUserConfig,
  normalizeBuildConfig,
  resolveEntries,
  selectEntriesForTarget,
} from '../lib/config.mjs';
import { rewritePackageExports } from '../lib/exports.mjs';
import { runDev, runTranspile, runTypes } from '../lib/build.mjs';

async function main() {
  const cwd = process.cwd();
  const packageJsonPath = path.join(cwd, 'package.json');
  const command = process.argv[2] ?? 'build';

  const { config } = await loadUserConfig(cwd);
  const normalizedConfig = await normalizeBuildConfig(cwd, config);
  const entries = await resolveEntries(cwd, normalizedConfig.entry);
  const targetRoots = {
    bun: inferBuildRoot(selectEntriesForTarget(entries, 'bun')),
    node: normalizedConfig.targets.node
      ? inferBuildRoot(selectEntriesForTarget(entries, 'node'))
      : '.',
    browser: normalizedConfig.targets.browser
      ? inferBuildRoot(selectEntriesForTarget(entries, 'browser'))
      : '.',
  };

  if (command === 'prebuild') {
    await rewritePackageExports(
      packageJsonPath,
      entries,
      normalizedConfig.targets,
      targetRoots
    );
    return;
  }

  if (command === 'transpile') {
    await runTranspile({
      cwd,
      entries,
      external: normalizedConfig.external,
      targets: normalizedConfig.targets,
      targetRoots,
    });
    return;
  }

  if (command === 'types') {
    await runTypes({
      cwd,
      tsconfigForTypes: normalizedConfig.tsconfigForTypes,
      typesRoot: targetRoots.bun,
    });
    return;
  }

  if (command === 'dev') {
    await runDev({
      cwd,
      entries,
      external: normalizedConfig.external,
      targets: normalizedConfig.targets,
      targetRoots,
    });
    return;
  }

  if (command === 'build') {
    await rewritePackageExports(
      packageJsonPath,
      entries,
      normalizedConfig.targets,
      targetRoots
    );
    await runTranspile({
      cwd,
      entries,
      external: normalizedConfig.external,
      targets: normalizedConfig.targets,
      targetRoots,
    });
    await runTypes({
      cwd,
      tsconfigForTypes: normalizedConfig.tsconfigForTypes,
      typesRoot: targetRoots.bun,
    });
    return;
  }

  console.error(`Unknown contractspec-bun-build command: ${command}`);
  process.exit(1);
}

await main();
