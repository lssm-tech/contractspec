/**
 * Formatter utility for ContractSpec CLI.
 *
 * Detects and runs code formatters on generated files.
 */

import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { readFile } from 'node:fs/promises';
import type {
  FormatterConfig,
  FormatterType,
} from '@contractspec/lib.contracts-spec';

const execAsync = promisify(exec);

export interface FormatterOptions {
  /** Override formatter type from config */
  type?: FormatterType;
  /** Skip formatting entirely */
  skip?: boolean;
  /** Working directory for formatter */
  cwd?: string;
  /** Silent mode - don't log output */
  silent?: boolean;
}

export interface FormatResult {
  success: boolean;
  formatted: boolean;
  error?: string;
  duration?: number;
  formatterUsed?: FormatterType;
}

/**
 * Config files that indicate a formatter is available.
 */
const FORMATTER_CONFIG_FILES: Record<FormatterType, string[]> = {
  prettier: [
    '.prettierrc',
    '.prettierrc.json',
    '.prettierrc.yaml',
    '.prettierrc.yml',
    '.prettierrc.js',
    '.prettierrc.cjs',
    '.prettierrc.mjs',
    'prettier.config.js',
    'prettier.config.cjs',
    'prettier.config.mjs',
  ],
  eslint: [
    '.eslintrc',
    '.eslintrc.json',
    '.eslintrc.yaml',
    '.eslintrc.yml',
    '.eslintrc.js',
    '.eslintrc.cjs',
    'eslint.config.js',
    'eslint.config.mjs',
    'eslint.config.cjs',
  ],
  biome: ['biome.json', 'biome.jsonc'],
  dprint: ['dprint.json', '.dprint.json'],
  custom: [],
};

/**
 * Package.json dependencies that indicate a formatter is available.
 */
const FORMATTER_PACKAGES: Record<FormatterType, string[]> = {
  prettier: ['prettier'],
  eslint: ['eslint'],
  biome: ['@biomejs/biome'],
  dprint: ['dprint'],
  custom: [],
};

/**
 * Auto-detect available formatters in the workspace.
 * Returns the first detected formatter in priority order.
 */
export async function detectFormatter(
  cwd: string = process.cwd()
): Promise<FormatterType | null> {
  // Priority order for formatters
  const priority: FormatterType[] = ['prettier', 'biome', 'eslint', 'dprint'];

  for (const formatter of priority) {
    if (await isFormatterAvailable(formatter, cwd)) {
      return formatter;
    }
  }

  return null;
}

/**
 * Check if a specific formatter is available in the workspace.
 */
async function isFormatterAvailable(
  formatter: FormatterType,
  cwd: string
): Promise<boolean> {
  // Check for config files
  const configFiles = FORMATTER_CONFIG_FILES[formatter] || [];
  for (const configFile of configFiles) {
    if (existsSync(resolve(cwd, configFile))) {
      return true;
    }
  }

  // Check package.json dependencies
  const packageJsonPath = resolve(cwd, 'package.json');
  if (existsSync(packageJsonPath)) {
    try {
      const packageJson = JSON.parse(
        await readFile(packageJsonPath, 'utf-8')
      ) as {
        dependencies?: Record<string, string>;
        devDependencies?: Record<string, string>;
      };
      const allDeps = {
        ...packageJson.dependencies,
        ...packageJson.devDependencies,
      };
      const packages = FORMATTER_PACKAGES[formatter] || [];
      for (const pkg of packages) {
        if (pkg in allDeps) {
          return true;
        }
      }
    } catch {
      // Ignore parse errors
    }
  }

  // Walk up to find monorepo root
  const parentDir = dirname(cwd);
  if (parentDir !== cwd && parentDir !== '/') {
    return isFormatterAvailable(formatter, parentDir);
  }

  return false;
}

/**
 * Get the command for a specific formatter type.
 */
function getFormatterCommand(
  type: FormatterType,
  files: string[],
  config?: FormatterConfig
): string {
  const fileArgs = files.map((f) => `"${f}"`).join(' ');
  const extraArgs = config?.args?.join(' ') || '';

  switch (type) {
    case 'prettier':
      return `bunx prettier --write ${extraArgs} ${fileArgs}`;
    case 'eslint':
      return `bunx eslint --fix ${extraArgs} ${fileArgs}`;
    case 'biome':
      return `bunx @biomejs/biome format --write ${extraArgs} ${fileArgs}`;
    case 'dprint':
      return `bunx dprint fmt ${extraArgs} ${fileArgs}`;
    case 'custom':
      if (!config?.command) {
        throw new Error(
          'Custom formatter requires a command to be specified in config'
        );
      }
      return `${config.command} ${extraArgs} ${fileArgs}`;
    default:
      throw new Error(`Unknown formatter type: ${type}`);
  }
}

export interface FormatLogger {
  log: (message: string) => void;
  warn: (message: string) => void;
  success: (message: string) => void;
}

/**
 * Format a single file or array of files.
 */
export async function formatFiles(
  files: string | string[],
  config?: FormatterConfig,
  options?: FormatterOptions,
  logger?: FormatLogger
): Promise<FormatResult> {
  const startTime = Date.now();
  const fileList = Array.isArray(files) ? files : [files];
  const cwd = options?.cwd || process.cwd();

  // Skip if explicitly disabled
  if (options?.skip || config?.enabled === false) {
    return {
      success: true,
      formatted: false,
      duration: Date.now() - startTime,
    };
  }

  // Determine formatter to use
  let formatterType = options?.type || config?.type;

  // Auto-detect if not specified
  if (!formatterType) {
    const detected = await detectFormatter(cwd);
    if (!detected) {
      // No formatter available - silently skip
      return {
        success: true,
        formatted: false,
        duration: Date.now() - startTime,
      };
    }
    formatterType = detected;
  }

  // Build command
  const command = getFormatterCommand(formatterType, fileList, config);
  const timeout = config?.timeout || 30000;

  if (!options?.silent && logger) {
    logger.log(
      `🎨 Formatting ${fileList.length} file(s) with ${formatterType}...`
    );
  }

  try {
    await execAsync(command, {
      cwd,
      timeout,
    });

    if (!options?.silent && logger) {
      logger.success(`✅ Formatted ${fileList.length} file(s)`);
    }

    return {
      success: true,
      formatted: true,
      duration: Date.now() - startTime,
      formatterUsed: formatterType,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);

    // Log warning but don't fail the operation
    if (!options?.silent && logger) {
      logger.warn(`⚠️ Formatting failed (continuing anyway): ${errorMessage}`);
    }

    return {
      success: false,
      formatted: false,
      error: errorMessage,
      duration: Date.now() - startTime,
      formatterUsed: formatterType,
    };
  }
}

/**
 * Format files in batch, grouping by directory for efficiency.
 */
export async function formatFilesBatch(
  files: string[],
  config?: FormatterConfig,
  options?: FormatterOptions,
  logger?: FormatLogger
): Promise<FormatResult> {
  // For now, just format all files together
  // Future optimization: group by directory and run formatter per directory
  return formatFiles(files, config, options, logger);
}
