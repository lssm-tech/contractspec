import { Command } from 'commander';
import chalk from 'chalk';
import type { ContractRegistryItem } from '@lssm/lib.contracts';
import { loadConfig } from '../../utils/config';
import { getErrorMessage } from '../../utils/errors';
import { ensureDir, generateFileName, writeFileSafe } from '../../utils/fs';
import { RegistryClient, resolveRegistryUrl } from './client';
import { join, resolve } from 'path';

function stripJsonSuffix(nameOrNameJson: string): string {
  return nameOrNameJson.endsWith('.json')
    ? nameOrNameJson.slice(0, -'.json'.length)
    : nameOrNameJson;
}

function opDirFromConventions(
  conventions: Record<string, string>,
  kind: 'command' | 'query'
): string {
  const raw = conventions.operations || 'interactions/commands|queries';
  const [commandsDir, queriesDir] = raw.split('|');
  const picked = kind === 'query' ? queriesDir : commandsDir;
  return picked || commandsDir || 'interactions/commands';
}

function defaultOutDirForType(
  specType: string,
  config: {
    outputDir: string;
    conventions: {
      operations: string;
      events: string;
      presentations: string;
      forms: string;
    };
  },
  kind: 'command' | 'query'
): string {
  const base = config.outputDir || './src';
  switch (specType) {
    case 'operation':
      return join(base, opDirFromConventions(config.conventions, kind));
    case 'event':
      return join(base, config.conventions.events || 'events');
    case 'presentation':
      return join(base, config.conventions.presentations || 'presentations');
    case 'form':
      return join(base, config.conventions.forms || 'forms');
    case 'workflow':
      return join(base, 'workflows');
    case 'data-view':
      return join(base, 'data-views');
    case 'integration':
      return join(base, 'integrations');
    case 'knowledge':
      return join(base, 'knowledge');
    case 'app-config':
      return join(base, 'app-config');
    default:
      return join(base, specType);
  }
}

function defaultFileExtForType(specType: string): string {
  switch (specType) {
    case 'operation':
      return '.contracts.ts';
    case 'event':
      return '.event.ts';
    case 'presentation':
      return '.presentation.ts';
    case 'workflow':
      return '.workflow.ts';
    case 'data-view':
      return '.data-view.ts';
    case 'telemetry':
      return '.telemetry.ts';
    case 'experiment':
      return '.experiment.ts';
    case 'migration':
      return '.migration.ts';
    case 'app-config':
      return '.app-config.ts';
    case 'integration':
      return '.integration.ts';
    case 'knowledge':
      return '.knowledge.ts';
    case 'template':
      return '.template.json';
    default:
      return '.ts';
  }
}

export const registryAddCommand = new Command('add')
  .description('Add a registry item to the current project')
  .argument('<type>', 'Item type (operation, event, template, ...)')
  .argument('<name>', 'Item name (e.g., user.signup)')
  .option('--registry-url <url>', 'Registry server base URL')
  .option('--out-dir <dir>', 'Override output directory')
  .option(
    '--kind <kind>',
    'For operations only: command | query (default: command)'
  )
  .action(async (type: string, name: string, options) => {
    try {
      const config = await loadConfig();
      const registryUrl = resolveRegistryUrl(options.registryUrl as string | undefined);
      const client = new RegistryClient({ registryUrl });

      const item = await client.getJson<ContractRegistryItem>(
        `/r/contractspec/${type}/${stripJsonSuffix(name)}.json`
      );

      const kind =
        (options.kind as 'command' | 'query' | undefined) ?? 'command';

      const outDir =
        (options.outDir as string | undefined) ??
        defaultOutDirForType(type, config, kind);

      const absoluteOutDir = resolve(process.cwd(), outDir);
      await ensureDir(absoluteOutDir);

      // If registry provides explicit targets, honor them. Otherwise:
      // - if single file: write a deterministic spec filename
      // - if multi file: write into .contractspec/registry/<type>/<name> to avoid collisions
      const filesWithContent = item.files.filter(
        (f): f is { path: string; type: string; content: string } =>
          typeof f.content === 'string'
      );

      if (filesWithContent.length === 0) {
        throw new Error(
          `Registry item ${type}/${name} has no inline file contents to install`
        );
      }

      if (filesWithContent.length === 1) {
        const ext = defaultFileExtForType(type);
        const fileName = generateFileName(item.name, ext);
        const target = join(absoluteOutDir, fileName);
        await writeFileSafe(target, filesWithContent[0].content);
        // eslint-disable-next-line no-console
        console.log(chalk.green(`✅ Installed ${type}/${item.name} → ${target}`));
        return;
      }

      const multiRoot = resolve(
        process.cwd(),
        '.contractspec/registry',
        type,
        item.name.replace(/\./g, '-')
      );
      await ensureDir(multiRoot);

      for (const f of filesWithContent) {
        const base = f.path.split('/').pop() || 'file.ts';
        const target = join(multiRoot, base);
        await writeFileSafe(target, f.content);
      }

      // eslint-disable-next-line no-console
      console.log(
        chalk.green(
          `✅ Installed ${type}/${item.name} (${filesWithContent.length} files) → ${multiRoot}`
        )
      );
      // eslint-disable-next-line no-console
      console.log(
        chalk.gray(
          'Note: multi-file items are staged under .contractspec/registry/; you can move them into your app structure.'
        )
      );
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(chalk.red(`Registry add failed: ${getErrorMessage(error)}`));
      process.exit(1);
    }
  });


