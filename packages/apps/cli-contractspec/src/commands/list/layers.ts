/**
 * List layers command.
 *
 * Lists all contract layers (features, examples, app-configs, workspace-configs)
 * discovered in the workspace.
 */

import { Command } from 'commander';
import chalk from 'chalk';
import {
  createNodeAdapters,
  discoverLayers,
  type LayerDiscoveryResult,
} from '@contractspec/bundle.workspace';
import type {
  FeatureScanResult,
  ExampleScanResult,
} from '@contractspec/module.workspace';
import { getErrorMessage } from '../../utils/errors';

type LayerType = 'features' | 'examples' | 'app-configs' | 'workspace-configs';

interface LayersOptions {
  type?: LayerType;
  kind?: string;
  visibility?: string;
  tag?: string;
  json?: boolean;
}

export const layersCommand = new Command('layers')
  .description(
    'List all contract layers (features, examples, app-configs, workspace-configs)'
  )
  .option(
    '--type <type>',
    'Filter by layer type (features, examples, app-configs, workspace-configs)'
  )
  .option('--kind <kind>', 'Filter examples by kind (template, workflow, etc.)')
  .option(
    '--visibility <visibility>',
    'Filter examples by visibility (public, internal, experimental)'
  )
  .option('--tag <tag>', 'Filter by tag')
  .option('--json', 'Output as JSON for scripting')
  .action(async (options: LayersOptions) => {
    try {
      const adapters = createNodeAdapters({ silent: true });
      const result = await discoverLayers(adapters, {});

      if (options.json) {
        outputJson(result, options);
      } else {
        outputText(result, options);
      }
    } catch (error) {
      console.error(
        chalk.red(`Error listing layers: ${getErrorMessage(error)}`)
      );
      process.exit(1);
    }
  });

/**
 * Output layers as formatted text.
 */
function outputText(
  result: LayerDiscoveryResult,
  options: LayersOptions
): void {
  const { inventory, stats } = result;

  // Show summary
  console.log(chalk.bold.blue('\n📋 Contract Layers\n'));
  console.log(
    `  ${chalk.cyan('Features:')} ${stats.features}  ` +
      `${chalk.cyan('Examples:')} ${stats.examples}  ` +
      `${chalk.cyan('App Configs:')} ${stats.appConfigs}  ` +
      `${chalk.cyan('Workspace Configs:')} ${stats.workspaceConfigs}`
  );
  console.log();

  // Features
  if (!options.type || options.type === 'features') {
    const features = [...inventory.features.values()];
    if (features.length > 0) {
      console.log(chalk.bold.green(`\n── Features (${features.length}) ──\n`));
      for (const feature of filterByTag(features, options.tag)) {
        printFeature(feature);
      }
    }
  }

  // Examples
  if (!options.type || options.type === 'examples') {
    let examples = [...inventory.examples.values()];

    // Apply kind filter
    if (options.kind) {
      examples = examples.filter((e) => e.kind === options.kind);
    }

    // Apply visibility filter
    if (options.visibility) {
      examples = examples.filter((e) => e.visibility === options.visibility);
    }

    // Apply tag filter
    examples = filterByTag(examples, options.tag);

    if (examples.length > 0) {
      console.log(chalk.bold.yellow(`\n── Examples (${examples.length}) ──\n`));
      for (const example of examples) {
        printExample(example);
      }
    }
  }

  // App Configs
  if (!options.type || options.type === 'app-configs') {
    const appConfigs = [...inventory.appConfigs.values()];
    if (appConfigs.length > 0) {
      console.log(
        chalk.bold.magenta(`\n── App Configs (${appConfigs.length}) ──\n`)
      );
      for (const appConfig of appConfigs) {
        console.log(
          `  ${chalk.bold(appConfig.key ?? 'unknown')} ${chalk.gray(`v${appConfig.version ?? 1}`)}`
        );
        console.log(`    📁 ${chalk.gray(appConfig.filePath)}`);
        console.log();
      }
    }
  }

  // Workspace Configs
  if (!options.type || options.type === 'workspace-configs') {
    const configs = [...inventory.workspaceConfigs.values()];
    if (configs.length > 0) {
      console.log(
        chalk.bold.cyan(`\n── Workspace Configs (${configs.length}) ──\n`)
      );
      for (const config of configs) {
        const status = config.valid ? chalk.green('✓') : chalk.red('✗');
        console.log(`  ${status} ${chalk.bold(config.file)}`);
        if (!config.valid && config.errors.length > 0) {
          for (const error of config.errors) {
            console.log(`    ${chalk.red('Error:')} ${error}`);
          }
        }
        console.log();
      }
    }
  }

  // Summary
  if (stats.total === 0) {
    console.log(chalk.yellow('\nNo contract layers found.'));
    console.log(
      chalk.gray(
        'Run `contractspec create feature` or `contractspec create example` to create layers.'
      )
    );
  }
}

