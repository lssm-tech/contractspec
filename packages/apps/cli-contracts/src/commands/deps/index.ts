import { Command } from 'commander';
import chalk from 'chalk';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { discoverSpecFiles } from '../../utils/spec-files';
import { getErrorMessage } from '../../utils/errors';
import { parseImportedSpecNames } from './parse-imports';
import {
  type ContractGraph,
  type ContractNode,
  buildReverseEdges,
  detectCycles,
  findMissingDependencies,
  toDot,
} from './graph';

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

      const files = await discoverSpecFiles({ pattern: options.pattern });
      if (files.length === 0) {
        console.log(chalk.yellow('No spec files found.'));
        return;
      }

      const graph: ContractGraph = new Map();

      for (const file of files) {
        const content = readFileSync(file, 'utf-8');
        const relativePath = path.relative(process.cwd(), file);

        // Prefer explicit meta.name if present; otherwise fall back to filename stem.
        const nameMatch = content.match(/name:\s*['"]([^'"]+)['"]/);
        const inferredName = nameMatch?.[1]
          ? nameMatch[1]
          : path
              .basename(file)
              .replace(/\.[jt]s$/, '')
              .replace(
                /\.(contracts|event|presentation|workflow|data-view|migration|telemetry|experiment|app-config|integration|knowledge)$/,
                ''
              );

        const finalName = inferredName || 'unknown';
        const dependencies = parseImportedSpecNames(content, file);

        const node: ContractNode = {
          name: finalName,
          file: relativePath,
          dependencies,
          dependents: [],
        };

        graph.set(finalName, node);
      }

      buildReverseEdges(graph);

      if (options.circular) {
        const cycles = detectCycles(graph);
        if (format === 'json') {
          console.log(JSON.stringify({ cycles }, null, 2));
          return;
        }
        if (cycles.length === 0) {
          console.log(chalk.green('✅ No circular dependencies found'));
          return;
        }
        console.log(chalk.red(`❌ Found ${cycles.length} circular dependencies:`));
        cycles.forEach((cycle, idx) =>
          console.log(`  ${idx + 1}. ${cycle.join(' → ')}`)
        );
        return;
      }

      if (options.missing) {
        const missing = findMissingDependencies(graph);
        if (format === 'json') {
          console.log(JSON.stringify({ missing }, null, 2));
          return;
        }
        if (missing.length === 0) {
          console.log(chalk.green('✅ All dependencies resolved'));
          return;
        }
        console.log(chalk.red('❌ Found missing dependencies:'));
        for (const entry of missing) {
          console.log(`  ${chalk.cyan(entry.contract)} is missing:`);
          for (const dep of entry.missing) {
            console.log(`    ${chalk.red('→')} ${dep}`);
          }
        }
        return;
      }

      if (format === 'dot') {
        console.log(toDot(graph));
        return;
      }

      if (format === 'json') {
        console.log(
          JSON.stringify(
            {
              total: graph.size,
              contracts: Array.from(graph.values()).map((n) => ({
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
      const entryName: string | undefined = options.entry;
      if (entryName) {
        const node = graph.get(entryName);
        if (!node) {
          console.error(chalk.red(`Contract '${entryName}' not found.`));
          process.exitCode = 1;
          return;
        }

        console.log(chalk.bold(`\n📋 Contract: ${node.name}`));
        console.log(chalk.gray(`File: ${node.file}`));
        console.log('');

        if (node.dependencies.length > 0) {
          console.log(chalk.cyan('📥 Depends on:'));
          node.dependencies.forEach((dep) => {
            const depNode = graph.get(dep);
            console.log(
              `  ${chalk.green('→')} ${dep}${
                depNode ? ` (${depNode.file})` : ' (missing)'
              }`
            );
          });
        } else {
          console.log(chalk.gray('📥 No dependencies'));
        }

        console.log('');
        if (node.dependents.length > 0) {
          console.log(chalk.cyan('📤 Used by:'));
          node.dependents.forEach((dep) => {
            const depNode = graph.get(dep);
            console.log(
              `  ${chalk.blue('←')} ${dep}${
                depNode ? ` (${depNode.file})` : ''
              }`
            );
          });
        } else {
          console.log(chalk.gray('📤 Not used by other contracts'));
        }
        return;
      }

      console.log(chalk.bold(`\n📊 Dependency Overview`));
      console.log(chalk.gray(`Total contracts: ${graph.size}`));
      const all = Array.from(graph.values());
      const withDeps = all.filter((c) => c.dependencies.length > 0);
      const withoutDeps = all.filter((c) => c.dependencies.length === 0);
      const used = all.filter((c) => c.dependents.length > 0);
      const unused = all.filter((c) => c.dependents.length === 0);

      console.log(chalk.gray(`Contracts with dependencies: ${withDeps.length}`));
      console.log(chalk.gray(`Contracts without dependencies: ${withoutDeps.length}`));
      console.log(chalk.gray(`Used contracts: ${used.length}`));
      console.log(chalk.gray(`Unused contracts: ${unused.length}`));

      if (unused.length > 0) {
        console.log(chalk.yellow('\n⚠️  Potentially unused contracts:'));
        unused.forEach((c) => console.log(`  ${chalk.gray(c.name)} (${c.file})`));
      }
    } catch (error) {
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


