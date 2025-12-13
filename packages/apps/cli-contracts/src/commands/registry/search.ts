import { Command } from 'commander';
import chalk from 'chalk';
import type { ContractRegistryManifest } from '@lssm/lib.contracts';
import { getErrorMessage } from '../../utils/errors';
import { RegistryClient, resolveRegistryUrl } from './client';

export const registrySearchCommand = new Command('search')
  .description('Search the ContractSpec registry by keyword')
  .argument('<query>', 'Search string (matches name/title/description)')
  .option('--registry-url <url>', 'Registry server base URL')
  .option('--type <type>', 'Filter by type (operation, event, template, ...)')
  .option('--json', 'Output JSON')
  .action(async (query: string, options) => {
    try {
      const client = new RegistryClient({
        registryUrl: resolveRegistryUrl(options.registryUrl as string | undefined),
      });
      const manifest = await client.getJson<ContractRegistryManifest>(
        '/r/contractspec.json'
      );

      const q = query.toLowerCase();
      const typeFilter = (options.type as string | undefined)?.trim();

      const matches = manifest.items.filter((i) => {
        if (typeFilter && i.type !== (`contractspec:${typeFilter}` as typeof i.type))
          return false;
        const hay = `${i.name} ${i.title} ${i.description}`.toLowerCase();
        return hay.includes(q);
      });

      if (options.json) {
        // eslint-disable-next-line no-console
        console.log(JSON.stringify(matches, null, 2));
        return;
      }

      // eslint-disable-next-line no-console
      console.log(chalk.bold(`\n🔎 Matches (${matches.length})\n`));
      matches
        .slice()
        .sort((a, b) => a.name.localeCompare(b.name))
        .forEach((item) => {
          // eslint-disable-next-line no-console
          console.log(`${chalk.cyan(item.type)} ${chalk.bold(item.name)}`);
          // eslint-disable-next-line no-console
          console.log(`  ${chalk.gray(item.description)}`);
        });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(chalk.red(`Registry search failed: ${getErrorMessage(error)}`));
      process.exit(1);
    }
  });


