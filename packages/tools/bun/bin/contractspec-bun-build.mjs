#!/usr/bin/env bun

import path from 'node:path';
import { formatUsage, parseCliArgs } from '../lib/cli.mjs';
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
  const cli = parseCliArgs(process.argv.slice(2));

  if (cli.help) {
    console.log(formatUsage());
    return;
  }

  if (!cli.ok) {
    console.error(cli.error);
    console.error('');
    console.error(formatUsage());
    process.exit(1);
  }

  const cwd = process.cwd();
  const packageJsonPath = path.join(cwd, 'package.json');
  const command = cli.command;
  const allTargets = cli.allTargets;
  const noBundleCli = cli.noBundle;

  const { config } = await loadUserConfig(cwd);
  const normalizedConfig = await normalizeBuildConfig(cwd, config);
  const noBundle = normalizedConfig.noBundle || noBundleCli;
  const entries = await resolveEntries(cwd, normalizedConfig.entry);
  const targetRoots = {
    bun: inferBuildRoot(selectEntriesForTarget(entries, 'bun')),
    node: normalizedConfig.targets.node
      ? inferBuildRoot(selectEntriesForTarget(entries, 'node'))
      : '.',
    browser: normalizedConfig.targets.browser
      ? inferBuildRoot(selectEntriesForTarget(entries, 'browser'))
      : '.',
    native: inferBuildRoot(selectEntriesForTarget(entries, 'native')),
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
      noBundle,
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
      allTargets,
      noBundle,
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
      noBundle,
    });
    await runTypes({
      cwd,
      tsconfigForTypes: normalizedConfig.tsconfigForTypes,
      typesRoot: targetRoots.bun,
    });
    return;
  }
}

await main();
