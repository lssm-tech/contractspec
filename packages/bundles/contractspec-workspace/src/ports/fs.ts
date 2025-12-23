/**
 * Filesystem adapter port.
 */

/**
 * File statistics.
 */
export interface FileStat {
  size: number;
  isFile: boolean;
  isDirectory: boolean;
  mtime: Date;
}

/**
 * Options for file discovery.
 */
export interface DiscoverOptions {
  pattern?: string;
  patterns?: string[];
  ignore?: string[];
  /** Working directory for glob patterns. Defaults to process.cwd(). */
  cwd?: string;
  /** Return absolute paths instead of relative. Defaults to true. */
  absolute?: boolean;
}

/**
 * Filesystem adapter interface.
 */
export interface FsAdapter {
  /**
   * Check if a file or directory exists.
   */
  exists(path: string): Promise<boolean>;

  /**
   * Read file contents as string.
   */
  readFile(path: string): Promise<string>;

  /**
   * Write file contents.
   */
  writeFile(path: string, content: string): Promise<void>;

  /**
   * Delete a file or directory.
   */
  remove(path: string): Promise<void>;

  /**
   * Get file statistics.
   */
  stat(path: string): Promise<FileStat>;

  /**
   * Create directory (recursive).
   */
  mkdir(path: string): Promise<void>;

  /**
   * Discover files matching patterns.
   */
  glob(options: DiscoverOptions): Promise<string[]>;

  /**
   * Resolve path relative to cwd.
   */
  resolve(...paths: string[]): string;

  /**
   * Get directory name from path.
   */
  dirname(path: string): string;

  /**
   * Get base name from path.
   */
  basename(path: string): string;

  /**
   * Join path segments.
   */
  join(...paths: string[]): string;

  /**
   * Get relative path from base.
   */
  relative(from: string, to: string): string;
}
