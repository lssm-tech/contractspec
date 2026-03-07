import type {
  BenchmarkDimension,
  BenchmarkResult,
  BenchmarkSource,
} from '../types';

export interface IngesterOptions {
  /** Override the fetch function (useful for testing). */
  fetch?: typeof globalThis.fetch;
  /** Override the default source URL. */
  sourceUrl?: string;
  /** Filter to specific model IDs. */
  modelFilter?: string[];
  /** Maximum number of results to return. */
  maxResults?: number;
  /** Only include results measured on or after this date. */
  fromDate?: Date;
  /** Only include results measured on or before this date. */
  toDate?: Date;
  /** Only include results for these dimensions. */
  dimensions?: BenchmarkDimension[];
}

/**
 * A benchmark ingester fetches and normalizes data from a single
 * external source into the canonical BenchmarkResult format.
 */
export interface BenchmarkIngester {
  readonly source: BenchmarkSource;
  readonly displayName: string;
  readonly description: string;

  /**
   * Fetch benchmark data from the external source.
   * Returns normalized BenchmarkResult entries.
   */
  ingest(options?: IngesterOptions): Promise<BenchmarkResult[]>;
}
