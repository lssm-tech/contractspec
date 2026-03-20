/**
 * Biome config setup target.
 */

import {
	generateArtifactsForAudience,
	generateBiomePreset,
} from '@contractspec/biome-config';
import type { FsAdapter } from '../../../ports/fs';
import type {
	SetupFileResult,
	SetupOptions,
	SetupPromptCallbacks,
} from '../types';

/**
 * Setup biome.jsonc and bundled local plugin assets.
 */
export async function setupBiomeConfig(
	fs: FsAdapter,
	options: SetupOptions,
	prompts: SetupPromptCallbacks
): Promise<SetupFileResult> {
	const targetRoot =
		options.isMonorepo && options.scope === 'package'
			? (options.packageRoot ?? options.workspaceRoot)
			: options.workspaceRoot;

	const biomeConfigPath = fs.join(targetRoot, 'biome.jsonc');
	const biomeRoot = fs.join(targetRoot, '.contractspec', 'biome');
	const pluginDir = fs.join(biomeRoot, 'plugins');
	const aiDir = fs.join(biomeRoot, 'ai');
	const artifacts = generateArtifactsForAudience('consumer');

	try {
		const exists = await fs.exists(biomeConfigPath);

		if (exists && options.interactive) {
			const proceed = await prompts.confirm(
				`${biomeConfigPath} exists. Overwrite it with ContractSpec's Biome preset?`
			);

			if (!proceed) {
				return {
					target: 'biome-config',
					filePath: biomeConfigPath,
					action: 'skipped',
					message: 'User skipped Biome configuration',
				};
			}
		}

		await fs.mkdir(pluginDir);
		await fs.mkdir(aiDir);

		await fs.writeFile(
			biomeConfigPath,
			generateBiomePreset('consumer').replaceAll(
				'../plugins/consumer-prefer-design-system.grit',
				'./.contractspec/biome/plugins/consumer-prefer-design-system.grit'
			)
		);

		for (const [name, content] of Object.entries(artifacts.plugins)) {
			await fs.writeFile(fs.join(pluginDir, name), content);
		}

		await fs.writeFile(fs.join(aiDir, 'consumer.md'), artifacts.aiRules);

		return {
			target: 'biome-config',
			filePath: biomeConfigPath,
			action: exists ? 'merged' : 'created',
			message: exists
				? 'Replaced existing Biome configuration and refreshed local plugins'
				: 'Created Biome configuration and local plugins',
		};
	} catch (error) {
		return {
			target: 'biome-config',
			filePath: biomeConfigPath,
			action: 'error',
			message: error instanceof Error ? error.message : 'Unknown error',
		};
	}
}
