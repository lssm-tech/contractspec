#!/usr/bin/env bun
// One bin, picks the right runtime via conditional exports.
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const currentDir = dirname(fileURLToPath(import.meta.url));
const packageJsonCandidates = [
	resolve(currentDir, '../package.json'),
	resolve(currentDir, '../contractspec/package.json'),
];

for (const packageJsonPath of packageJsonCandidates) {
	try {
		const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
		if (
			typeof packageJson.version === 'string' &&
			packageJson.version.length > 0
		) {
			process.env.CONTRACTSPEC_CLI_VERSION ??= packageJson.version;
			break;
		}
	} catch {
		// Try the next candidate path.
	}
}

await import('@contractspec/app.cli-contractspec/run');
