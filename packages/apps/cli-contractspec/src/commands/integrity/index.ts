/**
 * Contract integrity analysis command.
 *
 * Analyzes contract specs and features to detect:
 * - Orphaned specs (not linked to any feature)
 * - Unresolved references (broken event/op/presentation refs)
 * - Feature coverage metrics
 * - Mermaid diagram visualization
 */

import { Command } from 'commander';
import chalk from 'chalk';
import {
  analyzeIntegrity,
  createNodeAdapters,
  generateMermaidDiagram,
  discoverLayers,
  fix,
  type IntegrityAnalysisResult,
} from '@contractspec/bundle.workspace';

type OutputFormat = 'text' | 'json' | 'mermaid';
type DiagramType = 'feature-map' | 'orphans' | 'dependencies' | 'full';

interface IntegrityOptions {
  format?: OutputFormat;
  orphans?: boolean;
  unresolved?: boolean;
  feature?: string;
  type?: string;
  all?: boolean;
  diagram?: DiagramType;
  json?: boolean;
  requireTests?: string[];
}

/**
 * Integrity CLI command.
 */
export const integrityCommand = new Command('integrity')
  .description(
    'Analyze contract integrity: find orphaned specs, unresolved refs, coverage'
  )
  .option(
    '-f, --format <format>',
    'Output format: text, json, mermaid (default: text)'
  )
  .option('--orphans', 'Only show orphaned specs not linked to features')
  .option('--unresolved', 'Only show unresolved references')
  .option('--feature <key>', 'Analyze only a specific feature by key')
  .option(
    '--type <type>',
    'Filter by spec type: operation, event, presentation, etc.'
  )
  .option('--all', 'Scan all packages in monorepo')
  .option(
    '--diagram <type>',
    'Generate Mermaid diagram: feature-map, orphans, dependencies, full'
  )
  .option('--json', 'Output results as JSON')
  .option(
    '--require-tests <types...>',
    'Require tests for specific spec types (e.g. operation presentation)'
  )
  .action(async (options: IntegrityOptions) => {
    try {
      await runIntegrityAnalysis(options);
    } catch (error) {
      console.error(
        chalk.red('\n❌ Error:'),
        error instanceof Error ? error.message : String(error)
      );
      process.exit(1);
    }
  });

/**
 * Run the integrity analysis.
 */
async function runIntegrityAnalysis(options: IntegrityOptions): Promise<void> {
  const adapters = createNodeAdapters({ silent: false });

  // Determine format
  const format: OutputFormat = options.diagram
    ? 'mermaid'
    : options.json
      ? 'json'
      : ((options.format as OutputFormat) ?? 'text');

  if (format === 'text') {
    console.log(chalk.bold.blue('\n📊 Contract Integrity Analysis\n'));
  }

  // Run analysis (uses default glob pattern from fs adapter)
  const result = await analyzeIntegrity(
    { fs: adapters.fs, logger: adapters.logger },
    {
      all: options.all,
      featureKey: options.feature,
      requireTestsFor: (options.requireTests ??
        []) as import('@contractspec/module.workspace').SpecType[],
    }
  );

  // Output based on format
  switch (format) {
    case 'json':
      outputJson(result, options);
      break;
    case 'mermaid':
      outputMermaid(result, options);
      break;
    case 'text':
    default:
      await outputText(result, options);
      break;
  }

  // Exit with error code if unhealthy
  if (!result.healthy && format === 'text') {
    process.exit(1);
  }
}

/**
 * Output results as text.
 */
