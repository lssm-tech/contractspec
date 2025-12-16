import { Command } from 'commander';
import chalk from 'chalk';
import { resolve } from 'node:path';
import { writeFile } from 'node:fs/promises';
import {
  SpecRegistry,
  openApiForRegistry,
  type OpenApiServer,
} from '@lssm/lib.contracts';
import { loadTypeScriptModule } from '../../utils/module-loader';
import { getErrorMessage } from '../../utils/errors';

interface OpenApiOptions {
  registry: string;
  out?: string;
  title?: string;
  version?: string;
  description?: string;
  server?: string;
  json?: boolean;
}

interface LoadedRegistryModule {
  default?: unknown;
  createRegistry?: () => Promise<SpecRegistry> | SpecRegistry;
  registry?: SpecRegistry;
}

async function loadRegistry(modulePath: string): Promise<SpecRegistry> {
  const exports = (await loadTypeScriptModule(
    modulePath
  )) as LoadedRegistryModule;

  if (exports instanceof SpecRegistry) {
    return exports;
  }
  if (exports.registry instanceof SpecRegistry) {
    return exports.registry;
  }

  const factory =
    typeof exports.createRegistry === 'function'
      ? exports.createRegistry
      : typeof exports.default === 'function'
        ? (exports.default as () => Promise<SpecRegistry> | SpecRegistry)
        : undefined;

  if (factory) {
    const result = await factory();
    if (result instanceof SpecRegistry) {
      return result;
    }
  }

  throw new Error(
    `Registry module ${modulePath} must export a SpecRegistry instance or a factory function returning one.`
  );
}

export const openapiCommand = new Command('openapi')
  .description('Export an OpenAPI 3.1 document from a SpecRegistry module')
  .requiredOption(
    '--registry <path>',
    'Path to a module exporting a SpecRegistry (or factory)'
  )
  .option('--out <path>', 'Write output to a file (default: ./openapi.json)')
  .option('--title <title>', 'OpenAPI title')
  .option('--version <version>', 'OpenAPI version')
  .option('--description <description>', 'OpenAPI description')
  .option('--server <url>', 'Add a single server URL')
  .option('--json', 'Print JSON to stdout (also writes file if --out is set)')
  .action(async (options: OpenApiOptions) => {
    try {
      const registry = await loadRegistry(
        resolve(process.cwd(), options.registry)
      );
      const servers: OpenApiServer[] | undefined = options.server
        ? [{ url: options.server }]
        : undefined;

      const doc = openApiForRegistry(registry, {
        title: options.title,
        version: options.version,
        description: options.description,
        servers,
      });

      const json = JSON.stringify(doc, null, 2) + '\n';

      const outPath = options.out
        ? resolve(process.cwd(), options.out)
        : resolve(process.cwd(), 'openapi.json');
      await writeFile(outPath, json, 'utf8');

      console.log(chalk.green(`✅ OpenAPI written to ${outPath}`));

      if (options.json) {
        console.log(json);
      }
    } catch (error) {
      console.error(
        chalk.red(`OpenAPI export failed: ${getErrorMessage(error)}`)
      );
      process.exit(1);
    }
  });