/**
 * Output layers as JSON.
 */
function outputJson(
  result: LayerDiscoveryResult,
  options: LayersOptions
): void {
  const output: Record<string, unknown> = {
    stats: result.stats,
  };

  if (!options.type || options.type === 'features') {
    output.features = [...result.inventory.features.values()].map((f) => ({
      key: f.key,
      title: f.title,
      description: f.description,
      stability: f.stability,
      owners: f.owners,
      tags: f.tags,
      operations: f.operations.length,
      events: f.events.length,
      presentations: f.presentations.length,
      file: f.filePath,
    }));
  }

  if (!options.type || options.type === 'examples') {
    let examples = [...result.inventory.examples.values()];

    if (options.kind) {
      examples = examples.filter((e) => e.kind === options.kind);
    }
    if (options.visibility) {
      examples = examples.filter((e) => e.visibility === options.visibility);
    }
    if (options.tag) {
      examples = examples.filter((e) =>
        e.tags?.includes(options.tag as string)
      );
    }

    output.examples = examples.map((e) => ({
      key: e.key,
      version: e.version,
      title: e.title,
      description: e.description,
      kind: e.kind,
      visibility: e.visibility,
      stability: e.stability,
      tags: e.tags,
      surfaces: e.surfaces,
      packageName: e.entrypoints.packageName,
      file: e.filePath,
    }));
  }

  if (!options.type || options.type === 'app-configs') {
    output.appConfigs = [...result.inventory.appConfigs.values()].map((c) => ({
      key: c.key,
      version: c.version,
      stability: c.stability,
      file: c.filePath,
    }));
  }

  if (!options.type || options.type === 'workspace-configs') {
    output.workspaceConfigs = [
      ...result.inventory.workspaceConfigs.values(),
    ].map((c) => ({
      file: c.file,
      valid: c.valid,
      errors: c.errors,
    }));
  }

  console.log(JSON.stringify(output, null, 2));
}

/**
 * Filter items by tag.
 */
function filterByTag<T extends { tags?: string[] }>(
  items: T[],
  tag?: string
): T[] {
  if (!tag) return items;
  return items.filter((item) => item.tags?.includes(tag));
}

/**
 * Print a feature row.
 */
function printFeature(feature: FeatureScanResult): void {
  const stabilityColor = getStabilityColor(feature.stability);
  const counts = [
    `${feature.operations.length} ops`,
    `${feature.events.length} events`,
    `${feature.presentations.length} presentations`,
  ].join(', ');

  console.log(
    `  ${stabilityColor((feature.stability ?? 'stable').toUpperCase())} ` +
      `${chalk.bold(feature.key)} ${chalk.gray(`(${counts})`)}`
  );

  if (feature.title) {
    console.log(`    ${chalk.white(feature.title)}`);
  }

  console.log(`    📁 ${chalk.gray(feature.filePath)}`);

  if (feature.owners?.length) {
    console.log(`    👥 ${chalk.gray(feature.owners.join(', '))}`);
  }

  console.log();
}

/**
 * Print an example row.
 */
function printExample(example: ExampleScanResult): void {
  const stabilityColor = getStabilityColor(example.stability);
  const surfaces = [];
  if (example.surfaces.templates) surfaces.push('templates');
  if (example.surfaces.sandbox.enabled) surfaces.push('sandbox');
  if (example.surfaces.studio.enabled) surfaces.push('studio');
  if (example.surfaces.mcp.enabled) surfaces.push('mcp');

  console.log(
    `  ${stabilityColor((example.stability ?? 'experimental').toUpperCase())} ` +
      `${chalk.cyan(example.kind ?? 'template')} ` +
      `${chalk.bold(example.key)} ${chalk.gray(`v${example.version ?? 1}`)}`
  );

  if (example.title) {
    console.log(`    ${chalk.white(example.title)}`);
  }

  if (example.description) {
    const desc =
      example.description.length > 80
        ? example.description.slice(0, 77) + '...'
        : example.description;
    console.log(`    ${chalk.gray(desc)}`);
  }

  console.log(
    `    📦 ${chalk.gray(example.entrypoints.packageName)} ` +
      `${chalk.dim(`[${surfaces.join(', ')}]`)}`
  );

  console.log();
}

/**
 * Get chalk color for stability level.
 */
function getStabilityColor(stability?: string): (text: string) => string {
  switch (stability) {
    case 'experimental':
      return chalk.red;
    case 'beta':
      return chalk.yellow;
    case 'stable':
      return chalk.green;
    case 'deprecated':
      return chalk.gray;
    default:
      return chalk.white;
  }
}
