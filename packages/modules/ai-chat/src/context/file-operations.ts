/**
 * File operations for workspace context
 *
 * Provides read/write operations for files in the workspace.
 */

/**
 * Result of a file read operation
 */
export interface FileReadResult {
  success: boolean;
  path: string;
  content?: string;
  error?: string;
}

/**
 * Result of a file write operation
 */
export interface FileWriteResult {
  success: boolean;
  path: string;
  error?: string;
}

/**
 * File operation to perform
 */
export interface FileOperation {
  type: 'read' | 'write' | 'create' | 'delete';
  path: string;
  content?: string;
}

/**
 * Result of a file operation
 */
export interface FileOperationResult {
  operation: FileOperation;
  success: boolean;
  content?: string;
  error?: string;
}

/**
 * Interface for file system operations
 */
export interface FileSystem {
  /**
   * Read a file's contents
   */
  readFile(path: string): Promise<string>;

  /**
   * Write content to a file
   */
  writeFile(path: string, content: string): Promise<void>;

  /**
   * Check if a file exists
   */
  exists(path: string): Promise<boolean>;

  /**
   * Delete a file
   */
  deleteFile(path: string): Promise<void>;

  /**
   * List files in a directory
   */
  listFiles(
    directory: string,
    options?: { recursive?: boolean; pattern?: string }
  ): Promise<string[]>;
}

/**
 * File operations executor
 */
export class FileOperations {
  constructor(
    private readonly fs: FileSystem,
    private readonly workspacePath: string,
    private readonly allowWrites = false
  ) {}

  /**
   * Read a file
   */
  async read(relativePath: string): Promise<FileReadResult> {
    const fullPath = this.resolvePath(relativePath);

    try {
      const content = await this.fs.readFile(fullPath);
      return { success: true, path: relativePath, content };
    } catch (error) {
      return {
        success: false,
        path: relativePath,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  /**
   * Write to a file
   */
  async write(relativePath: string, content: string): Promise<FileWriteResult> {
    if (!this.allowWrites) {
      return {
        success: false,
        path: relativePath,
        error: 'File writes are not enabled',
      };
    }

    const fullPath = this.resolvePath(relativePath);

    try {
      await this.fs.writeFile(fullPath, content);
      return { success: true, path: relativePath };
    } catch (error) {
      return {
        success: false,
        path: relativePath,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  /**
   * Execute multiple file operations
   */
  async execute(operations: FileOperation[]): Promise<FileOperationResult[]> {
    const results: FileOperationResult[] = [];

    for (const operation of operations) {
      let result: FileOperationResult;

      switch (operation.type) {
        case 'read': {
          const readResult = await this.read(operation.path);
          result = {
            operation,
            success: readResult.success,
            content: readResult.content,
            error: readResult.error,
          };
          break;
        }

        case 'write':
        case 'create': {
          if (!operation.content) {
            result = {
              operation,
              success: false,
              error: 'Content is required for write operations',
            };
          } else {
            const writeResult = await this.write(
              operation.path,
              operation.content
            );
            result = {
              operation,
              success: writeResult.success,
              error: writeResult.error,
            };
          }
          break;
        }

        case 'delete': {
          if (!this.allowWrites) {
            result = {
              operation,
              success: false,
              error: 'File writes are not enabled',
            };
          } else {
            try {
              await this.fs.deleteFile(this.resolvePath(operation.path));
              result = { operation, success: true };
            } catch (error) {
              result = {
                operation,
                success: false,
                error: error instanceof Error ? error.message : String(error),
              };
            }
          }
          break;
        }

        default:
          result = {
            operation,
            success: false,
            error: `Unknown operation type: ${(operation as FileOperation).type}`,
          };
      }

      results.push(result);
    }

    return results;
  }

  /**
   * Resolve a relative path to an absolute path
   */
  private resolvePath(relativePath: string): string {
    // Prevent path traversal
    const normalized = relativePath.replace(/\.\./g, '').replace(/^\//, '');
    return `${this.workspacePath}/${normalized}`;
  }
}

/**
 * Create a file operations instance with Node.js fs
 */
export function createNodeFileOperations(
  workspacePath: string,
  allowWrites = false
): FileOperations {
  // Dynamic import to avoid issues in browser environments
  const fs: FileSystem = {
    async readFile(path: string): Promise<string> {
      const { readFile } = await import('node:fs/promises');
      return readFile(path, 'utf-8');
    },
    async writeFile(path: string, content: string): Promise<void> {
      const { writeFile, mkdir } = await import('node:fs/promises');
      const { dirname } = await import('node:path');
      await mkdir(dirname(path), { recursive: true });
      await writeFile(path, content, 'utf-8');
    },
    async exists(path: string): Promise<boolean> {
      const { access } = await import('node:fs/promises');
      try {
        await access(path);
        return true;
      } catch {
        return false;
      }
    },
    async deleteFile(path: string): Promise<void> {
      const { unlink } = await import('node:fs/promises');
      await unlink(path);
    },
    async listFiles(
      directory: string,
      options?: { recursive?: boolean; pattern?: string }
    ): Promise<string[]> {
      const { readdir } = await import('node:fs/promises');
      const { join } = await import('node:path');

      const files: string[] = [];
      const entries = await readdir(directory, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = join(directory, entry.name);
        if (entry.isDirectory() && options?.recursive) {
          const subFiles = await this.listFiles(fullPath, options);
          files.push(...subFiles);
        } else if (entry.isFile()) {
          if (
            !options?.pattern ||
            entry.name.match(new RegExp(options.pattern))
          ) {
            files.push(fullPath);
          }
        }
      }

      return files;
    },
  };

  return new FileOperations(fs, workspacePath, allowWrites);
}
