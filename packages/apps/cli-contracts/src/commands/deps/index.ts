import { Command } from 'commander';
import chalk from 'chalk';
import {
  analyzeDeps,
  getContractNode,
  exportGraphAsDot,
  getGraphStats,
  createNodeAdapters,
} from '@lssm/bundle.contractspec-workspace';
import { getErrorMessage } from '../../utils/errors';

type OutputFormat = 'text' | 'json' | 'dot';

export const depsCommand = new Command('deps')
  .description('Analyze contract dependencies and relationships')
  .option('--pattern <pattern>', 'File pattern to search (glob)')
  .option('--entry <name>', 'Focus on a specific contract name')
  .option('--format <format>', 'text|json|dot', 'text')
  .option('--circular', 'Find circular dependencies')
  .option('--missing', 'Find missing dependencies')
  .option('--json', '(deprecated) Same as --format json')
  .option('--graph', '(deprecated) Same as --format dot')
  .action(async (options) => {
    try {
      const format: OutputFormat = normalizeFormat(options);
      const adapters = createNodeAdapters({ silent: true });

      const result = await analyzeDeps(adapters, {
        pattern: options.pattern as string | undefined,
      });

      if (result.total === 0) {
        // eslint-disable-next-line no-console
        console.log(chalk.yellow('No spec files found.'));
        return;
      }

      if (options.circular) {
        if (format === 'json') {
          // eslint-disable-next-line no-console
          console.log(JSON.stringify({ cycles: result.cycles }, null, 2));
          return;
        }
        if (result.cycles.length === 0) {
          // eslint-disable-next-line no-console
          console.log(chalk.green('✅ No circular dependencies found'));
          return;
        }
        // eslint-disable-next-line no-console
        console.log(
          chalk.red(`❌ Found ${result.cycles.length} circular dependencies:`)
        );
        result.cycles.forEach((cycle, idx) =>
          // eslint-disable-next-line no-console
          console.log(`  ${idx + 1}. ${cycle.join(' → ')}`)
        );
        return;
      }

      if (options.missing) {
        if (format === 'json') {
          // eslint-disable-next-line no-console
          console.log(JSON.stringify({ missing: result.missing }, null, 2));
          return;
        }
        if (result.missing.length === 0) {
          // eslint-disable-next-line no-console
          console.log(chalk.green('✅ All dependencies resolved'));
          return;
        }
        // eslint-disable-next-line no-console
        console.log(chalk.red('❌ Found missing dependencies:'));
        for (const entry of result.missing) {
          // eslint-disable-next-line no-console
          console.log(`  ${chalk.cyan(entry.contract)} is missing:`);
          for (const dep of entry.missing) {
            // eslint-disable-next-line no-console
            console.log(`    ${chalk.red('→')} ${dep}`);
          }
        }
        return;
      }

      if (format === 'dot') {
        // eslint-disable-next-line no-console
        console.log(exportGraphAsDot(result.graph));
        return;
      }

      if (format === 'json') {
        // eslint-disable-next-line no-console
        console.log(
          JSON.stringify(
            {
              total: result.total,
              contracts: Array.from(result.graph.values()).map((n) => ({
                name: n.name,
                file: n.file,
                dependencies: n.dependencies,
                dependents: n.dependents,
              })),
            },
            null,
            2
          )
        );
        return;
      }

      // text mode
      const entryName: string | undefined = options.entry as string | undefined;
      if (entryName) {
        const node = getContractNode(result.graph, entryName);
        if (!node) {
          // eslint-disable-next-line no-console
          console.error(chalk.red(`Contract '${entryName}' not found.`));
          process.exitCode = 1;
          return;
        }

        // eslint-disable-next-line no-console
        console.log(chalk.bold(`\n📋 Contract: ${node.name}`));
        // eslint-disable-next-line no-console
        console.log(chalk.gray(`File: ${node.file}`));
        // eslint-disable-next-line no-console
        console.log('');

        if (node.dependencies.length > 0) {
          // eslint-disable-next-line no-console
          console.log(chalk.cyan('📥 Depends on:'));
          node.dependencies.forEach((dep) => {
            const depNode = result.graph.get(dep);
            // eslint-disable-next-line no-console
            console.log(
              `  ${chalk.green('→')} ${dep}${
                depNode ? ` (${depNode.file})` : ' (missing)'
              }`
            );
          });
        } else {
          // eslint-disable-next-line no-console
          console.log(chalk.gray('📥 No dependencies'));
        }

        // eslint-disable-next-line no-console
        console.log('');
        if (node.dependents.length > 0) {
          // eslint-disable-next-line no-console
          console.log(chalk.cyan('📤 Used by:'));
          node.dependents.forEach((dep) => {
            const depNode = result.graph.get(dep);
            // eslint-disable-next-line no-console
            console.log(
              `  ${chalk.blue('←')} ${dep}${depNode ? ` (${depNode.file})` : ''}`
            );
          });
        } else {
          // eslint-disable-next-line no-console
          console.log(chalk.gray('📤 Not used by other contracts'));
        }
        return;
      }

      const stats = getGraphStats(result.graph);
      const unused = Array.from(result.graph.values()).filter(
        (c) => c.dependents.length === 0
      );

      // eslint-disable-next-line no-console
      console.log(chalk.bold(`\n📊 Dependency Overview`));
      // eslint-disable-next-line no-console
      console.log(chalk.gray(`Total contracts: ${stats.total}`));
      // eslint-disable-next-line no-console
      console.log(chalk.gray(`Contracts with dependencies: ${stats.withDeps}`));
      // eslint-disable-next-line no-console
      console.log(
        chalk.gray(`Contracts without dependencies: ${stats.withoutDeps}`)
      );
      // eslint-disable-next-line no-console
      console.log(chalk.gray(`Used contracts: ${stats.used}`));
      // eslint-disable-next-line no-console
      console.log(chalk.gray(`Unused contracts: ${stats.unused}`));

      if (unused.length > 0) {
        // eslint-disable-next-line no-console
        console.log(chalk.yellow('\n⚠️  Potentially unused contracts:'));
        unused.forEach((c) =>
          // eslint-disable-next-line no-console
          console.log(`  ${chalk.gray(c.name)} (${c.file})`)
        );
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(
        chalk.red(`Error analyzing dependencies: ${getErrorMessage(error)}`)
      );
      process.exit(1);
    }
  });

function normalizeFormat(options: unknown): OutputFormat {
  const o = options as {
    format?: string;
    json?: boolean;
    graph?: boolean;
  };

  if (o.json) return 'json';
  if (o.graph) return 'dot';
  if (o.format === 'dot') return 'dot';
  if (o.format === 'json') return 'json';
  return 'text';
}
