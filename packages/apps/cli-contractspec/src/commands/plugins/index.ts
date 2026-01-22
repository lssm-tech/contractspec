import { Command } from 'commander';
import chalk from 'chalk';
import {
  PluginRegistries,
  type RegistryResolverCapability,
} from '@contractspec/lib.plugins';

export const pluginsCommand = new Command('plugins')
  .description('Manage ContractSpec plugins')
  .option('--list', 'List registered plugins')
  .option('--help-details', 'Show plugin usage examples')
  .action(async (options) => {
    if (options.helpDetails) {
      console.log(chalk.cyan('Plugin usage examples:'));
      console.log('  contractspec plugins --list');
      console.log('  contractspec plugins list');
      console.log('  contractspec plugins info <id>');
      return;
    }

    if (options.list) {
      listPlugins();
      return;
    }

    pluginsCommand.help();
  });

pluginsCommand
  .command('list')
  .description('List registered plugin capabilities')
  .action(() => {
    listPlugins();
  });

pluginsCommand
  .command('info <id>')
  .description('Show plugin capability details')
  .action((id) => {
    const registries = new PluginRegistries();
    const allCapabilities = [
      ...registries.generators
        .list()
        .map((cap) => ({ type: 'generator', cap })),
      ...registries.validators
        .list()
        .map((cap) => ({ type: 'validator', cap })),
      ...registries.adapters.list().map((cap) => ({ type: 'adapter', cap })),
      ...registries.formatters
        .list()
        .map((cap) => ({ type: 'formatter', cap })),
      ...registries.registryResolvers
        .list()
        .map((cap: RegistryResolverCapability) => ({
          type: 'registryResolver',
          cap,
        })),
    ];

    const match = allCapabilities.find((entry) => entry.cap.id === id);
    if (!match) {
      console.log(chalk.yellow(`No plugin capability found for: ${id}`));
      return;
    }

    console.log(chalk.cyan(`Capability: ${match.cap.id}`));
    console.log(`Type: ${match.type}`);
    if (match.cap.description) {
      console.log(`Description: ${match.cap.description}`);
    }
  });

function listPlugins(): void {
  const registries = new PluginRegistries();
  const sections: {
    title: string;
    list: { id: string; description?: string }[];
  }[] = [
    {
      title: 'Generators',
      list: registries.generators.list(),
    },
    {
      title: 'Validators',
      list: registries.validators.list(),
    },
    {
      title: 'Adapters',
      list: registries.adapters.list(),
    },
    {
      title: 'Formatters',
      list: registries.formatters.list(),
    },
    {
      title: 'Registry Resolvers',
      list: registries.registryResolvers.list(),
    },
  ];

  console.log(chalk.cyan('Registered plugin capabilities:'));
  sections.forEach((section) => {
    console.log(chalk.yellow(section.title));
    if (section.list.length === 0) {
      console.log('  (none)');
      return;
    }

    section.list.forEach((item) => {
      const description = item.description ? ` - ${item.description}` : '';
      console.log(`  ${item.id}${description}`);
    });
  });
}
