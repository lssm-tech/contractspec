import { Command } from 'commander';
import chalk from 'chalk';
import { createNodeAdapters, analyzeGap } from '@contractspec/bundle.workspace';

export const gapCommand = new Command('gap')
  .description(
    'Analyze gaps between contract and implementation/generated outputs'
  )
  .action(async () => {
    try {
      const adapters = createNodeAdapters({ silent: true });
      console.log(chalk.bold.blue('\n🧩 ContractSpec Gap Analysis\n'));

      const result = await analyzeGap(adapters, process.cwd());

      if (!result.hasContracts) {
        console.log(
          chalk.yellow(
            '⚠️  contracts/ directory not found. No gap analysis possible against contracts.'
          )
        );
        return;
      }

      console.log(
        chalk.cyan(`Analyzed ${result.totalSpecs} canonical contracts.`)
      );

      if (!result.hasGenerated) {
        console.log(
          chalk.red(
            '\n❌ Gap Detected: Generated artifacts are missing completely.'
          )
        );
        console.log(chalk.gray('  Run `contractspec generate` to resolve.'));
        process.exit(1);
      }

      if (result.missingDocs.length > 0) {
        console.log(
          chalk.red(
            `\n❌ Gap Detected: ${result.missingDocs.length} specs are missing generated documentation.`
          )
        );
        result.missingDocs
          .slice(0, 5)
          .forEach((m) => console.log(chalk.red(`   - ${m}`)));
        if (result.missingDocs.length > 5)
          console.log(
            chalk.red(`   ...and ${result.missingDocs.length - 5} more.`)
          );

        console.log(
          chalk.gray('\n  Run `contractspec generate` to close this gap.')
        );
        process.exit(1);
      } else {
        console.log(chalk.green('\n✅ No documentation gaps detected.'));
        console.log(
          chalk.gray(
            `   Verified ${result.totalSpecs} specs have corresponding docs.`
          )
        );
      }

      if (result.missingIndex) {
        console.log(
          chalk.yellow(
            `\n⚠️  Gap: Missing 'contracts/index.ts'. This may prevent easy importing.`
          )
        );
      }
      if (result.missingRegistry) {
        console.log(
          chalk.yellow(
            `\n⚠️  Gap: Missing 'contracts/registry.ts'. Runtime registries may be incomplete.`
          )
        );
      }

      if (result.missingIndex || result.missingRegistry) {
        console.log(
          chalk.gray(
            '  Run `contractspec extract` or use import tools to regenerate registries.'
          )
        );
        // Don't fail the command for this warning yet, unless strict mode
      } else if (result.totalSpecs > 0) {
        console.log(chalk.green('\n✅ Registry files present.'));
      }
    } catch (error) {
      console.error(
        chalk.red('\n❌ Error:'),
        error instanceof Error ? error.message : String(error)
      );
      process.exit(1);
    }
  });
