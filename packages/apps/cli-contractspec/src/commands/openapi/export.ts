import { Command } from 'commander';
import chalk from 'chalk';
import { resolve } from 'node:path';
import { writeFile } from 'node:fs/promises';
import {
  openApiForRegistry,
  type OpenApiServer,
} from '@contractspec/lib.contracts-spec/openapi';
import { OperationSpecRegistry } from '@contractspec/lib.contracts-spec/operations';
import { loadTypeScriptModule } from '../../utils/module-loader';
import { getErrorMessage } from '../../utils/errors';
import { loadConfig } from '../../utils/config';

interface ExportOptions {
  registry?: string;
  out?: string;
  format?: string;
  title?: string;
  version?: string;
  description?: string;
  server?: string;
  json?: boolean;
}

interface LoadedRegistryModule {
  default?: unknown;
  createRegistry?: () => Promise<OperationSpecRegistry> | OperationSpecRegistry;
  registry?: OperationSpecRegistry;
}

async function loadRegistry(
  modulePath: string
): Promise<OperationSpecRegistry> {
  const exports = (await loadTypeScriptModule(
    modulePath
  )) as LoadedRegistryModule;

  if (exports instanceof OperationSpecRegistry) {
    return exports;
  }
  if (exports.registry instanceof OperationSpecRegistry) {
    return exports.registry;
  }

  const factory =
    typeof exports.createRegistry === 'function'
      ? exports.createRegistry
      : typeof exports.default === 'function'
        ? (exports.default as () =>
            | Promise<OperationSpecRegistry>
            | OperationSpecRegistry)
        : undefined;

  if (factory) {
    const result = await factory();
    if (result instanceof OperationSpecRegistry) {
      return result;
    }
  }

  throw new Error(
    `Registry module ${modulePath} must export a OperationSpecRegistry instance or a factory function returning one.`
  );
}

/**
 * Export ContractSpec specs to OpenAPI document.
 */
export const exportCommand = new Command('export')
  .description('Export specs to an OpenAPI 3.1 document')
  .option(
    '--registry <path>',
    'Path to a module exporting a OperationSpecRegistry (or factory)'
  )
  .option('--out <path>', 'Write output to a file')
  .option('--format <format>', 'Output format: json or yaml', 'json')
  .option('--title <title>', 'OpenAPI title')
  .option('--version <version>', 'OpenAPI version')
  .option('--description <description>', 'OpenAPI description')
  .option('--server <url>', 'Add a single server URL')
  .option('--json', 'Print JSON to stdout (also writes file if --out is set)')
  .action(async (options: ExportOptions) => {
    try {
      const config = await loadConfig();
      const exportConfig = config.openapi?.export;

      // Registry path is required
      const registryPath = options.registry;
      if (!registryPath) {
        console.error(
          chalk.red('Error: --registry option is required for export')
        );
        process.exit(1);
      }

      const registry = await loadRegistry(resolve(process.cwd(), registryPath));

      // Merge config with CLI options
      const serverUrl = options.server ?? exportConfig?.servers?.[0]?.url;
      const servers: OpenApiServer[] | undefined = serverUrl
        ? [{ url: serverUrl }]
        : undefined;

      const doc = openApiForRegistry(registry, {
        title: options.title ?? exportConfig?.title ?? 'ContractSpec API',
        version: options.version ?? exportConfig?.version ?? '1.0.0',
        description: options.description ?? exportConfig?.description,
        servers,
      });

      const format = options.format ?? exportConfig?.format ?? 'json';
      const content =
        format === 'yaml'
          ? jsonToYaml(doc)
          : JSON.stringify(doc, null, 2) + '\n';

      const outPath =
        options.out ?? exportConfig?.outputPath ?? './openapi.json';
      const resolvedPath = resolve(process.cwd(), outPath);

      await writeFile(resolvedPath, content, 'utf8');
      console.log(chalk.green(`✅ OpenAPI written to ${resolvedPath}`));

      if (options.json) {
        console.log(content);
      }
    } catch (error) {
      console.error(
        chalk.red(`OpenAPI export failed: ${getErrorMessage(error)}`)
      );
      process.exit(1);
    }
  });

/**
 * Simple JSON to YAML conversion.
 */
function jsonToYaml(obj: unknown, indent = 0): string {
  const spaces = '  '.repeat(indent);
  let yaml = '';

  if (Array.isArray(obj)) {
    for (const item of obj) {
      if (typeof item === 'object' && item !== null) {
        yaml += `${spaces}-\n${jsonToYaml(item, indent + 1)}`;
      } else {
        yaml += `${spaces}- ${JSON.stringify(item)}\n`;
      }
    }
  } else if (typeof obj === 'object' && obj !== null) {
    for (const [key, value] of Object.entries(obj)) {
      if (Array.isArray(value)) {
        yaml += `${spaces}${key}:\n${jsonToYaml(value, indent + 1)}`;
      } else if (typeof value === 'object' && value !== null) {
        yaml += `${spaces}${key}:\n${jsonToYaml(value, indent + 1)}`;
      } else {
        yaml += `${spaces}${key}: ${JSON.stringify(value)}\n`;
      }
    }
  }

  return yaml;
}
