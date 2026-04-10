/**
 * AGENTS.md setup target.
 */

import type { FsAdapter } from '../../../ports/fs';
import { generateAgentsGuide } from '../config-generators';
import type {
	SetupFileResult,
	SetupOptions,
	SetupPromptCallbacks,
} from '../types';

/**
 * Setup AGENTS.md
 */
export async function setupAgentsMd(
	fs: FsAdapter,
	options: SetupOptions,
	prompts: SetupPromptCallbacks
): Promise<SetupFileResult> {
	const targetRoot =
		options.isMonorepo && options.scope === 'package'
			? (options.packageRoot ?? options.workspaceRoot)
			: options.workspaceRoot;
	const filePath = fs.join(targetRoot, 'AGENTS.md');

	try {
		const exists = await fs.exists(filePath);
		const content = generateAgentsGuide(options);

		if (exists) {
			if (options.interactive) {
				const proceed = await prompts.confirm(
					`${filePath} exists. Overwrite with the latest ContractSpec guide?`
				);
				if (!proceed) {
					return {
						target: 'agents-md',
						filePath,
						action: 'skipped',
						message: 'User kept existing AGENTS guide',
					};
				}
			} else {
				return {
					target: 'agents-md',
					filePath,
					action: 'skipped',
					message: 'File already exists',
				};
			}
		}

		await fs.writeFile(filePath, content);
		return {
			target: 'agents-md',
			filePath,
			action: exists ? 'merged' : 'created',
			message: exists ? 'Updated AI agent guide' : 'Created AI agent guide',
		};
	} catch (error) {
		return {
			target: 'agents-md',
			filePath,
			action: 'error',
			message: error instanceof Error ? error.message : 'Unknown error',
		};
	}
}
