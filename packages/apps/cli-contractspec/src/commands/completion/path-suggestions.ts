import { readdir } from 'node:fs/promises';
import { homedir } from 'node:os';
import { basename, dirname, isAbsolute, join, resolve } from 'node:path';

export async function listPathSuggestions(
	partial: string,
	cwd: string,
	directoriesOnly: boolean
): Promise<string[]> {
	const expanded = expandHome(partial);
	const basePath =
		expanded.length === 0
			? '.'
			: expanded.endsWith('/')
				? expanded
				: dirname(expanded);
	const prefix =
		expanded.length === 0 || expanded.endsWith('/') ? '' : basename(expanded);
	const searchDir = isAbsolute(basePath)
		? basePath
		: resolve(cwd, basePath === '.' ? '' : basePath);
	const displayDir =
		partial.length === 0
			? ''
			: partial.endsWith('/')
				? partial
				: dirname(partial) === '.'
					? ''
					: `${dirname(partial)}/`;

	try {
		const entries = await readdir(searchDir, { withFileTypes: true });
		return entries
			.filter((entry) => entry.name.startsWith(prefix))
			.filter((entry) => !directoriesOnly || entry.isDirectory())
			.map((entry) => {
				const suffix = entry.isDirectory() ? '/' : '';
				return `${displayDir}${entry.name}${suffix}`;
			})
			.sort((left, right) => left.localeCompare(right));
	} catch {
		return [];
	}
}

function expandHome(value: string): string {
	if (!value.startsWith('~')) {
		return value;
	}

	return join(homedir(), value.slice(1));
}
