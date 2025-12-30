/**
 * Git adapter port.
 */

/**
 * Git adapter interface.
 */
export interface GitAdapter {
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
