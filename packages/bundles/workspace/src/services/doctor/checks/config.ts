/**
 * Configuration file health checks.
 */

import type { FsAdapter } from '../../../ports/fs';
import type { CheckResult, CheckContext, FixResult } from '../types';
import { generateContractsrcConfig } from '../../setup/config-generators';
import { formatJson } from '../../setup/file-merger';

/**
 * Run configuration-related health checks.
 */
export async function runConfigChecks(
  fs: FsAdapter,
  ctx: CheckContext
): Promise<CheckResult[]> {
  const results: CheckResult[] = [];

  // Check if .contractsrc.json exists
  results.push(await checkContractsrcExists(fs, ctx));

  // Check if .contractsrc.json is valid
  results.push(await checkContractsrcValid(fs, ctx));

  // Check required fields in config
  results.push(await checkContractsrcFields(fs, ctx));

  // Check versioning configuration
  results.push(await checkVersioningConfig(fs, ctx));

  // Check hooks configuration
  results.push(await checkHooksConfig(fs, ctx));

  return results;
}

/**
 * Check if .contractsrc.json exists.
 */
async function checkContractsrcExists(
  fs: FsAdapter,
  ctx: CheckContext
): Promise<CheckResult> {
  const configPath = fs.join(ctx.workspaceRoot, '.contractsrc.json');

  const exists = await fs.exists(configPath);
  if (exists) {
    return {
      category: 'config',
      name: 'Config File Exists',
      status: 'pass',
      message: '.contractsrc.json found',
    };
  }

  return {
    category: 'config',
    name: 'Config File Exists',
    status: 'fail',
    message: '.contractsrc.json not found',
    fix: {
      description: 'Create .contractsrc.json with defaults',
      apply: async (): Promise<FixResult> => {
        try {
          const defaults = generateContractsrcConfig({
            workspaceRoot: ctx.workspaceRoot,
            interactive: false,
            targets: [],
          });
          await fs.writeFile(configPath, formatJson(defaults));
          return { success: true, message: 'Created .contractsrc.json' };
        } catch (error) {
          const msg = error instanceof Error ? error.message : String(error);
          return { success: false, message: `Failed to create: ${msg}` };
        }
      },
    },
  };
}

/**
 * Check if .contractsrc.json is valid JSON.
 */
async function checkContractsrcValid(
  fs: FsAdapter,
  ctx: CheckContext
): Promise<CheckResult> {
  const configPath = fs.join(ctx.workspaceRoot, '.contractsrc.json');

  const exists = await fs.exists(configPath);
  if (!exists) {
    return {
      category: 'config',
      name: 'Config Valid JSON',
      status: 'skip',
      message: 'Config file does not exist',
    };
  }

  try {
    const content = await fs.readFile(configPath);
    JSON.parse(content);

    return {
      category: 'config',
      name: 'Config Valid JSON',
      status: 'pass',
      message: '.contractsrc.json is valid JSON',
    };
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);

    return {
      category: 'config',
      name: 'Config Valid JSON',
      status: 'fail',
      message: '.contractsrc.json is not valid JSON',
      details: msg,
      fix: {
        description: 'Replace with valid default config',
        apply: async (): Promise<FixResult> => {
          try {
            const defaults = generateContractsrcConfig({
              workspaceRoot: ctx.workspaceRoot,
              interactive: false,
              targets: [],
            });
            await fs.writeFile(configPath, formatJson(defaults));
            return { success: true, message: 'Replaced with valid config' };
          } catch (err) {
            const m = err instanceof Error ? err.message : String(err);
            return { success: false, message: `Failed: ${m}` };
          }
        },
      },
    };
  }
}

/**
 * Check required fields in .contractsrc.json.
 */
async function checkContractsrcFields(
  fs: FsAdapter,
  ctx: CheckContext
): Promise<CheckResult> {
  const configPath = fs.join(ctx.workspaceRoot, '.contractsrc.json');

  const exists = await fs.exists(configPath);
  if (!exists) {
    return {
      category: 'config',
      name: 'Config Fields',
      status: 'skip',
      message: 'Config file does not exist',
    };
  }

  try {
    const content = await fs.readFile(configPath);
    const config = JSON.parse(content) as Record<string, unknown>;

    const missingFields: string[] = [];

    // Check for recommended fields
    if (!config['outputDir']) {
      missingFields.push('outputDir');
    }
    if (!config['conventions']) {
      missingFields.push('conventions');
    }

    if (missingFields.length === 0) {
      return {
        category: 'config',
        name: 'Config Fields',
        status: 'pass',
        message: 'All recommended fields present',
      };
    }

    return {
      category: 'config',
      name: 'Config Fields',
      status: 'warn',
      message: `Missing recommended fields: ${missingFields.join(', ')}`,
      fix: {
        description: 'Add missing fields with defaults',
        apply: async (): Promise<FixResult> => {
          try {
            const defaults = generateContractsrcConfig({
              workspaceRoot: ctx.workspaceRoot,
              interactive: false,
              targets: [],
            }) as Record<string, unknown>;

            // Merge missing fields
            for (const field of missingFields) {
              if (defaults[field] !== undefined) {
                config[field] = defaults[field];
              }
            }

            await fs.writeFile(configPath, formatJson(config));
            return { success: true, message: 'Added missing fields' };
          } catch (err) {
            const m = err instanceof Error ? err.message : String(err);
            return { success: false, message: `Failed: ${m}` };
          }
        },
      },
    };
  } catch {
    return {
      category: 'config',
      name: 'Config Fields',
      status: 'skip',
      message: 'Could not parse config',
    };
  }
}

