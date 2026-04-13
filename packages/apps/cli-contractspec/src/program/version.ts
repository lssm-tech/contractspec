import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export function resolveCliVersion() {
	const envVersion = process.env.CONTRACTSPEC_CLI_VERSION;
	if (typeof envVersion === 'string' && envVersion.length > 0) {
		return envVersion;
	}

	const currentDir = dirname(fileURLToPath(import.meta.url));
	const candidates = [
		resolve(currentDir, '../package.json'),
		resolve(currentDir, '../../package.json'),
		resolve(currentDir, '../../../package.json'),
	];

	for (const candidate of candidates) {
		if (!existsSync(candidate)) {
			continue;
		}

		try {
			const packageJson = JSON.parse(readFileSync(candidate, 'utf8'));
			if (typeof packageJson.version === 'string') {
				return packageJson.version;
			}
		} catch {
			// Fall through to the next candidate.
		}
	}

	return '0.0.1';
}
