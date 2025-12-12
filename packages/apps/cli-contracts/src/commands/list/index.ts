import { Command } from 'commander';
import chalk from 'chalk';
import { readFileSync, existsSync } from 'fs';
import { glob } from 'glob';
import path from 'path';

export const listCommand = new Command('list')
  .description('List all contract specs in the project')
  .option('--type <type>', 'Filter by spec type (operation, event, presentation, etc.)')
  .option('--owner <owner>', 'Filter by owner')
  .option('--tag <tag>', 'Filter by tag')
  .option('--stability <level>', 'Filter by stability (experimental, beta, stable, deprecated)')
  .option('--json', 'Output as JSON for scripting')
  .action(async (options) => {
    try {
      const contractFiles = await glob('**/*.contracts.ts', {
        ignore: ['node_modules/**', 'dist/**', '.turbo/**']
      });

      const specs = [];

      for (const file of contractFiles) {
        try {
          // Dynamic import of spec file
          const specPath = path.resolve(file);
          delete require.cache[specPath]; // Clear cache for re-import
          const specModule = await import(specPath);

          // Extract spec data (assuming standard export structure)
          const spec = specModule.default || specModule.spec || specModule;
          if (spec && spec.meta) {
            specs.push({
              file,
              ...spec.meta,
              type: spec.kind || 'unknown'
            });
          }
        } catch (error: any) {
          console.warn(chalk.yellow(`Warning: Could not load ${file}: ${error.message}`));
        }
      }

      // Apply filters
      let filteredSpecs = specs;
      if (options.type) {
        filteredSpecs = filteredSpecs.filter(s => s.type === options.type);
      }
      if (options.owner) {
        filteredSpecs = filteredSpecs.filter(s =>
          s.owners?.some((owner: string) => owner.includes(options.owner))
        );
      }
      if (options.tag) {
        filteredSpecs = filteredSpecs.filter(s =>
          s.tags?.some((tag: string) => tag.includes(options.tag))
        );
      }
      if (options.stability) {
        filteredSpecs = filteredSpecs.filter(s => s.stability === options.stability);
      }

      if (options.json) {
        console.log(JSON.stringify(filteredSpecs, null, 2));
      } else {
        if (filteredSpecs.length === 0) {
          console.log(chalk.yellow('No contract specs found matching criteria.'));
          return;
        }

        console.log(chalk.bold(`\n📋 Contract Specs (${filteredSpecs.length})\n`));

        filteredSpecs.forEach(spec => {
          const stabilityColors: Record<string, any> = {
            experimental: chalk.red,
            beta: chalk.yellow,
            stable: chalk.green,
            deprecated: chalk.gray
          };
          const stabilityColor = stabilityColors[spec.stability || ''] || chalk.white;

          console.log(`${stabilityColor(spec.stability?.toUpperCase() || 'UNKNOWN')} ${chalk.cyan(spec.type)} ${chalk.bold(spec.name)}`);
          console.log(`  📁 ${chalk.gray(spec.file)}`);

          if (spec.description) {
            console.log(`  📝 ${chalk.gray(spec.description)}`);
          }

          if (spec.owners?.length) {
            console.log(`  👥 ${chalk.gray(spec.owners.join(', '))}`);
          }

          console.log('');
        });
      }

    } catch (error: any) {
      console.error(chalk.red(`Error listing specs: ${error.message}`));
      process.exit(1);
    }
  });
