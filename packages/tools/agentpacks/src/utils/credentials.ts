import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { homedir } from 'os';
import { dirname, join } from 'path';

const CONFIG_DIR = join(homedir(), '.config', 'agentpacks');
const CREDENTIALS_FILE = join(CONFIG_DIR, 'credentials.json');

/**
 * Stored credentials.
 */
export interface Credentials {
	registryUrl: string;
	token?: string;
}

/**
 * Load credentials from ~/.config/agentpacks/credentials.json.
 */
export function loadCredentials(): Credentials {
	if (!existsSync(CREDENTIALS_FILE)) {
		return { registryUrl: 'https://registry.agentpacks.dev' };
	}

	try {
		const raw = readFileSync(CREDENTIALS_FILE, 'utf-8');
		return JSON.parse(raw) as Credentials;
	} catch {
		return { registryUrl: 'https://registry.agentpacks.dev' };
	}
}

/**
 * Save credentials to ~/.config/agentpacks/credentials.json.
 */
export function saveCredentials(credentials: Credentials): void {
	mkdirSync(dirname(CREDENTIALS_FILE), { recursive: true });
	writeFileSync(CREDENTIALS_FILE, JSON.stringify(credentials, null, 2) + '\n', {
		mode: 0o600,
	});
}

/**
 * Clear saved credentials.
 */
export function clearCredentials(): void {
	if (existsSync(CREDENTIALS_FILE)) {
		writeFileSync(
			CREDENTIALS_FILE,
			JSON.stringify({ registryUrl: 'https://registry.agentpacks.dev' }) + '\n'
		);
	}
}
