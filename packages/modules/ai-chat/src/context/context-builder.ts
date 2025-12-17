/**
 * Context builder for LLM prompts
 *
 * Builds rich context from workspace information for AI assistance.
 */
import type { WorkspaceContext, SpecInfo, FileInfo } from './workspace-context';

/**
 * Context entry for a file or spec
 */
export interface ContextEntry {
  type: 'spec' | 'file' | 'reference';
  path: string;
  content?: string;
  summary?: string;
  relevance: number; // 0-1 score
}

/**
 * Built context for LLM
 */
export interface BuiltContext {
  entries: ContextEntry[];
  summary: string;
  totalTokensEstimate: number;
}

/**
 * Options for building context
 */
export interface ContextBuilderOptions {
  /** Maximum estimated tokens for context */
  maxTokens?: number;
  /** Query to use for relevance scoring */
  query?: string;
  /** Specific files to include */
  includeFiles?: string[];
  /** Specific specs to include */
  includeSpecs?: string[];
}

/**
 * Estimates token count from string (rough approximation)
 */
function estimateTokens(text: string): number {
  // Rough estimate: ~4 characters per token
  return Math.ceil(text.length / 4);
}

/**
 * Calculate relevance score for a spec
 */
function scoreSpec(spec: SpecInfo, query?: string): number {
  if (!query) return 0.5;

  const lowerQuery = query.toLowerCase();
  let score = 0;

  // Name match
  if (spec.name.toLowerCase().includes(lowerQuery)) {
    score += 0.4;
  }

  // Description match
  if (spec.description?.toLowerCase().includes(lowerQuery)) {
    score += 0.3;
  }

  // Tag match
  if (spec.tags?.some((t) => t.toLowerCase().includes(lowerQuery))) {
    score += 0.2;
  }

  return Math.min(score, 1);
}

/**
 * Calculate relevance score for a file
 */
function scoreFile(file: FileInfo, query?: string): number {
  if (!query) return 0.5;

  const lowerQuery = query.toLowerCase();
  let score = 0;

  // Path match
  if (file.path.toLowerCase().includes(lowerQuery)) {
    score += 0.5;
  }

  // Name match
  if (file.name.toLowerCase().includes(lowerQuery)) {
    score += 0.3;
  }

  // Spec file bonus
  if (file.isSpec) {
    score += 0.2;
  }

  return Math.min(score, 1);
}

/**
 * Context builder for creating rich LLM context
 */
export class ContextBuilder {
  private readonly context: WorkspaceContext;

  constructor(context: WorkspaceContext) {
    this.context = context;
  }

  /**
   * Build context for a chat message
   */
  build(options: ContextBuilderOptions = {}): BuiltContext {
    const maxTokens = options.maxTokens ?? 4000;
    const entries: ContextEntry[] = [];
    let totalTokens = 0;

    // Add explicitly included specs
    if (options.includeSpecs?.length) {
      for (const specName of options.includeSpecs) {
        const spec = this.context.getSpecs().find((s) => s.name === specName);
        if (spec) {
          const entry: ContextEntry = {
            type: 'spec',
            path: spec.path,
            summary: `${spec.type}: ${spec.name}${spec.description ? ` - ${spec.description}` : ''}`,
            relevance: 1,
          };
          entries.push(entry);
          totalTokens += estimateTokens(entry.summary ?? '');
        }
      }
    }

    // Add explicitly included files
    if (options.includeFiles?.length) {
      for (const filePath of options.includeFiles) {
        const file = this.context.getFiles().find((f) => f.path === filePath);
        if (file) {
          const entry: ContextEntry = {
            type: 'file',
            path: file.path,
            summary: `File: ${file.relativePath}`,
            relevance: 1,
          };
          entries.push(entry);
          totalTokens += estimateTokens(entry.summary ?? '');
        }
      }
    }

    // Add relevant specs based on query
    if (options.query) {
      const scoredSpecs = this.context
        .getSpecs()
        .map((spec) => ({ spec, score: scoreSpec(spec, options.query) }))
        .filter(({ score }) => score > 0.2)
        .sort((a, b) => b.score - a.score);

      for (const { spec, score } of scoredSpecs) {
        if (totalTokens >= maxTokens) break;
        if (entries.some((e) => e.path === spec.path)) continue;

        const entry: ContextEntry = {
          type: 'spec',
          path: spec.path,
          summary: `${spec.type}: ${spec.name}${spec.description ? ` - ${spec.description}` : ''}`,
          relevance: score,
        };
        entries.push(entry);
        totalTokens += estimateTokens(entry.summary ?? '');
      }
    }

    // Add relevant files based on query
    if (options.query) {
      const scoredFiles = this.context
        .getFiles()
        .map((file) => ({ file, score: scoreFile(file, options.query) }))
        .filter(({ score }) => score > 0.2)
        .sort((a, b) => b.score - a.score);

      for (const { file, score } of scoredFiles) {
        if (totalTokens >= maxTokens) break;
        if (entries.some((e) => e.path === file.path)) continue;

        const entry: ContextEntry = {
          type: 'file',
          path: file.path,
          summary: `File: ${file.relativePath}`,
          relevance: score,
        };
        entries.push(entry);
        totalTokens += estimateTokens(entry.summary ?? '');
      }
    }

    // Build summary
    const summary = this.buildSummary(entries);

    return {
      entries,
      summary,
      totalTokensEstimate: totalTokens + estimateTokens(summary),
    };
  }

  /**
   * Build a text summary of the context entries
   */
  private buildSummary(entries: ContextEntry[]): string {
    if (entries.length === 0) {
      return this.context.getContextSummary();
    }

    const parts: string[] = [];

    // Workspace info
    const workspaceSummary = this.context.getSummary();
    parts.push(`Workspace: ${workspaceSummary.name}`);
    parts.push('');

    // Relevant specs
    const specs = entries.filter((e) => e.type === 'spec');
    if (specs.length > 0) {
      parts.push('### Relevant Specs');
      for (const entry of specs) {
        parts.push(`- ${entry.summary}`);
      }
      parts.push('');
    }

    // Relevant files
    const files = entries.filter((e) => e.type === 'file');
    if (files.length > 0) {
      parts.push('### Relevant Files');
      for (const entry of files) {
        parts.push(`- ${entry.summary}`);
      }
    }

    return parts.join('\n');
  }
}

/**
 * Create a context builder
 */
export function createContextBuilder(context: WorkspaceContext): ContextBuilder {
  return new ContextBuilder(context);
}

