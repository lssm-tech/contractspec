import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { generateArtifactsForAudience } from './generate';

const packageRoot = join(dirname(fileURLToPath(import.meta.url)), '..');

async function writeGeneratedFile(
	path: string,
	content: string
): Promise<void> {
	await mkdir(dirname(path), { recursive: true });
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