async function outputText(
  result: IntegrityAnalysisResult,
  options: IntegrityOptions
): Promise<void> {
  const adapters = createNodeAdapters({ silent: true });

  // Layer stats
  const layers = await discoverLayers(adapters, {});
  console.log(chalk.cyan('Contract Layers:'));
  console.log(
    `  Features: ${layers.stats.features}  Examples: ${layers.stats.examples}  ` +
      `App Configs: ${layers.stats.appConfigs}  Workspace Configs: ${layers.stats.workspaceConfigs}`
  );
  console.log();
  // Features summary
  console.log(chalk.cyan(`Features: ${result.features.length}`));

  for (const feature of result.features) {
    const hasIssues = result.issues.some(
      (i) => i.featureKey === feature.key && i.severity === 'error'
    );
    const icon = hasIssues ? chalk.red('✗') : chalk.green('✓');
    const counts = [
      `${feature.operations.length} ops`,
      `${feature.events.length} events`,
      `${feature.presentations.length} presentations`,
    ].join(', ');

    console.log(`  ${icon} ${chalk.bold(feature.key)} (${counts})`);
  }

  // Coverage summary
  console.log(chalk.cyan('\nCoverage:'));

  for (const [type, stats] of Object.entries(result.coverage.byType)) {
    if (stats.total === 0) continue;

    const percent = Math.round((stats.covered / stats.total) * 100);
    const color =
      percent === 100 ? chalk.green : percent >= 80 ? chalk.yellow : chalk.red;
    const orphanedNote =
      stats.orphaned > 0 ? ` - ${stats.orphaned} orphaned` : '';
    const missingTestNote = stats.missingTest
      ? ` - ${stats.missingTest} missing tests`
      : '';

    console.log(
      `  ${type.padEnd(15)} ${color(`${stats.covered}/${stats.total} (${percent}%)`)}${orphanedNote}${chalk.red(missingTestNote)}`
    );
  }

  // Filter issues based on options
  let issues = result.issues;

  if (options.orphans) {
    issues = issues.filter((i) => i.type === 'orphaned');
  }

  if (options.unresolved) {
    issues = issues.filter((i) => i.type === 'unresolved-ref');
  }

  if (options.type) {
    issues = issues.filter((i) => i.specType === options.type);
  }

  // Issues
  if (issues.length > 0) {
    console.log(chalk.cyan('\nIssues:'));

    for (const issue of issues) {
      const icon =
        issue.severity === 'error' ? chalk.red('✗') : chalk.yellow('⚠');
      const typeLabel = issue.type.toUpperCase().padEnd(12);

      console.log(`  ${icon} ${typeLabel} ${issue.message}`);
      console.log(chalk.gray(`     ${issue.file}`));

      // Show fix hint if available
      // Note: generateFixLinks may handle context differently based on current signature
      // Assuming it takes issue and options
      const links = fix.generateFixLinks(issue, { includeCli: true });
      const cliLink = links.find((l) => l.type === 'cli');
      if (cliLink) {
        console.log(chalk.gray(`     Fix: ${cliLink.value}`));
      }
    }
  }

  // Summary
  console.log();

  if (result.healthy) {
    console.log(chalk.green('✅ All contracts are healthy'));
  } else {
    const errorCount = result.issues.filter(
      (i) => i.severity === 'error'
    ).length;
    const warningCount = result.issues.filter(
      (i) => i.severity === 'warning'
    ).length;

    console.log(
      chalk.red(
        `❌ Found ${errorCount} error(s) and ${warningCount} warning(s)`
      )
    );
  }
}

/**
 * Output results as JSON.
 */
function outputJson(
  result: IntegrityAnalysisResult,
  options: IntegrityOptions
): void {
  // Filter issues based on options
  let issues = result.issues;

  if (options.orphans) {
    issues = issues.filter((i) => i.type === 'orphaned');
  }

  if (options.unresolved) {
    issues = issues.filter((i) => i.type === 'unresolved-ref');
  }

  if (options.type) {
    issues = issues.filter((i) => i.specType === options.type);
  }

  // Convert Maps to objects for JSON serialization
  const inventoryObj: Record<string, { key: string; value: unknown }[]> = {};

  for (const [type, map] of Object.entries(result.inventory)) {
    inventoryObj[type] = Array.from(
      (map as Map<string, unknown>).entries()
    ).map(([key, value]) => ({ key, value }));
  }

  const output = {
    healthy: result.healthy,
    coverage: result.coverage,
    features: result.features.map((f) => ({
      key: f.key,
      title: f.title,
      operations: f.operations.length,
      events: f.events.length,
      presentations: f.presentations.length,
    })),
    orphanedSpecs: result.orphanedSpecs,
    issues: issues.map((issue) => ({
      ...issue,
      fixLinks: fix.generateFixLinks(issue, { includeCli: true }),
    })),
    inventory: inventoryObj,
  };

  console.log(JSON.stringify(output, null, 2));
}

/**
 * Output results as Mermaid diagram.
 */
function outputMermaid(
  result: IntegrityAnalysisResult,
  options: IntegrityOptions
): void {
  const diagramType = options.diagram ?? 'feature-map';
  const diagram = generateMermaidDiagram(result, diagramType, {
    showVersions: true,
    maxNodes: 100,
  });

  console.log(diagram);
}

export { runIntegrityAnalysis };
