export const COMPLETION_SHELLS = ['bash', 'zsh', 'fish'] as const;

export type CompletionShell = (typeof COMPLETION_SHELLS)[number];

export const COMPLETION_COMMAND_NAME = 'completion';
export const INTERNAL_COMPLETE_COMMAND_NAME = '__complete';
export const MANAGED_BLOCK_START = '# >>> contractspec completion >>>';
export const MANAGED_BLOCK_END = '# <<< contractspec completion <<<';

export function isCompletionShell(value: string): value is CompletionShell {
	return COMPLETION_SHELLS.includes(value as CompletionShell);
}
