import {
	analyzeDeps,
	createNodeAdapters,
	exportGraphAsDot,
	getContractNode,
	getGraphStats,
} from '@contractspec/bundle.workspace';
import chalk from 'chalk';
import { Command } from 'commander';
import { getErrorMessage } from '../../utils/errors';

type OutputFormat = 'text' | 'json' | 'dot';

export const depsCommand = new Command('deps')
	.description('Analyze contract dependencies and relationships')
	.option('--pattern <pattern>', 'File pattern to search (glob)')
	.option('--entry <key>', 'Focus on a specific contract key')
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
				console.log(chalk.yellow('No spec files found.'));
				return;
			}

			if (options.circular) {
				if (format === 'json') {
					console.log(JSON.stringify({ cycles: result.cycles }, null, 2));
					return;
				}
				if (result.cycles.length === 0) {
					console.log(chalk.green('✅ No circular dependencies found'));
					return;
				}

				console.log(
					chalk.red(`❌ Found ${result.cycles.length} circular dependencies:`)
				);
				result.cycles.forEach((cycle, idx) =>
					console.log(`  ${idx + 1}. ${cycle.join(' → ')}`)
				);
				return;
			}

			if (options.missing) {
				if (format === 'json') {
					console.log(JSON.stringify({ missing: result.missing }, null, 2));
					return;
				}
				if (result.missing.length === 0) {
					console.log(chalk.green('✅ All dependencies resolved'));
					return;
				}

				console.log(chalk.red('❌ Found missing dependencies:'));
				for (const entry of result.missing) {
					console.log(`  ${chalk.cyan(entry.contract)} is missing:`);
					for (const dep of entry.missing) {
						console.log(`    ${chalk.red('→')} ${dep}`);
					}
				}
				return;
			}

			if (format === 'dot') {
				console.log(exportGraphAsDot(result.graph));
				return;
			}

			if (format === 'json') {
				console.log(
					JSON.stringify(
						{
							total: result.total,
							contracts: Array.from(result.graph.values()).map((n) => ({
								key: n.key,
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
			const entryKey: string | undefined = options.entry as string | undefined;
			if (entryKey) {
				const node = getContractNode(result.graph, entryKey);
				if (!node) {
					console.error(chalk.red(`Contract '${entryKey}' not found.`));
					process.exitCode = 1;
					return;
				}

				console.log(chalk.bold(`\n📋 Contract: ${node.key}`));

				console.log(chalk.gray(`File: ${node.file}`));

				console.log('');

				if (node.dependencies.length > 0) {
					console.log(chalk.cyan('📥 Depends on:'));
					node.dependencies.forEach((dep) => {
						const depNode = result.graph.get(dep);

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
						const depNode = result.graph.get(dep);

						console.log(
							`  ${chalk.blue('←')} ${dep}${depNode ? ` (${depNode.file})` : ''}`
						);
					});
				} else {
					console.log(chalk.gray('📤 Not used by other contracts'));
				}
				return;
			}

			const stats = getGraphStats(result.graph);
			const unused = Array.from(result.graph.values()).filter(
				(c) => c.dependents.length === 0
			);

			console.log(chalk.bold(`\n📊 Dependency Overview`));

			console.log(chalk.gray(`Total contracts: ${stats.total}`));

			console.log(chalk.gray(`Contracts with dependencies: ${stats.withDeps}`));

			console.log(
				chalk.gray(`Contracts without dependencies: ${stats.withoutDeps}`)
			);

			console.log(chalk.gray(`Used contracts: ${stats.used}`));

			console.log(chalk.gray(`Unused contracts: ${stats.unused}`));

			if (unused.length > 0) {
				console.log(chalk.yellow('\n⚠️  Potentially unused contracts:'));
				unused.forEach((c) =>
					console.log(`  ${chalk.gray(c.key)} (${c.file})`)
				);
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
