/**
 * Changelog generation CLI command.
 *
 * Generate changelogs at per-spec, per-library, and monorepo levels.
 *
 * Usage:
 *   contractspec changelog generate              # Generate all changelog tiers
 *   contractspec changelog generate --baseline main
 *   contractspec changelog show <spec-key>       # Show per-spec changelog
 *
 * @module commands/changelog
 */

import { Command } from 'commander';
import chalk from 'chalk';
import {
  createConsoleLoggerAdapter,
  createNodeFsAdapter,
  createNodeGitAdapter,
  versioning,
} from '@contractspec/bundle.workspace';
import type { ChangelogTier } from '@contractspec/lib.contracts';

export interface ChangelogGenerateOptions {
  baseline?: string;
  tiers?: string;
  format?: 'keep-a-changelog' | 'conventional';
  output?: string;
  dryRun?: boolean;
}

export interface ChangelogShowOptions {
  format?: 'text' | 'json';
}

/**
 * Create the changelog command.
 */
export function createChangelogCommand(): Command {
  const command = new Command('changelog').description(
    'Generate and view changelogs'
  );

  // changelog generate
  command
    .command('generate')
    .description('Generate changelogs from spec changes')
    .option('-b, --baseline <ref>', 'Git ref to compare against')
    .option(
      '-t, --tiers <tiers>',
      'Changelog tiers to generate (spec,library,monorepo)',
      'spec,library,monorepo'
    )
    .option(
      '-f, --format <format>',
      'Changelog format (keep-a-changelog, conventional)',
      'keep-a-changelog'
    )
    .option('-o, --output <dir>', 'Output directory for changelog files')
    .option('--dry-run', 'Preview changelogs without writing files')
    .action(runChangelogGenerate);

  // changelog show
  command
    .command('show')
    .argument('<spec-key>', 'Spec key to show changelog for')
    .description('Show changelog for a specific spec')
    .option('-f, --format <format>', 'Output format (text, json)', 'text')
    .action(runChangelogShow);

  return command;
}

/**
 * Run the changelog generate command.
 */
async function runChangelogGenerate(
  options: ChangelogGenerateOptions
): Promise<void> {
  const fs = createNodeFsAdapter();
  const git = createNodeGitAdapter();
  const logger = createConsoleLoggerAdapter();

  try {
    console.log(chalk.blue('Generating changelogs...'));

    // Parse tiers
    const tiers = (options.tiers?.split(',') ?? [
      'spec',
      'library',
      'monorepo',
    ]) as ChangelogTier[];

    const result = await versioning.generateChangelogs(
      { fs, git, logger },
      {
        baseline: options.baseline,
        tiers,
        format: options.format,
      }
    );

    if (result.totalEntries === 0) {
      console.log(chalk.green('✅ No changes to document'));
      return;
    }

    console.log('');
    console.log(chalk.bold('Changelog Summary:'));

    // Per-spec changelogs
    if (result.specChangelogs.length > 0) {
      console.log(
        chalk.cyan(`  📄 ${result.specChangelogs.length} spec changelogs`)
      );
      for (const spec of result.specChangelogs.slice(0, 5)) {
        console.log(
          chalk.gray(`      • ${spec.specKey} (${spec.specVersion})`)
        );
      }
      if (result.specChangelogs.length > 5) {
        console.log(
          chalk.gray(`      ... and ${result.specChangelogs.length - 5} more`)
        );
      }
    }

    // Library changelogs
    if (result.libraryMarkdown.size > 0) {
      console.log(
        chalk.cyan(`  📦 ${result.libraryMarkdown.size} library changelogs`)
      );
    }

    // Monorepo changelog
    if (result.monorepoMarkdown) {
      console.log(chalk.cyan('  📚 Monorepo changelog'));
    }

    // Preview or write
    if (options.dryRun) {
      console.log('');
      console.log(chalk.yellow('Dry run - no files written'));
      console.log('');
      console.log(chalk.bold('Monorepo changelog preview:'));
      console.log('─'.repeat(60));
      console.log(result.monorepoMarkdown.slice(0, 2000));
      if (result.monorepoMarkdown.length > 2000) {
        console.log(chalk.gray('... (truncated)'));
      }
    } else if (options.output) {
      // Write files
      const outputDir = options.output;

      // Write monorepo changelog
      const monorepoPath = `${outputDir}/CHANGELOG.md`;
      await fs.writeFile(monorepoPath, result.monorepoMarkdown);
      console.log(chalk.green(`  ✅ Wrote ${monorepoPath}`));

      // Write JSON export
      const jsonPath = `${outputDir}/changelog.json`;
      await fs.writeFile(jsonPath, JSON.stringify(result.json, null, 2));
      console.log(chalk.green(`  ✅ Wrote ${jsonPath}`));

      console.log('');
      console.log(chalk.green('✅ Changelogs generated successfully'));
    } else {
      // Output to stdout
      console.log('');
      console.log(result.monorepoMarkdown);
    }
  } catch (error) {
    console.error(
      chalk.red('❌ Error:'),
      error instanceof Error ? error.message : String(error)
    );
    process.exit(1);
  }
}

/**
 * Run the changelog show command.
 */
async function runChangelogShow(
  specKey: string,
  options: ChangelogShowOptions
): Promise<void> {
  const fs = createNodeFsAdapter();
  const git = createNodeGitAdapter();
  const logger = createConsoleLoggerAdapter();

  try {
    const result = await versioning.generateChangelogs(
      { fs, git, logger },
      { tiers: ['spec'] }
    );

    const specChangelog = result.specChangelogs.find(
      (s) => s.specKey === specKey
    );

    if (!specChangelog) {
      console.log(chalk.yellow(`No changelog found for spec: ${specKey}`));
      return;
    }

    if (options.format === 'json') {
      console.log(JSON.stringify(specChangelog, null, 2));
    } else {
      console.log(chalk.bold(`Changelog for ${specKey}`));
      console.log('─'.repeat(40));
      console.log(specChangelog.body);
    }
  } catch (error) {
    console.error(
      chalk.red('❌ Error:'),
      error instanceof Error ? error.message : String(error)
    );
    process.exit(1);
  }
}
