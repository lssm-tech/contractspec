/**
 * Git adapter port.
 */

/**
 * Git adapter interface.
 */
export interface GitAdapter {
	/**
	 * Get the current branch name when available.
	 */
	currentBranch(): Promise<string | undefined>;

	/**
	 * Get file contents at a specific git ref (branch, tag, commit).
	 */
	showFile(ref: string, filePath: string): Promise<string>;

	/**
	 * Clean untracked files (dangerous operation).
	 */
	clean(options?: GitCleanOptions): Promise<void>;

	/**
	 * Check if path is inside a git repository.
	 */
	isGitRepo(path?: string): Promise<boolean>;

	/**
	 * Get commit log since a baseline ref.
	 */
	log(baseline?: string): Promise<GitLogEntry[]>;

	/**
	 * Get list of files changed between baseline and HEAD.
	 * Uses three-dot diff (baseline...HEAD) to show changes since branches diverged.
	 */
	diffFiles(baseline: string, patterns?: string[]): Promise<string[]>;

	/**
	 * Get changed file status entries in the working tree.
	 */
	statusFiles?(patterns?: string[]): Promise<GitChangedFile[]>;

	/**
	 * Get changed file status entries between a baseline ref and HEAD.
	 */
	diffNameStatus?(
		baseline: string,
		patterns?: string[]
	): Promise<GitChangedFile[]>;
}

/**
 * Changed file entry from git status or diff --name-status.
 */
export interface GitChangedFile {
	status: string;
	path: string;
	previousPath?: string;
}

/**
 * Entry from git log.
 */
export interface GitLogEntry {
	hash: string;
	message: string;
	author?: string;
	date?: string;
}

/**
 * Options for git clean.
 */
export interface GitCleanOptions {
	dryRun?: boolean;
	force?: boolean;
	directories?: boolean;
	ignored?: boolean;
}
