import type { FsAdapter } from '../../../ports/fs';
import { generateUsageGuide } from '../config-generators';
import {
	mergeManagedMarkdown,
	renderManagedMarkdownBlock,
} from '../managed-markdown';
import type {
	SetupFileResult,
	SetupOptions,
	SetupPromptCallbacks,
} from '../types';

export const CONTRACTSPEC_USAGE_BLOCK_START =
	'<!-- contractspec:init:usage:start -->';
export const CONTRACTSPEC_USAGE_BLOCK_END =
	'<!-- contractspec:init:usage:end -->';
const CONTRACTSPEC_USAGE_BLOCK_NOTE =
	'<!-- This section is managed by `contractspec init` and `contractspec onboard`. Content outside these markers is user-owned and preserved. -->';

const MANAGED_SECTION = {
	endMarker: CONTRACTSPEC_USAGE_BLOCK_END,
	note: CONTRACTSPEC_USAGE_BLOCK_NOTE,
	startMarker: CONTRACTSPEC_USAGE_BLOCK_START,
} as const;

export async function setupUsageMd(
	fs: FsAdapter,
	options: SetupOptions,
	prompts: SetupPromptCallbacks
): Promise<SetupFileResult> {
	const targetRoot =
		options.isMonorepo && options.scope === 'package'
			? (options.packageRoot ?? options.workspaceRoot)
			: options.workspaceRoot;
	const filePath = fs.join(targetRoot, 'USAGE.md');

	try {
		const exists = await fs.exists(filePath);
		const guideContent = generateUsageGuide(options);

		if (exists) {
			const existingContent = await fs.readFile(filePath);

			if (options.interactive) {
				const proceed = await prompts.confirm(
					`${filePath} exists. Add or update the ContractSpec-managed section while preserving existing content?`
				);
				if (!proceed) {
					return {
						target: 'usage-md',
						filePath,
						action: 'skipped',
						message: 'User skipped usage guide merge',
					};
				}
			}

			await fs.writeFile(
				filePath,
				mergeManagedMarkdown(
					existingContent,
					guideContent,
					MANAGED_SECTION,
					guideContent
				)
			);
			return {
				target: 'usage-md',
				filePath,
				action: 'merged',
				message: 'Added or updated the ContractSpec-managed USAGE.md section',
			};
		}

		await fs.writeFile(
			filePath,
			renderManagedMarkdownBlock(guideContent, MANAGED_SECTION)
		);
		return {
			target: 'usage-md',
			filePath,
			action: 'created',
			message: 'Created usage guide',
		};
	} catch (error) {
		return {
			target: 'usage-md',
			filePath,
			action: 'error',
			message: error instanceof Error ? error.message : 'Unknown error',
		};
	}
}
