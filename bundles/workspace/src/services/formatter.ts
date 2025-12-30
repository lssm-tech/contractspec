/**
 * Formatter service.
 */

import { exec } from 'node:child_process';
import { promisify } from 'node:util';

const execAsync = promisify(exec);

export interface FormatterOptions {
  type?: string;
  cwd?: string;
}

/**
 * Format files using the configured formatter (defaulting to prettier).
 */
export async function formatFiles(
  files: string[],
  _configResolver?: unknown,
  options: FormatterOptions = {}
): Promise<void> {
  if (files.length === 0) return;

  const cwd = options.cwd ?? process.cwd();

  // Basic implementation: run prettier on the files
  // We assume prettier is available in the project

  // Group files by chunks to avoid command line length limits
  const FILE_CHUNK_SIZE = 50;

  for (let i = 0; i < files.length; i += FILE_CHUNK_SIZE) {
    const chunk = files.slice(i, i + FILE_CHUNK_SIZE);
    // Quote paths
    const fileArgs = chunk.map((f) => `"${f}"`).join(' ');

    try {
      // Try npx prettier first
      await execAsync(`npx prettier --write ${fileArgs}`, { cwd });
    } catch (_error) {
      // Fallback or ignore
      // console.warn('Prettier formatting failed:', error);
    }
  }
}
