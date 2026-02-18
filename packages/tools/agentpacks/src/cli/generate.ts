import { resolve } from 'path';
import chalk from 'chalk';
import {
  loadWorkspaceConfig,
  resolveFeatures,
  resolveTargets,
  type FeatureId,
} from '../core/config.js';
import { PackLoader } from '../core/pack-loader.js';
import { FeatureMerger } from '../core/feature-merger.js';
import { getTargets } from '../targets/registry.js';
import type {
  GenerateOptions,
  GenerateResult,
} from '../targets/base-target.js';

interface GenerateCliOptions {
  targets?: string;
  features?: string;
  dryRun?: boolean;
  verbose?: boolean;
}

/**
 * Run the generate command.
 * Core pipeline: load config -> load packs -> merge features -> run targets
 */
export function runGenerate(
  projectRoot: string,
  options: GenerateCliOptions
): void {
  const config = loadWorkspaceConfig(projectRoot);

  // CLI overrides
  if (options.targets) {
    const targetList =
      options.targets === '*' ? '*' : options.targets.split(',');
    (config as Record<string, unknown>).targets = targetList;
  }
  if (options.features) {
    const featureList =
      options.features === '*' ? '*' : options.features.split(',');
    (config as Record<string, unknown>).features = featureList;
  }
  if (options.verbose !== undefined) {
    config.verbose = options.verbose;
  }

  const verbose = config.verbose;

  // Step 1: Load packs
  if (verbose) console.log(chalk.dim('Loading packs...'));
  const loader = new PackLoader(projectRoot, config);
  const { packs, warnings: loadWarnings } = loader.loadAll();

  for (const w of loadWarnings) {
    console.log(chalk.yellow(`  warn: ${w}`));
  }

  if (packs.length === 0) {
    console.log(chalk.red('No packs loaded. Nothing to generate.'));
    console.log(chalk.dim("Run 'agentpacks init' to create a default pack."));
    return;
  }

  if (verbose) {
    console.log(
      chalk.dim(
        `  Loaded ${packs.length} pack(s): ${packs.map((p) => p.manifest.name).join(', ')}`
      )
    );
  }

  // Step 2: Merge features
  if (verbose) console.log(chalk.dim('Merging features...'));
  const merger = new FeatureMerger(packs);
  const { features, warnings: mergeWarnings } = merger.merge();

  for (const w of mergeWarnings) {
    console.log(chalk.yellow(`  warn: ${w}`));
  }

  // Step 3: Resolve targets
  const targetIds = resolveTargets(config);

  // Always include agentsmd for auto AGENTS.md generation
  if (!targetIds.includes('agentsmd')) {
    targetIds.push('agentsmd');
  }

  const targets = getTargets(targetIds);

  if (targets.length === 0) {
    console.log(chalk.red('No valid targets found.'));
    return;
  }

  // Step 4: Generate for each target in each baseDir
  const allResults: GenerateResult[] = [];

  for (const baseDir of config.baseDirs) {
    for (const target of targets) {
      const enabledFeatures = resolveFeatures(config, target.id);
      const effectiveFeatures = enabledFeatures.filter((f) =>
        target.supportsFeature(f as FeatureId)
      );

      if (effectiveFeatures.length === 0 && target.id !== 'agentsmd') {
        if (verbose) {
          console.log(
            chalk.dim(`  Skipping ${target.name} (no enabled features)`)
          );
        }
        continue;
      }

      if (options.dryRun) {
        console.log(
          chalk.cyan(`  [dry-run] Would generate ${target.name} in ${baseDir}`)
        );
        continue;
      }

      const generateOptions: GenerateOptions = {
        projectRoot,
        baseDir,
        features,
        enabledFeatures: enabledFeatures as FeatureId[],
        deleteExisting: config.delete,
        global: config.global,
        verbose: config.verbose,
      };

      try {
        const result = target.generate(generateOptions);
        allResults.push(result);

        for (const w of result.warnings) {
          console.log(chalk.yellow(`  warn [${target.name}]: ${w}`));
        }

        if (verbose && result.filesWritten.length > 0) {
          console.log(
            chalk.dim(
              `  ${target.name}: wrote ${result.filesWritten.length} file(s)`
            )
          );
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        console.log(chalk.red(`  error [${target.name}]: ${message}`));
      }
    }
  }

  // Summary
  if (!options.dryRun) {
    const totalWritten = allResults.reduce(
      (sum, r) => sum + r.filesWritten.length,
      0
    );
    const totalDeleted = allResults.reduce(
      (sum, r) => sum + r.filesDeleted.length,
      0
    );
    const targetNames = allResults.map((r) => r.targetId);
    const uniqueTargets = [...new Set(targetNames)];

    console.log(
      chalk.green(
        `Generated ${totalWritten} file(s) for ${uniqueTargets.length} target(s)` +
          (totalDeleted > 0 ? ` (cleaned ${totalDeleted} dir(s))` : '')
      )
    );
  }
}
