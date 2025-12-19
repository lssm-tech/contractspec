import { Command } from 'commander';
import chalk from 'chalk';
import { resolve } from 'node:path';
import { readFile, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { glob } from 'glob';
import {
  parseOpenApi,
  type ParsedOperation,
} from '@lssm/lib.contracts-transformers/openapi';
import { getErrorMessage } from '../../utils/errors';

interface ValidateOptions {
  against: string;
  ignoreDescriptions?: boolean;
  ignoreTags?: boolean;
  ignoreTransport?: boolean;
}

/**
 * Validate specs against an OpenAPI source.
 */
export const validateCommand = new Command('validate')
  .description('Validate ContractSpec specs against an OpenAPI source')
  .argument('<spec-path>', 'Spec file or directory to validate')
  .requiredOption(
    '--against <source>',
    'OpenAPI source URL or file to validate against'
  )
  .option('--ignore-descriptions', 'Ignore description differences')
  .option('--ignore-tags', 'Ignore tag differences')
  .option('--ignore-transport', 'Ignore transport differences (path, method)')
  .action(async (specPath: string, options: ValidateOptions) => {
    try {
      console.log(
        chalk.blue(`🔍 Validating specs against: ${options.against}`)
      );

      // Parse the OpenAPI document
      const parseResult = await parseOpenApi(options.against, {
        fetch: globalThis.fetch,
        readFile: async (path) => {
          const content = await readFile(path, 'utf-8');
          return content;
        },
      });

      console.log(
        chalk.gray(
          `Parsed ${parseResult.operations.length} operations from ${parseResult.info.title}`
        )
      );

      // Build a map of operations by operationId
      const operationsMap = new Map<string, ParsedOperation>();
      for (const op of parseResult.operations) {
        operationsMap.set(op.operationId, op);
      }

      // Find spec files
      const resolvedPath = resolve(process.cwd(), specPath);
      const specFiles: string[] = [];

      if (!existsSync(resolvedPath)) {
        console.error(chalk.red(`Path not found: ${resolvedPath}`));
        process.exit(1);
      }

      const pathStat = await stat(resolvedPath);
      if (pathStat.isDirectory()) {
        const files = await glob('**/*.ts', {
          cwd: resolvedPath,
          ignore: ['node_modules/**', 'dist/**', '*.test.ts', '*.spec.ts'],
          absolute: true,
        });
        specFiles.push(...files);
      } else {
        specFiles.push(resolvedPath);
      }

      console.log(
        chalk.gray(`Found ${specFiles.length} spec files to validate\n`)
      );

      let specsValidated = 0;
      let specsWithDiffs = 0;
      const results: {
        file: string;
        operationId?: string;
        valid: boolean;
        diffs: string[];
      }[] = [];

      for (const file of specFiles) {
        try {
          const content = await readFile(file, 'utf-8');

          // Try to extract spec name from the file
          const operationIdMatch =
            content.match(/operationId:\s*['"]([^'"]+)['"]/) ||
            content.match(/name:\s*['"]([^'"]+)['"]/) ||
            content.match(/export\s+const\s+(\w+)Spec\s*=/);

          if (!operationIdMatch?.[1]) {
            continue;
          }

          const specName = operationIdMatch[1];
          specsValidated++;

          // Try to find matching OpenAPI operation
          let matchingOp: ParsedOperation | undefined;
          matchingOp = operationsMap.get(specName);

          if (!matchingOp) {
            const snakeName = specName.replace(/([A-Z])/g, '_$1').toLowerCase();
            matchingOp = operationsMap.get(snakeName);
          }

          if (!matchingOp) {
            for (const [opId, op] of operationsMap) {
              if (
                opId.toLowerCase().includes(specName.toLowerCase()) ||
                specName.toLowerCase().includes(opId.toLowerCase())
              ) {
                matchingOp = op;
                break;
              }
            }
          }

          const diffs: string[] = [];

          if (!matchingOp) {
            diffs.push(
              `No matching operation found in OpenAPI for: ${specName}`
            );
          } else {
            // Check deprecation
            if (matchingOp.deprecated && !content.includes('deprecated')) {
              diffs.push('OpenAPI operation is deprecated but spec is not');
            }

            // Check path match
            if (!options.ignoreTransport) {
              const pathMatch = content.match(/path:\s*['"]([^'"]+)['"]/);
              if (pathMatch?.[1] && pathMatch[1] !== matchingOp.path) {
                diffs.push(
                  `Path mismatch: spec has "${pathMatch[1]}", OpenAPI has "${matchingOp.path}"`
                );
              }
            }

            // Check method match
            if (!options.ignoreTransport) {
              const methodMatch = content.match(/method:\s*['"]([^'"]+)['"]/);
              if (
                methodMatch?.[1] &&
                methodMatch[1].toLowerCase() !== matchingOp.method.toLowerCase()
              ) {
                diffs.push(
                  `Method mismatch: spec has "${methodMatch[1]}", OpenAPI has "${matchingOp.method.toUpperCase()}"`
                );
              }
            }
          }

          const valid = diffs.length === 0;
          if (!valid) {
            specsWithDiffs++;
          }

          results.push({
            file: file.replace(process.cwd() + '/', ''),
            operationId: matchingOp?.operationId,
            valid,
            diffs,
          });

          // Print result
          if (valid) {
            console.log(chalk.green(`✅ ${specName}`));
          } else {
            console.log(chalk.red(`❌ ${specName}`));
            for (const diff of diffs) {
              console.log(chalk.gray(`   - ${diff}`));
            }
          }
        } catch (error) {
          console.log(
            chalk.red(`❌ Error processing ${file}: ${getErrorMessage(error)}`)
          );
          specsWithDiffs++;
        }
      }

      // Summary
      console.log(chalk.blue('\n📊 Validation summary:'));
      console.log(chalk.gray(`  Specs validated: ${specsValidated}`));
      if (specsWithDiffs === 0) {
        console.log(chalk.green(`  All specs valid! ✅`));
      } else {
        console.log(chalk.red(`  Specs with differences: ${specsWithDiffs}`));
        process.exit(1);
      }
    } catch (error) {
      console.error(
        chalk.red(`OpenAPI validation failed: ${getErrorMessage(error)}`)
      );
      process.exit(1);
    }
  });
