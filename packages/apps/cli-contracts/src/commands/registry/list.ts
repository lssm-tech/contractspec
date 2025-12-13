import { Command } from 'commander';
import chalk from 'chalk';
import type { ContractRegistryManifest } from '@lssm/lib.contracts';
import { getErrorMessage } from '../../utils/errors';
import { RegistryClient, resolveRegistryUrl } from './client';

export const registryListCommand = new Command('list')
  .description('List items available in the ContractSpec registry')
  .option('--registry-url <url>', 'Registry server base URL')
  .option('--type <type>', 'Filter by type (operation, event, template, ...)')
  .option('--json', 'Output JSON')
  .action(async (options) => {
    try {
      const client = new RegistryClient({
        registryUrl: resolveRegistryUrl(options.registryUrl as string | undefined),
      });
      const manifest = await client.getJson<ContractRegistryManifest>(
        '/r/contractspec.json'
      );

      const typeFilter = (options.type as string | undefined)?.trim();
      const items = manifest.items.filter((i) => {
        if (!typeFilter) return true;
        return i.type === (`contractspec:${typeFilter}` as typeof i.type);
      });

      if (options.json) {
        // eslint-disable-next-line no-console
        console.log(JSON.stringify({ ...manifest, items }, null, 2));
        return;
      }

      // eslint-disable-next-line no-console
      console.log(chalk.bold(`\n📦 Registry Items (${items.length})\n`));
      items
        .slice()
        .sort((a, b) => a.name.localeCompare(b.name))
        .forEach((item) => {
          // eslint-disable-next-line no-console
          console.log(
            `${chalk.cyan(item.type)} ${chalk.bold(item.name)} ${chalk.gray(
              `v${item.version}`
            )}`
          );
          // eslint-disable-next-line no-console
          console.log(`  ${chalk.gray(item.description)}`);
        });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(chalk.red(`Registry list failed: ${getErrorMessage(error)}`));
      process.exit(1);
    }
  });


