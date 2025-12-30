import { Command } from 'commander';
import chalk from 'chalk';
import type { ContractRegistryManifest } from '@contractspec/lib.contracts';
import { getErrorMessage } from '../../utils/errors';
import { RegistryClient, resolveRegistryUrl } from './client';

interface RegistrySearchOptions {
  registryUrl?: string;
  type?: string;
  json?: boolean;
}

export const registrySearchCommand = new Command('search')
  .description('Search the ContractSpec registry by keyword')
  .argument('<query>', 'Search string (matches name/title/description)')
  .option('--registry-url <url>', 'Registry server base URL')
  .option('--type <type>', 'Filter by type (operation, event, template, ...)')
  .option('--json', 'Output JSON')
  .action(async (query: string, options: RegistrySearchOptions) => {
    try {
      const client = new RegistryClient({
        registryUrl: resolveRegistryUrl(options.registryUrl),
      });
      const manifest = await client.getJson<ContractRegistryManifest>(
        '/r/contractspec.json'
      );

      const q = query.toLowerCase();
      const typeFilter = options.type?.trim();

      const matches = manifest.items.filter((i) => {
        if (
          typeFilter &&
          i.type !== (`contractspec:${typeFilter}` as typeof i.type)
        )
          return false;
        const hay = `${i.key} ${i.title} ${i.description}`.toLowerCase();
        return hay.includes(q);
      });

      if (options.json) {
        console.log(JSON.stringify(matches, null, 2));
        return;
      }

      console.log(chalk.bold(`\n🔎 Matches (${matches.length})\n`));
      matches
        .slice()
        .sort((a: { key: string }, b: { key: string }) =>
          a.key.localeCompare(b.key)
        )
        .forEach((item: { type: string; key: string; description: string }) => {
          console.log(`${chalk.cyan(item.type)} ${chalk.bold(item.key)}`);

          console.log(`  ${chalk.gray(item.description)}`);
        });
    } catch (error) {
      console.error(
        chalk.red(`Registry search failed: ${getErrorMessage(error)}`)
      );
      process.exit(1);
    }
  });
