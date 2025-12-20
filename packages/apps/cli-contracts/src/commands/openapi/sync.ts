import { Command } from 'commander';
import chalk from 'chalk';
import { dirname, resolve } from 'node:path';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import {
  importFromOpenApi,
  parseOpenApi,
} from '@lssm/lib.contracts-transformers/openapi';
import { getErrorMessage } from '../../utils/errors';
import { loadConfig, type OpenApiSourceConfig } from '../../utils/config';

interface SyncOptions {
  source?: string;
  interactive?: boolean;
  force?: string;
  dryRun?: boolean;
}

/**
 * Sync specs with OpenAPI sources.
 */
export const syncCommand = new Command('sync')
  .description('Sync ContractSpec specs with OpenAPI sources from config')
  .option('--source <name>', 'Sync only this source (from config)')
  .option('--interactive', 'Prompt for conflict resolution')
  .option('--force <direction>', 'Force resolution: openapi or contractspec')
  .option('--dry-run', 'Show what would change without writing files')
  .action(async (options: SyncOptions) => {
    try {
      const config = await loadConfig();
      const sources = config.openapi?.sources ?? [];

      if (sources.length === 0) {
        console.log(
          chalk.yellow(
            'No OpenAPI sources configured. Add sources to .contractsrc.json'
          )
        );
        console.log(chalk.gray('\nExample .contractsrc.json:'));
        console.log(
          chalk.gray(
            JSON.stringify(
              {
                openapi: {
                  sources: [
                    {
                      name: 'my-api',
                      url: 'https://api.example.com/openapi.json',
                      syncMode: 'sync',
                    },
                  ],
                },
              },
              null,
              2
            )
          )
        );
        return;
      }

      // Filter sources if specific source requested
      let sourcesToSync: OpenApiSourceConfig[] = sources;
      if (options.source) {
        sourcesToSync = sources.filter((s) => s.name === options.source);
        if (sourcesToSync.length === 0) {
          console.error(chalk.red(`Source not found: ${options.source}`));
          console.log(
            chalk.gray(
              `Available sources: ${sources.map((s) => s.name).join(', ')}`
            )
          );
          process.exit(1);
        }
      }

      const outputDir = config.outputDir ?? './src/specs';

      let totalAdded = 0;
      let totalUpdated = 0;
      let totalUnchanged = 0;
      let totalConflicts = 0;

      for (const source of sourcesToSync) {
        console.log(chalk.blue(`\n🔄 Syncing with source: ${source.name}`));

        const sourceLocation = source.url ?? source.file;
        if (!sourceLocation) {
          console.log(
            chalk.yellow(
              `  ⚠️ Source ${source.name} has no url or file configured`
            )
          );
          continue;
        }

        // Parse the OpenAPI document
        const parseResult = await parseOpenApi(sourceLocation, {
          fetch: globalThis.fetch,
          readFile: async (path) => {
            const content = await readFile(path, 'utf-8');
            return content;
          },
        });

        console.log(
          chalk.gray(`  Parsed ${parseResult.operations.length} operations`)
        );

        // Import operations
        const importResult = importFromOpenApi(parseResult, config, {
          prefix: source.prefix,
          tags: source.tags,
          exclude: source.exclude,
          defaultStability: source.defaultStability,
          defaultAuth: source.defaultAuth,
        });

        // Process each imported spec
        for (const imported of importResult.specs) {
          const filePath = resolve(outputDir, imported.fileName);
          const exists = existsSync(filePath);

          if (!exists) {
            // New spec - add it
            if (!options.dryRun) {
              const dir = dirname(filePath);
              if (!existsSync(dir)) {
                await mkdir(dir, { recursive: true });
              }
              await writeFile(filePath, imported.code, 'utf-8');
            }
            console.log(chalk.green(`  + Added: ${imported.source.sourceId}`));
            totalAdded++;
          } else {
            // Existing spec - check for differences
            const existingCode = await readFile(filePath, 'utf-8');

            if (existingCode === imported.code) {
              console.log(
                chalk.gray(`  = Unchanged: ${imported.source.sourceId}`)
              );
              totalUnchanged++;
            } else {
              // Differences detected
              if (options.force === 'openapi') {
                if (!options.dryRun) {
                  await writeFile(filePath, imported.code, 'utf-8');
                }
                console.log(
                  chalk.yellow(`  ~ Updated: ${imported.source.sourceId}`)
                );
                totalUpdated++;
              } else if (options.force === 'contractspec') {
                console.log(
                  chalk.gray(`  = Kept: ${imported.source.sourceId}`)
                );
                totalUnchanged++;
              } else if (options.interactive) {
                console.log(
                  chalk.yellow(`  ? Conflict: ${imported.source.sourceId}`)
                );
                console.log(
                  chalk.gray(
                    '    Use --force openapi or --force contractspec to resolve'
                  )
                );
                totalConflicts++;
              } else {
                console.log(
                  chalk.yellow(`  ! Conflict: ${imported.source.sourceId}`)
                );
                totalConflicts++;
              }
            }
          }
        }
      }

      // Summary
      console.log(chalk.blue('\n📊 Sync summary:'));
      console.log(chalk.green(`  Added: ${totalAdded}`));
      console.log(chalk.yellow(`  Updated: ${totalUpdated}`));
      console.log(chalk.gray(`  Unchanged: ${totalUnchanged}`));
      if (totalConflicts > 0) {
        console.log(chalk.red(`  Conflicts: ${totalConflicts}`));
      }

      if (options.dryRun) {
        console.log(chalk.yellow('\n⚠️ Dry run - no files were written'));
      }

      if (totalConflicts > 0 && !options.force) {
        console.log(
          chalk.yellow(
            '\n💡 Tip: Use --force openapi or --force contractspec to resolve conflicts'
          )
        );
      }
    } catch (error) {
      console.error(
        chalk.red(`OpenAPI sync failed: ${getErrorMessage(error)}`)
      );
      process.exit(1);
    }
  });