/**
 * Check if versioning configuration is present.
 */
async function checkVersioningConfig(
  fs: FsAdapter,
  ctx: CheckContext
): Promise<CheckResult> {
  const configPath = fs.join(ctx.workspaceRoot, '.contractsrc.json');

  const exists = await fs.exists(configPath);
  if (!exists) {
    return {
      category: 'config',
      name: 'Versioning Config',
      status: 'skip',
      message: 'Config file does not exist',
    };
  }

  try {
    const content = await fs.readFile(configPath);
    const config = JSON.parse(content) as Record<string, unknown>;

    if (config['versioning']) {
      const versioning = config['versioning'] as Record<string, unknown>;
      const hasChangesets = versioning['integrateWithChangesets'] === true;

      return {
        category: 'config',
        name: 'Versioning Config',
        status: 'pass',
        message: hasChangesets
          ? 'Versioning configured with Changesets integration'
          : 'Versioning configured',
      };
    }

    return {
      category: 'config',
      name: 'Versioning Config',
      status: 'warn',
      message: 'Versioning configuration not found',
      details:
        'Consider adding versioning config for automated version bumps and changelog generation',
      fix: {
        description: 'Add versioning configuration with defaults',
        apply: async (): Promise<FixResult> => {
          try {
            config['versioning'] = {
              autoBump: false,
              bumpStrategy: 'impact',
              changelogTiers: ['spec', 'library', 'monorepo'],
              format: 'keep-a-changelog',
              commitChanges: false,
              createTags: false,
              integrateWithChangesets: true,
            };
            await fs.writeFile(configPath, formatJson(config));
            return { success: true, message: 'Added versioning configuration' };
          } catch (err) {
            const m = err instanceof Error ? err.message : String(err);
            return { success: false, message: `Failed: ${m}` };
          }
        },
      },
    };
  } catch {
    return {
      category: 'config',
      name: 'Versioning Config',
      status: 'skip',
      message: 'Could not parse config',
    };
  }
}

/**
 * Check if hooks configuration is present.
 */
async function checkHooksConfig(
  fs: FsAdapter,
  ctx: CheckContext
): Promise<CheckResult> {
  const configPath = fs.join(ctx.workspaceRoot, '.contractsrc.json');

  const exists = await fs.exists(configPath);
  if (!exists) {
    return {
      category: 'config',
      name: 'Hooks Config',
      status: 'skip',
      message: 'Config file does not exist',
    };
  }

  try {
    const content = await fs.readFile(configPath);
    const config = JSON.parse(content) as Record<string, unknown>;

    if (config['hooks']) {
      const hooks = config['hooks'] as Record<string, unknown>;
      const hookCount = Object.keys(hooks).length;

      return {
        category: 'config',
        name: 'Hooks Config',
        status: 'pass',
        message: `${hookCount} git hook(s) configured`,
      };
    }

    // Check if husky is installed
    const huskyPath = fs.join(ctx.workspaceRoot, '.husky');
    const hasHusky = await fs.exists(huskyPath);

    if (hasHusky) {
      return {
        category: 'config',
        name: 'Hooks Config',
        status: 'warn',
        message: 'Husky detected but no hooks configured in .contractsrc.json',
        details: 'Add hooks config to run contractspec checks from git hooks',
        fix: {
          description: 'Add pre-commit hooks configuration',
          apply: async (): Promise<FixResult> => {
            try {
              config['hooks'] = {
                'pre-commit': [
                  'contractspec validate **/*.operation.ts',
                  'contractspec integrity check',
                ],
              };
              await fs.writeFile(configPath, formatJson(config));
              return { success: true, message: 'Added hooks configuration' };
            } catch (err) {
              const m = err instanceof Error ? err.message : String(err);
              return { success: false, message: `Failed: ${m}` };
            }
          },
        },
      };
    }

    return {
      category: 'config',
      name: 'Hooks Config',
      status: 'pass',
      message: 'No hooks configured (optional)',
    };
  } catch {
    return {
      category: 'config',
      name: 'Hooks Config',
      status: 'skip',
      message: 'Could not parse config',
    };
  }
}
