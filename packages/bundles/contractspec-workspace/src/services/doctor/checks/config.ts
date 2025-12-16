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
