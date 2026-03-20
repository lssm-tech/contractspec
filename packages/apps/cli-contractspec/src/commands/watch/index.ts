import path from 'node:path';
import { createNodeAdapters } from '@contractspec/bundle.workspace';
import chalk from 'chalk';
import { Command } from 'commander';
import { loadConfig, mergeConfig } from '../../utils/config';
import { getErrorMessage } from '../../utils/errors';
import { buildCommand } from '../build-cmd';
import { validateCommand } from '../validate';

export const watchCommand = new Command('watch')
	.description('Watch contract specs and auto-regenerate on changes')
	.option('--pattern <pattern>', 'File pattern to watch', '**/*.contracts.ts')
	.option('--build', 'Auto-run build command on changes')
	.option('--validate', 'Auto-run validate command on changes')
	.option(
		'--on-start <mode>',
		'Run action on startup: none|validate|build|both',
		'none'
	)
	.option('--continue-on-error', 'Do not exit on build/validate errors', false)
	.option(
		'--debounce <ms>',
		'Debounce delay in milliseconds',
		(value) => Number(value),
		500
	)
	.action(async (options) => {
		const { pattern, build, validate, debounce, onStart, continueOnError } =
			options as {
				pattern: string;
				build?: boolean;
				validate?: boolean;
				debounce: number;
				onStart: 'none' | 'validate' | 'build' | 'both';
				continueOnError: boolean;
			};

		console.log(chalk.bold('👀 Watching contract specs...'));

		console.log(chalk.gray(`Pattern: ${pattern}`));

		console.log(chalk.gray(`Debounce: ${debounce}ms`));

		if (build) {
			console.log(chalk.gray('Auto-build: enabled'));
		}
		if (validate) {
			console.log(chalk.gray('Auto-validate: enabled'));
		}
		if (onStart !== 'none') {
			console.log(chalk.gray(`On start: ${onStart}`));
		}

		console.log('');

		const adapters = createNodeAdapters({ silent: true });

		const runValidate = async (filePath: string) => {
			console.log(chalk.gray('🔍 Validating...'));
			const config = await loadConfig();
			await validateCommand(filePath, {}, config);
		};

		const runBuild = async (filePath: string) => {
			console.log(chalk.gray('🔨 Building...'));
			const config = await loadConfig();
			const merged = mergeConfig(config, {});
			await buildCommand(filePath, {}, merged);
		};

		const runActions = async (filePath: string) => {
			const relativePath = path.relative(process.cwd(), filePath);

			console.log(chalk.blue(`📝 Changed: ${relativePath}`));

			const shouldValidate =
				validate || onStart === 'validate' || onStart === 'both';
			const shouldBuild = build || onStart === 'build' || onStart === 'both';

			if (shouldValidate) {
				try {
					await runValidate(filePath);

					console.log(chalk.green('✅ Validation passed'));
				} catch (error) {
					console.log(
						chalk.red(`❌ Validation failed: ${getErrorMessage(error)}`)
					);
					if (!continueOnError) {
						process.exitCode = 1;
					}
				}
			}

			if (shouldBuild) {
				try {
					await runBuild(filePath);

					console.log(chalk.green('✅ Build completed'));
				} catch (error) {
					console.log(chalk.red(`❌ Build failed: ${getErrorMessage(error)}`));
					if (!continueOnError) {
						process.exitCode = 1;
					}
				}
			}

			console.log('');
		};

		// Optional on-start run (only if --on-start is set)
		if (onStart !== 'none') {
			console.log(
				chalk.yellow(
					'⚠️  --on-start is best used with a specific --pattern that targets one spec file.'
				)
			);
		}

		const watcher = adapters.watcher.watch({
			pattern,
			debounceMs: debounce,
			ignore: ['node_modules/**', 'dist/**', '.turbo/**'],
		});

		watcher.on(async (event) => {
			if (event.type === 'change') {
				await runActions(event.path);
			} else if (event.type === 'add') {
				const relativePath = path.relative(process.cwd(), event.path);

				console.log(chalk.green(`📄 Added: ${relativePath}`));
			} else if (event.type === 'unlink') {
				const relativePath = path.relative(process.cwd(), event.path);

				console.log(chalk.red(`🗑️  Removed: ${relativePath}`));
			}
		});

		// Graceful shutdown
		process.on('SIGINT', () => {
			console.log(chalk.yellow('\n👋 Stopping watch mode...'));
			watcher.close();
			process.exit(0);
		});
	});
