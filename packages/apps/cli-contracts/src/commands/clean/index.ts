import { Command } from 'commander';
import chalk from 'chalk';
import { glob } from 'glob';
import { statSync, unlinkSync, rmdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { execSync } from 'child_process';

export const cleanCommand = new Command('clean')
  .description('Clean generated files and build artifacts')
  .option('--dry-run', 'Show what would be deleted without deleting')
  .option('--generated-only', 'Only clean generated directories (generated/, dist/, .turbo/)')
  .option('--older-than <days>', 'Only clean files older than specified days')
  .option('--force', 'Skip confirmation prompts')
  .option('--git-clean', 'Use git clean -fdx for comprehensive cleanup')
  .action(async (options) => {
    const { dryRun, generatedOnly, olderThan, force, gitClean } = options;

    if (gitClean) {
      console.log(chalk.bold('🧹 Using git clean for comprehensive cleanup...'));
      try {
        const output = dryRun ? '--dry-run' : '';
        execSync(`git clean -fdx ${output}`, { stdio: 'inherit' });
        console.log(chalk.green('✅ Git clean completed'));
        return;
      } catch (error: any) {
        console.error(chalk.red(`❌ Git clean failed: ${error.message}`));
        return;
      }
    }

    console.log(chalk.bold('🧹 Cleaning ContractSpec artifacts...'));
    if (dryRun) console.log(chalk.yellow('DRY RUN - No files will be deleted'));
    console.log('');

    const patterns = generatedOnly ? [
      'generated/**',
      'dist/**',
      '.turbo/**',
      '**/generated/**',
      '**/dist/**',
      '**/.turbo/**'
    ] : [
      'generated/**',
      'dist/**',
      '.turbo/**',
      '**/*.generated.ts',
      '**/*.generated.js',
      '**/*.generated.d.ts',
      '**/generated/**',
      '**/dist/**',
      '**/.turbo/**'
    ];

    let totalFiles = 0;
    let totalSize = 0;

    for (const pattern of patterns) {
      try {
        const files = await glob(pattern, {
          ignore: ['node_modules/**'],
          dot: true
        });

        for (const file of files) {
          try {
            const stats = statSync(file);
            const ageInDays = (Date.now() - stats.mtime.getTime()) / (1000 * 60 * 60 * 24);

            // Check age filter
            if (olderThan && ageInDays < parseInt(olderThan)) {
              continue;
            }

            if (dryRun) {
              console.log(chalk.gray(`Would remove: ${file} (${(stats.size / 1024).toFixed(1)} KB, ${ageInDays.toFixed(1)} days old)`));
            } else {
              if (stats.isDirectory()) {
                // For directories, try to remove recursively
                try {
                  rmdirSync(file, { recursive: true });
                  console.log(chalk.green(`🗂️  Removed directory: ${file}`));
                } catch (dirError: any) {
                  console.log(chalk.yellow(`⚠️  Could not remove directory: ${file} (${dirError.message})`));
                }
              } else {
                unlinkSync(file);
                console.log(chalk.green(`🗑️  Removed: ${file} (${(stats.size / 1024).toFixed(1)} KB)`));
              }
            }

            totalFiles++;
            totalSize += stats.size;

          } catch (error: any) {
            console.log(chalk.yellow(`⚠️  Could not process ${file}: ${error.message}`));
          }
        }
      } catch (error: any) {
        console.log(chalk.yellow(`⚠️  Error processing pattern ${pattern}: ${error.message}`));
      }
    }

    console.log('');
    if (dryRun) {
      console.log(chalk.cyan(`📊 Would clean ${totalFiles} files (${(totalSize / 1024 / 1024).toFixed(2)} MB)`));
    } else {
      console.log(chalk.green(`✅ Cleaned ${totalFiles} files (${(totalSize / 1024 / 1024).toFixed(2)} MB)`));
    }

    if (totalFiles === 0) {
      console.log(chalk.gray('No files to clean.'));
    }
  });
