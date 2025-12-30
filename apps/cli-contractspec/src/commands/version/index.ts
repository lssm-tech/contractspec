/**
 * Version management CLI command.
 *
 * Analyze, bump, and manage spec versions.
 *
 * Usage:
 *   contractspec version analyze                # Analyze version bumps needed
 *   contractspec version analyze --baseline main
 *   contractspec version analyze --format json
 *   contractspec version bump <spec-path> --minor
 *   contractspec version bump --all --interactive
 *
 * @module commands/version
 */

import { Command } from 'commander';
import chalk from 'chalk';
import {
  createConsoleLoggerAdapter,
  createNodeFsAdapter,
  createNodeGitAdapter,
  versioning,
} from '@contractspec/bundle.workspace';
import type { VersionBumpType } from '@contractspec/lib.contracts';

export type VersionOutputFormat = 'text' | 'json' | 'table';

export interface VersionAnalyzeOptions {
  baseline?: string;
  format?: VersionOutputFormat;
  pattern?: string;
  quiet?: boolean;
}

export interface VersionBumpOptions {
  patch?: boolean;
  minor?: boolean;
  major?: boolean;
  message?: string;
  dryRun?: boolean;
  all?: boolean;
  interactive?: boolean;
  baseline?: string;
}

/**
 * Create the version command.
 */
export function createVersionCommand(): Command {
  const command = new Command('version').description(
    'Analyze and manage spec versions'
  );

  // version analyze
  command
    .command('analyze')
    .description('Analyze specs and suggest version bumps')
    .option('-b, --baseline <ref>', 'Git ref to compare against')
    .option(
      '-f, --format <format>',
      'Output format (text, json, table)',
      'text'
    )
    .option('-p, --pattern <glob>', 'Glob pattern for spec discovery')
    .option('-q, --quiet', 'Minimal output')
    .action(runVersionAnalyze);

  // version bump
  command
    .command('bump')
    .argument('[spec-path]', 'Path to spec file to bump')
    .description('Bump spec version')
    .option('--patch', 'Bump patch version (x.x.X)')
    .option('--minor', 'Bump minor version (x.X.0)')
    .option('--major', 'Bump major version (X.0.0)')
    .option('-m, --message <description>', 'Change description for changelog')
    .option('--dry-run', 'Preview changes without applying')
    .option('--all', 'Bump all specs needing updates')
    .option('-i, --interactive', 'Interactive mode')
    .option('-b, --baseline <ref>', 'Git ref to compare against (for --all)')
    .action(runVersionBump);

  // version commits - analyze commits for version bump
  command
    .command('commits')
    .description(
      'Analyze git commits to determine version bump (conventional commits)'
    )
    .option('-b, --baseline <ref>', 'Git ref to compare against', 'HEAD~10')
    .option('-f, --format <format>', 'Output format (text, json)', 'text')
    .action(runVersionCommits);

  return command;
}

/**
 * Run the version analyze command.
 */
async function runVersionAnalyze(
  options: VersionAnalyzeOptions
): Promise<void> {
  const fs = createNodeFsAdapter();
  const git = createNodeGitAdapter();
  const logger = createConsoleLoggerAdapter();

  try {
    if (!options.quiet) {
      console.log(chalk.blue('Analyzing versions...'));
    }

    const result = await versioning.analyzeVersions(
      { fs, git, logger },
      {
        baseline: options.baseline,
        pattern: options.pattern,
      }
    );

    // Format and output result
    const format = options.format ?? 'text';

    switch (format) {
      case 'json':
        console.log(JSON.stringify(result, null, 2));
        break;
      case 'table':
        printVersionTable(result.analyses);
        break;
      case 'text':
      default:
        printVersionText(result);
        break;
    }
  } catch (error) {
    logger.error('Version analysis failed', { error });
    console.error(
      chalk.red('❌ Error:'),
      error instanceof Error ? error.message : String(error)
    );
    process.exit(1);
  }
}

/**
 * Run the version bump command.
 */
