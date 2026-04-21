import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { validateExamples } from '@contractspec/lib.contracts-spec/examples/validation';
import {
	getExample,
	listExamples,
	searchExamples,
} from '@contractspec/module.examples/catalog';
import chalk from 'chalk';
import { Command } from 'commander';
import { downloadExampleSource } from './download';
import {
	validateGeneratedRegistry,
	validateWorkspaceExamplesFolder,
} from './validation';

export const examplesCommand = new Command('examples')
	.description('Browse, inspect, and validate ContractSpec examples')
	.addCommand(
		new Command('list')
			.description('List examples')
			.option('--json', 'Output JSON', false)
			.option('-q, --query <query>', 'Filter by query')
			.action((options) => {
				const items = options.query
					? searchExamples(String(options.query))
					: [...listExamples()];
				if (options.json) {
					console.log(JSON.stringify(items, null, 2));
					return;
				}
				for (const ex of items) {
					console.log(
						`${chalk.cyan(ex.meta.key)}  ${ex.meta.title}  ${chalk.gray(ex.meta.kind)}`
					);
				}
			})
	)
	.addCommand(
		new Command('show')
			.description('Show a single example manifest')
			.argument('<key>', 'Example key')
			.option('--json', 'Output JSON', true)
			.action((key: string) => {
				const example = getExample(key);
				if (!example) {
					console.error(chalk.red(`❌ Example not found: ${key}`));
					process.exitCode = 1;
					return;
				}

				console.log(JSON.stringify(example, null, 2));
			})
	)
	.addCommand(
		new Command('init')
			.description(
				'Write a small workspace stub for an example (manifest + README)'
			)
			.argument('<key>', 'Example key')
			.option(
				'-o, --out-dir <dir>',
				'Output directory (default: ./.contractspec/examples/<key>)'
			)
			.action(async (key: string, options) => {
				const example = getExample(key);
				if (!example) {
					console.error(chalk.red(`❌ Example not found: ${key}`));
					process.exitCode = 1;
					return;
				}

				const base = process.cwd();
				const outDir = options.outDir
					? path.resolve(base, String(options.outDir))
					: path.resolve(base, '.contractspec', 'examples', example.meta.key);

				await fs.mkdir(outDir, { recursive: true });
				await fs.writeFile(
					path.join(outDir, 'example.json'),
					JSON.stringify(example, null, 2),
					'utf8'
				);
				await fs.writeFile(
					path.join(outDir, 'README.md'),
					[
						`# ${example.meta.title}`,
						'',
						example.meta.summary,
						'',
						`- id: \`${example.meta.key}\``,
						`- package: \`${example.entrypoints.packageName}\``,
						'',
						'This folder is a lightweight workspace stub that references an example manifest.',
					].join('\n'),
					'utf8'
				);

				console.log(
					chalk.green(`✅ Initialized ${example.meta.key} at ${outDir}`)
				);
			})
	)
	.addCommand(
		new Command('download')
			.description('Download the full source for an example via git')
			.argument('<key>', 'Example key')
			.option(
				'-o, --out-dir <dir>',
				'Output directory (default: ./.contractspec/examples/<key>/source)'
			)
			.action(async (key: string, options) => {
				try {
					const result = await downloadExampleSource({
						key,
						outDir: options.outDir ? String(options.outDir) : undefined,
					});
					console.log(
						chalk.green(
							`✅ Downloaded ${result.key} source to ${result.outDir}`
						)
					);
				} catch (error) {
					console.error(
						chalk.red(
							`❌ ${error instanceof Error ? error.message : String(error)}`
						)
					);
					process.exitCode = 1;
				}
			})
	)
	.addCommand(
		new Command('validate')
			.description(
				'Validate example manifests and enforce same-file DocBlock rules for workspace example packages'
			)
			.option(
				'--repo-root <dir>',
				'Repository root (default: current working directory)'
			)
			.action(async (options) => {
				const examples = [...listExamples()];
				const validation = validateExamples(examples);
				if (!validation.ok) {
					console.error(chalk.red('❌ Example manifest validation failed'));
					for (const err of validation.errors) {
						console.error(
							chalk.red(`- ${err.exampleKey ?? 'unknown'}: ${err.message}`) +
								(err.path ? chalk.gray(` (${err.path})`) : '')
						);
					}
					process.exitCode = 1;
					return;
				}

				const repoRoot = path.resolve(
					process.cwd(),
					String(options.repoRoot ?? '.')
				);
				const checks = await validateWorkspaceExamplesFolder(
					repoRoot,
					examples
				);
				const failures = checks.filter((c) => c.errors.length > 0);
				const warnings = checks.filter((c) => c.warnings.length > 0);
				const registryErrors = await validateGeneratedRegistry(repoRoot);

				if (failures.length || registryErrors.length) {
					console.error(
						chalk.red(
							`❌ Workspace example package validation failed (${failures.length + registryErrors.length})`
						)
					);
					for (const f of failures) {
						console.error(chalk.red(`\n${f.exampleDir}`));
						for (const e of f.errors) {
							console.error(chalk.red(`  - ${e}`));
						}
						for (const warning of f.warnings) {
							console.error(chalk.yellow(`  - warning: ${warning}`));
						}
					}
					if (registryErrors.length) {
						console.error(
							chalk.red(`
${path.join(repoRoot, 'packages', 'modules', 'examples')}`)
						);
						for (const error of registryErrors) {
							console.error(chalk.red(`  - ${error}`));
						}
					}
					process.exitCode = 1;
					return;
				}

				if (warnings.length > 0) {
					console.warn(
						chalk.yellow(
							`⚠️ Example validation warnings (${warnings.reduce((total, item) => total + item.warnings.length, 0)})`
						)
					);
					for (const warningGroup of warnings) {
						console.warn(chalk.yellow(`\n${warningGroup.exampleDir}`));
						for (const warning of warningGroup.warnings) {
							console.warn(chalk.yellow(`  - ${warning}`));
						}
					}
				}

				console.log(
					chalk.green(
						`✅ Examples valid (${examples.length} manifests, ${checks.length} folders)`
					)
				);
			})
	);
