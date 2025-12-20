/**
 * Init command.
 *
 * Sets up ContractSpec in a project: CLI config, VS Code settings,
 * MCP servers, Cursor rules, and AGENTS.md.
 *
 * Supports monorepos with package-level or workspace-level configuration.
 */

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { checkbox, confirm, input, select } from '@inquirer/prompts';
import {
  runSetup,
  ALL_SETUP_TARGETS,
  SETUP_TARGET_LABELS,
  createNodeFsAdapter,
  findWorkspaceRoot,
  findPackageRoot,
  isMonorepo,
  getPackageName,
  type SetupTarget,
  type SetupScope,
  type SetupPromptCallbacks,
} from '@lssm/bundle.contractspec-workspace';
import {
  parseOpenApi,
  importFromOpenApi,
} from '@lssm/lib.contracts-transformers/openapi';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import {
  upsertOpenApiSource,
  getOutputDirForSpecType,
} from '../../utils/config-writer';
import { loadConfig, type OpenApiSource } from '../../utils/config';

/**
 * Create CLI prompt callbacks using @inquirer/prompts.
 *
 * For scope selection, uses single select since only one scope applies.
 */
function createCliPrompts(): SetupPromptCallbacks {
  return {
    confirm: async (message: string) => {
      return confirm({ message });
    },
    multiSelect: async <T extends string>(
      message: string,
      options: { value: T; label: string; selected?: boolean }[]
    ): Promise<T[]> => {
      // Special handling for scope selection (single choice)
      if (message.includes('Configure at which level')) {
        const result = await select({
          message,
          choices: options.map((o) => ({
            value: o.value,
            name: o.label,
          })),
          default: options.find((o) => o.selected)?.value,
        });
        return [result];
      }

      return checkbox({
        message,
        choices: options.map((o) => ({
          value: o.value,
          name: o.label,
          checked: o.selected !== false,
        })),
      });
    },
    input: async (message: string, defaultValue?: string) => {
      return input({ message, default: defaultValue });
    },
  };
}

/**
 * Parse comma-separated targets into array.
 */
function parseTargets(value: string): SetupTarget[] {
  const validTargets = new Set(ALL_SETUP_TARGETS);
  const targets: SetupTarget[] = [];

  for (const t of value.split(',')) {
    const trimmed = t.trim() as SetupTarget;
    if (validTargets.has(trimmed)) {
      targets.push(trimmed);
    } else {
      console.warn(
        chalk.yellow(`Warning: Unknown target '${trimmed}', skipping.`)
      );
    }
  }

  return targets;
}

