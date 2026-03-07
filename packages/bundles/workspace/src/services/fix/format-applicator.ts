/**
 * Format applicator service.
 */

import { exec } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { promisify } from 'node:util';
import type { FormatterConfig } from '@contractspec/lib.contracts-spec/workspace-config/contractsrc-types';
import type { FixOptions, FixResult } from './types';
import type { LoggerAdapter } from '../../ports/logger';

const execAsync = promisify(exec);

const FORMATTER_COMMANDS: Record<string, string> = {
  prettier: 'bunx prettier --write --ignore-unknown',
  biome: 'bunx @biomejs/biome format --write',
  dprint: 'bunx dprint fmt',
  eslint: 'bunx eslint --fix',
};

async function loadFormatterConfig(
  workspaceRoot: string,
  logger: LoggerAdapter
): Promise<FormatterConfig | undefined> {
  const configPath = join(workspaceRoot, '.contractsrc.json');
  try {
    const raw = await readFile(configPath, 'utf-8');
    const config = JSON.parse(raw) as { formatter?: FormatterConfig };
    return config.formatter;
  } catch {
    logger.debug('No .contractsrc.json found or unreadable; using defaults');
    return undefined;
  }
}

function buildFormatCommand(
  file: string,
  formatterConfig?: FormatterConfig
): string {
  if (formatterConfig?.enabled === false) return '';
  if (formatterConfig?.type === 'custom' && formatterConfig.command) {
    const args = formatterConfig.args?.join(' ') ?? '';
    return `${formatterConfig.command} ${args} "${file}"`.trim();
  }
  const base =
    FORMATTER_COMMANDS[formatterConfig?.type ?? 'prettier'] ??
    FORMATTER_COMMANDS.prettier;
  const extra = formatterConfig?.args?.join(' ') ?? '';
  return `${base} ${extra} "${file}"`.trim();
}

/**
 * Apply formatting to the changed files in a fix result.
 */
export async function applyFormatting(
  result: FixResult,
  options: FixOptions,
  logger: LoggerAdapter
): Promise<void> {
  if (options.format === false) {
    return;
  }

  const filesToFormat = result.filesChanged
    .filter((f) => f.action === 'created' || f.action === 'modified')
    .map((f) => f.path);

  if (filesToFormat.length === 0) {
    return;
  }

  const cwd = options.workspaceRoot || process.cwd();
  const formatterConfig = await loadFormatterConfig(cwd, logger);

  if (formatterConfig?.enabled === false) {
    logger.debug('Formatting disabled via .contractsrc.json');
    return;
  }

  const timeout = formatterConfig?.timeout ?? 30_000;

  for (const file of filesToFormat) {
    const cmd = buildFormatCommand(file, formatterConfig);
    if (!cmd) continue;

    try {
      await execAsync(cmd, { cwd, timeout });
      logger.debug(`Formatted ${file}`);
    } catch (error) {
      logger.warn(
        `Failed to format ${file}: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }
}
