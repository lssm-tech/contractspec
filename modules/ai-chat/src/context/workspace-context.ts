/**
 * Workspace context management
 *
 * Provides access to specs, files, and codebase information
 * for context-aware AI chat assistance.
 */

/**
 * Spec information for context
 */
export interface SpecInfo {
  name: string;
  version: string;
  type: 'command' | 'query' | 'event' | 'presentation';
  path: string;
  description?: string;
  tags?: string[];
}

/**
 * File information for context
 */
export interface FileInfo {
  path: string;
  relativePath: string;
  name: string;
  extension: string;
  size: number;
  isSpec: boolean;
}

/**
 * Workspace summary for context
 */
export interface WorkspaceSummary {
  name: string;
  path: string;
  specs: {
    total: number;
    commands: number;
    queries: number;
    events: number;
    presentations: number;
  };
  files: {
    total: number;
    typescript: number;
    specFiles: number;
  };
}

/**
 * Configuration for workspace context
 */
export interface WorkspaceContextConfig {
  /** Root path of the workspace */
  workspacePath: string;
  /** File patterns to include */
  includePatterns?: string[];
  /** File patterns to exclude */
  excludePatterns?: string[];
  /** Maximum file size to read (bytes) */
  maxFileSize?: number;
  /** Whether to enable file writes */
  allowWrites?: boolean;
}

/**
 * Workspace context for AI chat
 */
export class WorkspaceContext {
  readonly workspacePath: string;
  readonly allowWrites: boolean;

  private specs: SpecInfo[] = [];
  private files: FileInfo[] = [];
  private initialized = false;

  constructor(config: WorkspaceContextConfig) {
    this.workspacePath = config.workspacePath;
    this.allowWrites = config.allowWrites ?? false;
  }

  /**
   * Initialize the workspace context by scanning files
   */
  async initialize(): Promise<void> {
    if (this.initialized) return;

    // This would scan the workspace for specs and files
    // For now, we just mark as initialized
    this.initialized = true;
  }

  /**
   * Get all discovered specs
   */
  getSpecs(): SpecInfo[] {
    return this.specs;
  }

  /**
   * Get all discovered files
   */
  getFiles(): FileInfo[] {
    return this.files;
  }

  /**
   * Add specs to the context
   */
  addSpecs(specs: SpecInfo[]): void {
    this.specs.push(...specs);
  }

  /**
   * Add files to the context
   */
  addFiles(files: FileInfo[]): void {
    this.files.push(...files);
  }

  /**
   * Get a summary of the workspace for context
   */
  getSummary(): WorkspaceSummary {
    const commands = this.specs.filter((s) => s.type === 'command').length;
    const queries = this.specs.filter((s) => s.type === 'query').length;
    const events = this.specs.filter((s) => s.type === 'event').length;
    const presentations = this.specs.filter(
      (s) => s.type === 'presentation'
    ).length;

    const tsFiles = this.files.filter((f) => f.extension === '.ts').length;
    const specFiles = this.files.filter((f) => f.isSpec).length;

    return {
      name: this.workspacePath.split('/').pop() ?? 'workspace',
      path: this.workspacePath,
      specs: {
        total: this.specs.length,
        commands,
        queries,
        events,
        presentations,
      },
      files: {
        total: this.files.length,
        typescript: tsFiles,
        specFiles,
      },
    };
  }

  /**
   * Get a context summary for LLM prompts
   */
  getContextSummary(): string {
    const summary = this.getSummary();

    const parts: string[] = [
      `Workspace: ${summary.name}`,
      `Path: ${summary.path}`,
      '',
      '### Specs',
      `- Commands: ${summary.specs.commands}`,
      `- Queries: ${summary.specs.queries}`,
      `- Events: ${summary.specs.events}`,
      `- Presentations: ${summary.specs.presentations}`,
    ];

    if (this.specs.length > 0) {
      parts.push('', '### Available Specs');
      for (const spec of this.specs.slice(0, 20)) {
        parts.push(`- ${spec.name} (${spec.type})`);
      }
      if (this.specs.length > 20) {
        parts.push(`- ... and ${this.specs.length - 20} more`);
      }
    }

    return parts.join('\n');
  }

  /**
   * Find specs matching a query
   */
  findSpecs(query: string): SpecInfo[] {
    const lowerQuery = query.toLowerCase();
    return this.specs.filter(
      (s) =>
        s.name.toLowerCase().includes(lowerQuery) ||
        s.description?.toLowerCase().includes(lowerQuery) ||
        s.tags?.some((t) => t.toLowerCase().includes(lowerQuery))
    );
  }

  /**
   * Find files matching a query
   */
  findFiles(query: string): FileInfo[] {
    const lowerQuery = query.toLowerCase();
    return this.files.filter(
      (f) =>
        f.path.toLowerCase().includes(lowerQuery) ||
        f.name.toLowerCase().includes(lowerQuery)
    );
  }
}

/**
 * Create a workspace context from a path
 */
export async function createWorkspaceContext(
  path: string,
  options?: Partial<WorkspaceContextConfig>
): Promise<WorkspaceContext> {
  const context = new WorkspaceContext({
    workspacePath: path,
    ...options,
  });
  await context.initialize();
  return context;
}
