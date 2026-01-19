/**
 * Base extractor class.
 *
 * Provides common functionality for all framework extractors.
 */

import type { SourceExtractor } from '../registry';
import type {
  ConfidenceLevel,
  ConfidenceMeta,
  EndpointCandidate,
  ExtractOptions,
  ExtractResult,
  HttpMethod,
  ImportIR,
  OpKind,
  ProjectInfo,
  SchemaCandidate,
  SourceLocation,
} from '../types';
import { createEmptyIR } from '../extract';

/**
 * File system adapter interface for extractors.
 */
export interface ExtractorFsAdapter {
  readFile(path: string): Promise<string>;
  glob(pattern: string, options?: { cwd?: string }): Promise<string[]>;
  exists(path: string): Promise<boolean>;
}

/**
 * Context passed to extraction methods.
 */
export interface ExtractionContext {
  project: ProjectInfo;
  options: ExtractOptions;
  fs: ExtractorFsAdapter;
  ir: ImportIR;
}

/**
 * Abstract base class for source extractors.
 * Provides common utilities and structure for framework-specific extractors.
 */
export abstract class BaseExtractor implements SourceExtractor {
  abstract id: string;
  abstract name: string;
  abstract frameworks: string[];
  priority = 10;

  /**
   * File system adapter - must be set before extraction.
   */
  protected fs?: ExtractorFsAdapter;

  /**
   * Set the file system adapter.
   */
  setFs(fs: ExtractorFsAdapter): void {
    this.fs = fs;
  }

  /**
   * Detect if this extractor can handle the given project.
   * Default implementation checks if any supported framework is detected.
   */
  async detect(project: ProjectInfo): Promise<boolean> {
    return project.frameworks.some((fw) => this.frameworks.includes(fw.id));
  }

  /**
   * Main extraction method.
   */
  async extract(
    project: ProjectInfo,
    options: ExtractOptions
  ): Promise<ExtractResult> {
    if (!this.fs) {
      return {
        success: false,
        errors: [
          {
            code: 'NO_FS_ADAPTER',
            message: 'File system adapter not configured',
            recoverable: false,
          },
        ],
      };
    }

    const ir = createEmptyIR(project);
    const ctx: ExtractionContext = {
      project,
      options,
      fs: this.fs,
      ir,
    };

    try {
      await this.doExtract(ctx);
      this.calculateStats(ir);
      return { success: true, ir };
    } catch (error) {
      return {
        success: false,
        errors: [
          {
            code: 'EXTRACTION_ERROR',
            message: error instanceof Error ? error.message : String(error),
            recoverable: false,
          },
        ],
      };
    }
  }

  /**
   * Implement this method in subclasses to perform actual extraction.
   */
  protected abstract doExtract(ctx: ExtractionContext): Promise<void>;

  /**
   * Calculate statistics for the IR.
   */
  protected calculateStats(ir: ImportIR): void {
    ir.stats.endpointsFound = ir.endpoints.length;
    ir.stats.schemasFound = ir.schemas.length;
    ir.stats.errorsFound = ir.errors.length;
    ir.stats.eventsFound = ir.events.length;
    ir.stats.ambiguitiesFound = ir.ambiguities.length;

    const allItems = [
      ...ir.endpoints,
      ...ir.schemas,
      ...ir.errors,
      ...ir.events,
    ];

    for (const item of allItems) {
      switch (item.confidence.level) {
        case 'high':
          ir.stats.highConfidence++;
          break;
        case 'medium':
          ir.stats.mediumConfidence++;
          break;
        case 'low':
        case 'ambiguous':
          ir.stats.lowConfidence++;
          break;
      }
    }
  }

  // ───────────────────────────────────────────────────────────────────
  // Helper methods for subclasses
  // ───────────────────────────────────────────────────────────────────

  /**
   * Generate a unique ID for an endpoint.
   */
  protected generateEndpointId(
    method: HttpMethod,
    path: string,
    handlerName?: string
  ): string {
    const pathPart = path
      .replace(/^\//, '')
      .replace(/\//g, '.')
      .replace(/:/g, '')
      .replace(/\{/g, '')
      .replace(/\}/g, '');
    const base = `${method.toLowerCase()}.${pathPart}`;
    return handlerName ? `${base}.${handlerName}` : base;
  }

  /**
   * Generate a unique ID for a schema.
   */
  protected generateSchemaId(name: string, file: string): string {
    const filePart = file
      .replace(/\.ts$/, '')
      .replace(/\//g, '.')
      .replace(/^\.+/, '');
    return `${filePart}.${name}`;
  }

  /**
   * Determine operation kind from HTTP method.
   */
  protected methodToOpKind(method: HttpMethod): OpKind {
    switch (method) {
      case 'GET':
      case 'HEAD':
      case 'OPTIONS':
        return 'query';
      default:
        return 'command';
    }
  }

  /**
   * Create a source location object.
   */
  protected createLocation(
    file: string,
    startLine: number,
    endLine: number
  ): SourceLocation {
    return { file, startLine, endLine };
  }

  /**
   * Create confidence metadata.
   */
  protected createConfidence(
    level: ConfidenceLevel,
    ...reasons: ConfidenceMeta['reasons']
  ): ConfidenceMeta {
    return { level, reasons };
  }

  /**
   * Add an endpoint to the IR.
   */
  protected addEndpoint(
    ctx: ExtractionContext,
    endpoint: EndpointCandidate
  ): void {
    ctx.ir.endpoints.push(endpoint);
  }

  /**
   * Add a schema to the IR.
   */
  protected addSchema(ctx: ExtractionContext, schema: SchemaCandidate): void {
    ctx.ir.schemas.push(schema);
  }
}
