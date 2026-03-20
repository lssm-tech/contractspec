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

const FORMATTER_COMMANDS: Record<string, string> = {
	biome: 'bunx @biomejs/biome format --write',
	dprint: 'bunx dprint fmt',
};

/**
 * Format files using the configured formatter (defaulting to Biome).
 */
export async function formatFiles(
	files: string[],
	_configResolver?: unknown,
	options: FormatterOptions = {}
): Promise<void> {
	if (files.length === 0) return;

	const cwd = options.cwd ?? process.cwd();

	const formatterCommand =
		FORMATTER_COMMANDS[options.type ?? 'biome'] ?? FORMATTER_COMMANDS.biome;

	// Group files by chunks to avoid command line length limits
	const FILE_CHUNK_SIZE = 50;

	for (let i = 0; i < files.length; i += FILE_CHUNK_SIZE) {
		const chunk = files.slice(i, i + FILE_CHUNK_SIZE);
		const fileArgs = chunk.map((f) => `"${f}"`).join(' ');

		try {
			await execAsync(`${formatterCommand} ${fileArgs}`, { cwd });
		} catch (_error) {
			// Formatting is best-effort in this utility.
		}
	}
}