async function runVersionBump(
  specPath: string | undefined,
  options: VersionBumpOptions
): Promise<void> {
  const fs = createNodeFsAdapter();
  const git = createNodeGitAdapter();
  const logger = createConsoleLoggerAdapter();

  try {
    // Determine bump type
    const bumpType: VersionBumpType = options.major
      ? 'major'
      : options.minor
        ? 'minor'
        : 'patch';

    if (options.all) {
      // Bump all specs needing updates
      console.log(chalk.blue('Analyzing specs needing version bumps...'));
      const analysis = await versioning.analyzeVersions(
        { fs, git, logger },
        { baseline: options.baseline }
      );

      const specsToUpdate = analysis.analyses.filter((a) => a.needsBump);

      if (specsToUpdate.length === 0) {
        console.log(chalk.green('✅ All specs are up to date'));
        return;
      }

      console.log(
        chalk.yellow(`Found ${specsToUpdate.length} specs needing updates`)
      );

      for (const spec of specsToUpdate) {
        await bumpSingleSpec(fs, logger, spec.specPath, spec.bumpType, options);
      }

      console.log(chalk.green(`\n✅ Updated ${specsToUpdate.length} specs`));
    } else if (specPath) {
      // Bump single spec
      await bumpSingleSpec(fs, logger, specPath, bumpType, options);
    } else {
      console.error(
        chalk.red('Error: Either specify a spec path or use --all')
      );
      process.exit(1);
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
 * Bump a single spec file.
 */
async function bumpSingleSpec(
  fs: ReturnType<typeof createNodeFsAdapter>,
  logger: ReturnType<typeof createConsoleLoggerAdapter>,
  specPath: string,
  bumpType: VersionBumpType,
  options: VersionBumpOptions
): Promise<void> {
  const result = await versioning.applyVersionBump(
    { fs, git: createNodeGitAdapter(), logger },
    {
      specPath,
      bumpType,
      changeDescription: options.message,
      dryRun: options.dryRun,
    }
  );

  if (result.success) {
    const action = options.dryRun ? 'Would bump' : 'Bumped';
    console.log(
      chalk.green(
        `✅ ${action} ${result.specKey}: ${result.previousVersion} → ${result.newVersion}`
      )
    );
  } else {
    console.error(chalk.red(`❌ Failed to bump ${specPath}: ${result.error}`));
  }
}

/**
 * Run the version commits command (conventional commit analysis).
 */
async function runVersionCommits(options: {
  baseline?: string;
  format?: string;
}): Promise<void> {
  const fs = createNodeFsAdapter();
  const git = createNodeGitAdapter();
  const logger = createConsoleLoggerAdapter();

  try {
    console.log(
      chalk.blue(`Analyzing commits since ${options.baseline ?? 'HEAD~10'}...`)
    );

    const result = await versioning.analyzeVersionsFromCommits(
      { fs, git, logger },
      { baseline: options.baseline }
    );

    if (options.format === 'json') {
      console.log(JSON.stringify(result, null, 2));
      return;
    }

    // Text output
    console.log('');
    if (result.totalCommits === 0) {
      console.log(chalk.yellow('No conventional commits found.'));
      console.log(
        chalk.gray('Use conventional commit format: type(scope): description')
      );
      return;
    }

    console.log(
      chalk.bold(`Analyzed ${result.totalCommits} conventional commits:`)
    );
    console.log('');

    for (const commit of result.commits.slice(0, 10)) {
      const icon = commit.breaking
        ? '🔴'
        : commit.type === 'feat'
          ? '🟢'
          : '🟡';
      const scope = commit.scope ? chalk.gray(`(${commit.scope})`) : '';
      console.log(
        `  ${icon} ${commit.type}${scope}: ${commit.message.substring(0, 60)}`
      );
    }

    if (result.commits.length > 10) {
      console.log(chalk.gray(`  ... and ${result.commits.length - 10} more`));
    }

    console.log('');

    if (result.suggestedBumpType) {
      const bumpColor =
        result.suggestedBumpType === 'major'
          ? chalk.red
          : result.suggestedBumpType === 'minor'
            ? chalk.yellow
            : chalk.green;
      console.log(
        `Suggested version bump: ${bumpColor(result.suggestedBumpType.toUpperCase())}`
      );

      if (result.breakingCommits > 0) {
        console.log(
          chalk.red(
            `  ⚠️  ${result.breakingCommits} breaking change(s) detected`
          )
        );
      }
    } else {
      console.log(chalk.green('No version bump needed based on commits.'));
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
 * Print version analysis as text.
 */
function printVersionText(
  result: Awaited<ReturnType<typeof versioning.analyzeVersions>>
): void {
  console.log('');

  if (result.specsNeedingBump === 0) {
    console.log(chalk.green('✅ All specs are up to date'));
    console.log(`   Analyzed ${result.totalSpecs} specs`);
    return;
  }

  if (result.totalBreaking > 0) {
    console.log(
      chalk.red(`⚠️  ${result.totalBreaking} specs have breaking changes`)
    );
  }
  if (result.totalNonBreaking > 0) {
    console.log(
      chalk.yellow(
        `ℹ️  ${result.totalNonBreaking} specs have non-breaking changes`
      )
    );
  }

  console.log('');
  console.log(chalk.bold('Specs needing version bump:'));

  for (const analysis of result.analyses.filter((a) => a.needsBump)) {
    const icon = analysis.hasBreaking ? '🔴' : '🟡';
    const bump = chalk.cyan(`[${analysis.bumpType}]`);
    console.log(
      `  ${icon} ${analysis.specKey}: ${analysis.currentVersion} → ${analysis.suggestedVersion} ${bump}`
    );

    for (const change of analysis.changes.slice(0, 3)) {
      console.log(chalk.gray(`      • ${change.description}`));
    }
    if (analysis.changes.length > 3) {
      console.log(
        chalk.gray(`      ... and ${analysis.changes.length - 3} more`)
      );
    }
  }

  console.log('');
  console.log(
    `Run ${chalk.cyan('contractspec version bump --all')} to apply all bumps`
  );
}

/**
 * Print version analysis as table.
 */
function printVersionTable(analyses: versioning.SpecVersionAnalysis[]): void {
  const needsBump = analyses.filter((a) => a.needsBump);

  if (needsBump.length === 0) {
    console.log(chalk.green('✅ All specs are up to date'));
    return;
  }

  console.log('');
  console.log(
    chalk.bold(
      'Spec Key'.padEnd(40) +
        'Current'.padEnd(12) +
        'Suggested'.padEnd(12) +
        'Bump'
    )
  );
  console.log('─'.repeat(76));

  for (const a of needsBump) {
    const bump = a.hasBreaking
      ? chalk.red(a.bumpType)
      : chalk.yellow(a.bumpType);
    console.log(
      a.specKey.padEnd(40) +
        a.currentVersion.padEnd(12) +
        a.suggestedVersion.padEnd(12) +
        bump
    );
  }
}