export const initCommand = new Command('init')
  .description('Set up ContractSpec in your project')
  .option('-y, --yes', 'Skip prompts, use defaults', false)
  .option(
    '--targets <targets>',
    `Comma-separated list of targets: ${ALL_SETUP_TARGETS.join(', ')}`,
    ''
  )
  .option('--project-name <name>', 'Project name for generated files')
  .option('--owners <owners>', 'Default code owners (comma-separated)')
  .option('--scope <scope>', 'Configuration scope: workspace or package', '')
  .action(async (options) => {
    const cwd = process.cwd();
    const interactive = !options.yes;

    // Detect workspace structure
    const workspaceRoot = findWorkspaceRoot(cwd);
    const packageRoot = findPackageRoot(cwd);
    const monorepo = isMonorepo(workspaceRoot);
    const packageName = monorepo ? getPackageName(packageRoot) : undefined;

    console.log(chalk.bold('\n🔧 ContractSpec Setup\n'));

    // Display monorepo context
    if (monorepo) {
      console.log(chalk.cyan('📦 Monorepo detected'));
      console.log(chalk.gray(`   Workspace root: ${workspaceRoot}`));
      if (packageRoot !== workspaceRoot) {
        console.log(chalk.gray(`   Package root:   ${packageRoot}`));
        if (packageName) {
          console.log(chalk.gray(`   Package name:   ${packageName}`));
        }
      }
      console.log();
    }

    if (!interactive) {
      console.log(chalk.gray('Running in non-interactive mode (--yes)\n'));
    }

    // Parse targets
    let targets: SetupTarget[] = [];
    if (options.targets) {
      targets = parseTargets(options.targets);
    }

    // Parse owners
    let defaultOwners: string[] | undefined;
    if (options.owners) {
      defaultOwners = options.owners.split(',').map((o: string) => o.trim());
    }

    // Parse scope
    let scope: SetupScope | undefined;
    if (options.scope === 'workspace' || options.scope === 'package') {
      scope = options.scope;
    }

    // Show available targets
    if (interactive && targets.length === 0) {
      console.log(chalk.gray('Available configuration targets:\n'));
      for (const target of ALL_SETUP_TARGETS) {
        console.log(`  ${chalk.cyan('•')} ${SETUP_TARGET_LABELS[target]}`);
      }
      console.log();
    }

    const spinner = ora('Setting up ContractSpec...').start();

    try {
      const fs = createNodeFsAdapter(cwd);
      const prompts = createCliPrompts();

      // Pause spinner during prompts
      if (interactive) {
        spinner.stop();
      }

      const result = await runSetup(
        fs,
        {
          workspaceRoot,
          packageRoot: monorepo ? packageRoot : undefined,
          isMonorepo: monorepo,
          scope,
          packageName,
          interactive,
          targets,
          projectName: options.projectName,
          defaultOwners,
        },
        interactive ? prompts : undefined
      );

      if (!interactive) {
        spinner.succeed('Setup complete!');
      }

      // Show results
      console.log(chalk.bold('\n📋 Results:\n'));

      for (const file of result.files) {
        const icon =
          file.action === 'created'
            ? chalk.green('✓')
            : file.action === 'merged'
              ? chalk.blue('↔')
              : file.action === 'skipped'
                ? chalk.yellow('○')
                : chalk.red('✗');

        const actionLabel =
          file.action === 'created'
            ? 'created'
            : file.action === 'merged'
              ? 'merged'
              : file.action === 'skipped'
                ? 'skipped'
                : 'error';

        console.log(`  ${icon} ${chalk.gray(file.filePath)}`);
        console.log(`    ${chalk.dim(actionLabel)}: ${file.message}`);
      }

      // Summary
      const created = result.files.filter((f) => f.action === 'created').length;
      const merged = result.files.filter((f) => f.action === 'merged').length;
      const skipped = result.files.filter((f) => f.action === 'skipped').length;
      const errors = result.files.filter((f) => f.action === 'error').length;

      console.log(chalk.bold('\n📊 Summary:\n'));
      if (created > 0) console.log(`  ${chalk.green(`${created} created`)}`);
      if (merged > 0) console.log(`  ${chalk.blue(`${merged} merged`)}`);
      if (skipped > 0) console.log(`  ${chalk.yellow(`${skipped} skipped`)}`);
      if (errors > 0) console.log(`  ${chalk.red(`${errors} errors`)}`);

      // Next steps
      console.log(chalk.bold('\n🚀 Next steps:\n'));
      console.log(`  1. Review generated files`);
      console.log(
        `  2. Run ${chalk.cyan('contractspec create')} to create your first spec`
      );
      console.log(
        `  3. Run ${chalk.cyan('contractspec validate')} to check specs`
      );
      console.log();

      // Offer OpenAPI import if interactive
      if (interactive) {
        const wantsOpenApi = await confirm({
          message: 'Do you have an OpenAPI spec you want to import?',
        });

        if (wantsOpenApi) {
          const openApiSource = await input({
            message: 'Enter OpenAPI spec URL or file path:',
          });

          if (openApiSource.trim()) {
            console.log(chalk.blue(`\n📥 Importing from OpenAPI: ${openApiSource}`));

            try {
              const userConfig = await loadConfig();
              const parseResult = await parseOpenApi(openApiSource, {
                fetch: globalThis.fetch,
                readFile: async (path) => {
                  const content = await readFile(path, 'utf-8');
                  return content;
                },
              });

              console.log(
                chalk.gray(
                  `Parsed ${parseResult.operations.length} operations from ${parseResult.info.title} v${parseResult.info.version}`
                )
              );

              const importResult = importFromOpenApi(parseResult, {});

              // Use conventions for output directories
              const operationsDir = getOutputDirForSpecType('operation', userConfig);
              const eventsDir = getOutputDirForSpecType('event', userConfig);
              const modelsDir = getOutputDirForSpecType('model', userConfig);

              let importedCount = 0;
              for (const spec of importResult.specs) {
                let targetDir: string;
                if (spec.code.includes('defineEvent(')) {
                  targetDir = eventsDir;
                } else if (spec.code.includes('defineSchemaModel(') && !spec.code.includes('defineCommand(') && !spec.code.includes('defineQuery(')) {
                  targetDir = modelsDir;
                } else {
                  targetDir = operationsDir;
                }

                const filePath = resolve(targetDir, spec.fileName);
                const dir = dirname(filePath);
                if (!existsSync(dir)) {
                  await mkdir(dir, { recursive: true });
                }
                await writeFile(filePath, spec.code, 'utf-8');
                console.log(chalk.green(`✅ Created: ${filePath}`));
                importedCount++;
              }

              // Save OpenAPI source to config
              const sourceName = parseResult.info.title ?? 'openapi';
              const openApiSourceConfig: OpenApiSource = {
                name: sourceName,
                syncMode: 'sync',
              };

              if (openApiSource.startsWith('http://') || openApiSource.startsWith('https://')) {
                openApiSourceConfig.url = openApiSource;
              } else {
                openApiSourceConfig.file = openApiSource;
              }

              await upsertOpenApiSource(openApiSourceConfig);
              console.log(chalk.green(`\n✅ Saved OpenAPI source '${sourceName}' to .contractsrc.json`));
              console.log(chalk.blue(`\n📊 Imported ${importedCount} specs from OpenAPI`));
            } catch (importError) {
              console.error(
                chalk.red('OpenAPI import failed:'),
                importError instanceof Error ? importError.message : String(importError)
              );
            }
          }
        }
      }

      if (!result.success) {
        process.exit(1);
      }
    } catch (error) {
      spinner.fail('Setup failed');
      console.error(
        chalk.red('\n❌ Error:'),
        error instanceof Error ? error.message : String(error)
      );
      process.exit(1);
    }
  });
