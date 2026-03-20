import { execSync } from 'node:child_process';
import { rmSync, statSync } from 'node:fs';
import { confirm } from '@inquirer/prompts';
import chalk from 'chalk';
import { Command } from 'commander';
import { glob } from 'glob';
import { loadConfig } from '../../utils/config';
import { getErrorMessage } from '../../utils/errors';

export const cleanCommand = new Command('clean')
	.description('Clean generated files and build artifacts')
	.option('--dry-run', 'Show what would be deleted without deleting')
	.option(
		'--generated-only',
		'Only clean generated directories (generated/, dist/, .turbo/, outputDir artifacts)'
	)
	.option('--older-than <days>', 'Only clean files older than specified days')
	.option('--force', 'Skip confirmation prompts')
	.option('--git-clean', 'Use git clean -fdx for comprehensive cleanup')
	.action(async (options) => {
		const { dryRun, generatedOnly, olderThan, force, gitClean } = options;

		if (gitClean) {
			const requiresConfirmation = !force && !dryRun;
			if (requiresConfirmation) {
				if (!process.stdout.isTTY) {
					console.error(
						chalk.red(
							'❌ Refusing to run git clean without --force in non-interactive mode.'
						)
					);
					process.exit(1);
				}
				const ok = await confirm({
					message:
						'This will run `git clean -fdx` and delete ALL untracked files (including ignored files). Continue?',
					default: false,
				});
				if (!ok) {
					console.log(chalk.yellow('Cancelled.'));
					return;
				}
			}

			console.log(
				chalk.bold('🧹 Using git clean for comprehensive cleanup...')
			);
			try {
				const output = dryRun ? '--dry-run' : '';
				execSync(`git clean -fdx ${output}`, { stdio: 'inherit' });
				console.log(chalk.green('✅ Git clean completed'));
				return;
			} catch (error) {
				console.error(
					chalk.red(`❌ Git clean failed: ${getErrorMessage(error)}`)
				);
				return;
			}
		}

		console.log(chalk.bold('🧹 Cleaning ContractSpec artifacts...'));
		if (dryRun) console.log(chalk.yellow('DRY RUN - No files will be deleted'));
		console.log('');

		const config = await loadConfig();
		const outputDir = config.outputDir || './src';

		// Safe-by-default: only known build artifacts / generated folders.
		// Never delete arbitrary TS/TSX under src without strong suffix constraints.
		const basePatterns = ['generated/**', 'dist/**', '.turbo/**'];

		const outputDirPatterns = [
			`${outputDir.replace(/\\/g, '/')}/handlers/**/*.handler.ts`,
			`${outputDir.replace(/\\/g, '/')}/handlers/**/*.handler.test.ts`,
			`${outputDir.replace(/\\/g, '/')}/components/**/*.tsx`,
			`${outputDir.replace(/\\/g, '/')}/components/**/*.test.tsx`,
			`${outputDir.replace(/\\/g, '/')}/forms/**/*.form.tsx`,
			`${outputDir.replace(/\\/g, '/')}/forms/**/*.form.test.tsx`,
			`${outputDir.replace(/\\/g, '/')}/**/*.runner.ts`,
			`${outputDir.replace(/\\/g, '/')}/**/*.renderer.tsx`,
		];

		const patterns = generatedOnly
			? [...basePatterns, ...outputDirPatterns]
			: [
					...basePatterns,
					'**/*.generated.ts',
					'**/*.generated.js',
					'**/*.generated.d.ts',
					...outputDirPatterns,
				];

		let totalFiles = 0;
		let totalSize = 0;

		for (const pattern of patterns) {
			try {
				const files = await glob(pattern, {
					ignore: ['node_modules/**'],
					dot: true,
				});

				for (const file of files) {
					try {
						const stats = statSync(file);
						const ageInDays =
							(Date.now() - stats.mtime.getTime()) / (1000 * 60 * 60 * 24);

						// Check age filter
						if (olderThan && ageInDays < parseInt(olderThan)) {
							continue;
						}

						if (dryRun) {
							console.log(
								chalk.gray(
									`Would remove: ${file} (${(stats.size / 1024).toFixed(1)} KB, ${ageInDays.toFixed(1)} days old)`
								)
							);
						} else {
							rmSync(file, { recursive: true, force: true });
							console.log(
								chalk.green(
									stats.isDirectory()
										? `🗂️  Removed directory: ${file}`
										: `🗑️  Removed: ${file} (${(stats.size / 1024).toFixed(1)} KB)`
								)
							);
						}

						totalFiles++;
						totalSize += stats.size;
					} catch (error) {
						console.log(
							chalk.yellow(
								`⚠️  Could not process ${file}: ${getErrorMessage(error)}`
							)
						);
					}
				}
			} catch (error) {
				console.log(
					chalk.yellow(
						`⚠️  Error processing pattern ${pattern}: ${getErrorMessage(error)}`
					)
				);
			}
		}

		console.log('');
		if (dryRun) {
			console.log(
				chalk.cyan(
					`📊 Would clean ${totalFiles} files (${(totalSize / 1024 / 1024).toFixed(2)} MB)`
				)
			);
		} else {
			console.log(
				chalk.green(
					`✅ Cleaned ${totalFiles} files (${(totalSize / 1024 / 1024).toFixed(2)} MB)`
				)
			);
		}

		if (totalFiles === 0) {
			console.log(chalk.gray('No files to clean.'));
		}
	});
