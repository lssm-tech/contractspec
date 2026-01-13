/**
 * Coverage report parsers.
 *
 * Parses coverage reports from various test runners into a unified format.
 */

import type { CoverageReport } from '../types';
import { parseIstanbulCoverage } from './istanbul-parser';

/**
 * Supported coverage report formats.
 */
export type CoverageFormat = 'istanbul' | 'lcov' | 'cobertura';

/**
 * Parser interface for coverage reports.
 */
export interface CoverageParser {
  /**
   * Parse a coverage report file or directory.
   *
   * @param content - The file content or directory path
   * @returns Parsed coverage report
   */
  parse(content: string): CoverageReport;
}

/**
 * Create a parser for the specified format.
 *
 * @param format - The coverage report format
 * @returns A parser for the format
 */
export function createParser(format: CoverageFormat): CoverageParser {
  switch (format) {
    case 'istanbul':
      return { parse: parseIstanbulCoverage };
    case 'lcov':
      // LCOV support can be added later
      throw new Error('LCOV format not yet supported');
    case 'cobertura':
      // Cobertura support can be added later
      throw new Error('Cobertura format not yet supported');
    default:
      throw new Error(`Unknown coverage format: ${format}`);
  }
}

/**
 * Detect the coverage format from a file path or content.
 *
 * @param path - The file path
 * @param content - Optional file content
 * @returns The detected format
 */
export function detectFormat(path: string, content?: string): CoverageFormat {
  // Check file extension first
  if (path.endsWith('.json') || path.includes('coverage-final.json')) {
    return 'istanbul';
  }
  if (path.endsWith('.lcov') || path.includes('lcov.info')) {
    return 'lcov';
  }
  if (path.endsWith('.xml') && content?.includes('cobertura')) {
    return 'cobertura';
  }

  // Default to Istanbul JSON
  return 'istanbul';
}

export { parseIstanbulCoverage } from './istanbul-parser';
