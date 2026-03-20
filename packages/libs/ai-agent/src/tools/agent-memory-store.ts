/**
 * Storage interface for agent memory tools (model-accessible CRUD).
 *
 * Used by Anthropic memory tool and custom memory tools. Distinct from
 * AgentMemoryManager (session summarization). Storage backend can be
 * in-memory, filesystem, or ephemeral knowledge space.
 *
 * @see https://ai-sdk.dev/docs/agents/memory
 * @see https://console.anthropic.com/docs/en/agents-and-tools/tool-use/memory-tool
 */
export interface AgentMemoryStore {
	/** View directory contents or file contents. Path must be under /memories. */
	view(path: string, viewRange?: [number, number]): Promise<string>;

	/** Create a new file. Path must be under /memories. */
	create(path: string, fileText: string): Promise<string>;

	/** Replace old_str with new_str in file. */
	strReplace(path: string, oldStr: string, newStr: string): Promise<string>;

	/** Insert text at line. insertLine is 0-indexed (0 = before first line). */
	insert(path: string, insertLine: number, insertText: string): Promise<string>;

	/** Delete file or directory recursively. */
	delete(path: string): Promise<string>;

	/** Rename/move file or directory. */
	rename(oldPath: string, newPath: string): Promise<string>;
}

/** Validates path is under /memories and prevents traversal. */
export function validateMemoryPath(path: string): void {
	const normalized = path.replace(/\\/g, '/').replace(/\/+/g, '/');
	if (
		!normalized.startsWith('/memories') ||
		normalized.includes('..') ||
		normalized === '/memories/..' ||
		normalized.startsWith('/memories/../')
	) {
		throw new Error(
			`Invalid memory path: ${path}. Path must be under /memories and cannot contain traversal sequences.`
		);
	}
}
