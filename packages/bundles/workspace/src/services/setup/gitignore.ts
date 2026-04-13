import type { FsAdapter } from '../../ports/fs';
import type {
	SetupFileResult,
	SetupGitignoreBehavior,
	SetupPromptCallbacks,
} from './types';

const CONTRACTSPEC_GITIGNORE_BLOCK_START =
	'# contractspec:init:gitignore:start';
const CONTRACTSPEC_GITIGNORE_BLOCK_END = '# contractspec:init:gitignore:end';
const CONTRACTSPEC_GITIGNORE_BLOCK_NOTE =
	'# Managed by `contractspec init` and `contractspec connect init`.';

export async function setupGitignore(
	fs: FsAdapter,
	input: {
		interactive: boolean;
		patterns: string[];
		root: string;
		behavior?: SetupGitignoreBehavior;
		prompts?: Pick<SetupPromptCallbacks, 'confirm'>;
	}
): Promise<SetupFileResult> {
	const filePath = fs.join(input.root, '.gitignore');
	const behavior = input.behavior ?? 'auto';
	const patterns = dedupePatterns(input.patterns);

	if (patterns.length === 0 || behavior === 'skip') {
		return {
			target: 'gitignore',
			filePath,
			action: 'skipped',
			message:
				behavior === 'skip'
					? 'Skipped ContractSpec gitignore updates'
					: 'No ContractSpec ignore patterns requested',
		};
	}

	try {
		if (
			behavior === 'auto' &&
			input.interactive &&
			input.prompts &&
			!(await input.prompts.confirm(
				`Add recommended ContractSpec ignore rules to ${filePath}?`,
				true
			))
		) {
			return {
				target: 'gitignore',
				filePath,
				action: 'skipped',
				message: 'User skipped ContractSpec gitignore update',
			};
		}

		const exists = await fs.exists(filePath);
		const existingContent = exists ? await fs.readFile(filePath) : '';
		const nextContent = mergeGitignoreContent(existingContent, patterns);

		if (
			normalizeGitignore(existingContent) === normalizeGitignore(nextContent)
		) {
			return {
				target: 'gitignore',
				filePath,
				action: 'skipped',
				message: 'ContractSpec ignore rules already up to date',
			};
		}

		await fs.writeFile(filePath, nextContent);
		return {
			target: 'gitignore',
			filePath,
			action: exists ? 'merged' : 'created',
			message: exists
				? 'Updated ContractSpec-managed .gitignore rules'
				: 'Created .gitignore with ContractSpec-managed rules',
		};
	} catch (error) {
		return {
			target: 'gitignore',
			filePath,
			action: 'error',
			message: error instanceof Error ? error.message : 'Unknown error',
		};
	}
}

export function mergeGitignoreContent(
	existingContent: string,
	patterns: string[]
): string {
	const managedBlock = renderGitignoreBlock(patterns);
	const managedBlockPattern = createManagedGitignoreBlockPattern();
	const normalizedExisting = existingContent.replace(/\r\n/g, '\n');

	if (managedBlockPattern.test(normalizedExisting)) {
		return normalizedExisting.replace(managedBlockPattern, managedBlock);
	}

	if (normalizedExisting.trim().length === 0) {
		return managedBlock;
	}

	const withTrailingNewline = normalizedExisting.endsWith('\n')
		? normalizedExisting
		: `${normalizedExisting}\n`;
	return `${withTrailingNewline}\n${managedBlock}`;
}

function renderGitignoreBlock(patterns: string[]): string {
	return `${CONTRACTSPEC_GITIGNORE_BLOCK_START}
${CONTRACTSPEC_GITIGNORE_BLOCK_NOTE}
${dedupePatterns(patterns).join('\n')}
${CONTRACTSPEC_GITIGNORE_BLOCK_END}
`;
}

function createManagedGitignoreBlockPattern(): RegExp {
	return new RegExp(
		`${escapeRegex(CONTRACTSPEC_GITIGNORE_BLOCK_START)}[\\s\\S]*?${escapeRegex(CONTRACTSPEC_GITIGNORE_BLOCK_END)}(?:\\r?\\n)?`
	);
}

function escapeRegex(value: string): string {
	return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function normalizeGitignore(content: string): string {
	return content.replace(/\r\n/g, '\n').trimEnd();
}

function dedupePatterns(patterns: string[]): string[] {
	return [
		...new Set(patterns.map((pattern) => pattern.trim()).filter(Boolean)),
	];
}
