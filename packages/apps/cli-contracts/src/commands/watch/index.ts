import { Command } from 'commander';
import chokidar from 'chokidar';
import chalk from 'chalk';
import { execSync } from 'child_process';
import path from 'path';

export const watchCommand = new Command('watch')
  .description('Watch contract specs and auto-regenerate on changes')
  .option('--pattern <pattern>', 'File pattern to watch', '**/*.contracts.ts')
  .option('--build', 'Auto-run build command on changes')
  .option('--validate', 'Auto-run validate command on changes')
  .option('--debounce <ms>', 'Debounce delay in milliseconds', '500')
  .action(async (options) => {
    const { pattern, build, validate, debounce } = options;

    console.log(chalk.bold('👀 Watching contract specs...'));
    console.log(chalk.gray(`Pattern: ${pattern}`));
    console.log(chalk.gray(`Debounce: ${debounce}ms`));

    if (build) console.log(chalk.gray('Auto-build: enabled'));
    if (validate) console.log(chalk.gray('Auto-validate: enabled'));

    console.log('');

    let debounceTimer: NodeJS.Timeout;

    const watcher = chokidar.watch(pattern, {
      ignored: ['node_modules/**', 'dist/**', '.turbo/**'],
      persistent: true,
      ignoreInitial: true
    });

    watcher.on('change', (filePath) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        const relativePath = path.relative(process.cwd(), filePath);
        console.log(chalk.blue(`📝 Changed: ${relativePath}`));

        if (validate) {
          try {
            console.log(chalk.gray('🔍 Validating...'));
            execSync(`contractspec validate "${filePath}"`, { stdio: 'inherit' });
            console.log(chalk.green('✅ Validation passed'));
          } catch (error) {
            console.log(chalk.red('❌ Validation failed'));
          }
        }

        if (build) {
          try {
            console.log(chalk.gray('🔨 Building...'));
            execSync(`contractspec build "${filePath}"`, { stdio: 'inherit' });
            console.log(chalk.green('✅ Build completed'));
          } catch (error) {
            console.log(chalk.red('❌ Build failed'));
          }
        }

        console.log('');
      }, parseInt(debounce));
    });

    watcher.on('add', (filePath) => {
      const relativePath = path.relative(process.cwd(), filePath);
      console.log(chalk.green(`📄 Added: ${relativePath}`));
    });

    watcher.on('unlink', (filePath) => {
      const relativePath = path.relative(process.cwd(), filePath);
      console.log(chalk.red(`🗑️  Removed: ${relativePath}`));
    });

    // Graceful shutdown
    process.on('SIGINT', () => {
      console.log(chalk.yellow('\n👋 Stopping watch mode...'));
      watcher.close();
      process.exit(0);
    });
  });
