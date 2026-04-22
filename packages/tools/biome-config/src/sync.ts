import { execFile } from 'node:child_process';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import { generateArtifactsForAudience } from './generate';

const packageRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const repoRoot = join(packageRoot, '..', '..', '..');
const execFileAsync = promisify(execFile);

async function writeGeneratedFile(
	path: string,
	content: string
): Promise<void> {
	await mkdir(dirname(path), { recursive: true });
	try {
		const current = await readFile(path, 'utf8');
		if (current === content) {
			return;
		}
	} catch {
		// Missing or unreadable files are written below.
	}
	await writeFile(path, content, 'utf8');
}

async function syncAudienceArtifacts(
	audience: 'repo' | 'consumer'
): Promise<void> {
	const artifacts = generateArtifactsForAudience(audience);

	await writeGeneratedFile(
		join(packageRoot, 'presets', `${audience}.jsonc`),
		artifacts.preset
	);

	for (const [name, content] of Object.entries(artifacts.plugins)) {
		await writeGeneratedFile(join(packageRoot, 'plugins', name), content);
	}

	await writeGeneratedFile(
		join(packageRoot, 'ai', `${audience}.md`),
		artifacts.aiRules
	);
}

await syncAudienceArtifacts('repo');
await syncAudienceArtifacts('consumer');

await execFileAsync('node', [
	join(repoRoot, 'scripts', 'biome.cjs'),
	'format',
	'--write',
	join(packageRoot, 'presets'),
	join(packageRoot, 'plugins'),
]);
