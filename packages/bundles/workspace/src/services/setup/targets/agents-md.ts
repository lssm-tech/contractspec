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

const CONTRACTSPEC_AGENTS_BLOCK_START =
	'<!-- contractspec:init:agents:start -->';
const CONTRACTSPEC_AGENTS_BLOCK_END = '<!-- contractspec:init:agents:end -->';
const CONTRACTSPEC_AGENTS_BLOCK_NOTE =
	'<!-- This section is managed by `contractspec init`. Content outside these markers is user-owned and preserved. -->';

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
		const guideContent = generateAgentsGuide(options);

		if (exists) {
			const existingContent = await fs.readFile(filePath);

			if (options.interactive) {
				const proceed = await prompts.confirm(
					`${filePath} exists. Add or update the ContractSpec-managed section while preserving existing content?`
				);
				if (!proceed) {
					return {
						target: 'agents-md',
						filePath,
						action: 'skipped',
						message: 'User skipped AGENTS guide merge',
					};
				}
			}

			await fs.writeFile(
				filePath,
				mergeAgentsGuide(existingContent, guideContent)
			);
			return {
				target: 'agents-md',
				filePath,
				action: 'merged',
				message: 'Added or updated the ContractSpec-managed AGENTS.md section',
			};
		}

		await fs.writeFile(filePath, renderManagedAgentsBlock(guideContent));
		return {
			target: 'agents-md',
			filePath,
			action: 'created',
			message: 'Created AI agent guide',
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

function mergeAgentsGuide(
	existingContent: string,
	guideContent: string
): string {
	const managedBlock = renderManagedAgentsBlock(guideContent);
	const managedBlockPattern = createManagedAgentsBlockPattern();

	if (managedBlockPattern.test(existingContent)) {
		return existingContent.replace(managedBlockPattern, managedBlock);
	}

	if (
		normalizeAgentsContent(existingContent) ===
		normalizeAgentsContent(guideContent)
	) {
		return managedBlock;
	}

	return `${managedBlock}${existingContent}`;
}

function renderManagedAgentsBlock(guideContent: string): string {
	const normalizedGuide = guideContent.replace(/\r\n/g, '\n').trimEnd();
	return `${CONTRACTSPEC_AGENTS_BLOCK_START}
${CONTRACTSPEC_AGENTS_BLOCK_NOTE}
${normalizedGuide}
${CONTRACTSPEC_AGENTS_BLOCK_END}
`;
}

function normalizeAgentsContent(content: string): string {
	return content.replace(/\r\n/g, '\n').trimEnd();
}

function createManagedAgentsBlockPattern(): RegExp {
	return new RegExp(
		`${escapeRegex(CONTRACTSPEC_AGENTS_BLOCK_START)}[\\s\\S]*?${escapeRegex(CONTRACTSPEC_AGENTS_BLOCK_END)}(?:\\r?\\n)?`
	);
}

function escapeRegex(value: string): string {
	return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
