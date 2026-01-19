/**
 * Main extraction function.
 *
 * Orchestrates the extraction process using detected frameworks
 * and registered extractors.
 */

import type {
  ExtractOptions,
  ExtractResult,
  ImportIR,
  ProjectInfo,
} from './types';
import { extractorRegistry } from './registry';

/**
 * Extract contracts from a project.
 *
 * @param project Project information (from detectFramework)
 * @param options Extraction options
 * @returns Extraction result with IR
 */
export async function extractFromProject(
  project: ProjectInfo,
  options: ExtractOptions = {}
): Promise<ExtractResult> {
  // Find matching extractors
  let extractors;

  if (options.framework) {
    // Use specific framework if requested
    extractors = extractorRegistry.findByFramework(options.framework);
    if (extractors.length === 0) {
      return {
        success: false,
        errors: [
          {
            code: 'EXTRACTOR_NOT_FOUND',
            message: `No extractor found for framework: ${options.framework}`,
            recoverable: false,
          },
        ],
      };
    }
  } else {
    // Auto-detect
    extractors = await extractorRegistry.findMatching(project);
    if (extractors.length === 0) {
      return {
        success: false,
        errors: [
          {
            code: 'NO_FRAMEWORK_DETECTED',
            message: 'No supported framework detected in project',
            recoverable: false,
          },
        ],
      };
    }
  }

  // Use the highest priority extractor
  const extractor = extractors[0];
  if (!extractor) {
    return {
      success: false,
      errors: [
        {
          code: 'NO_EXTRACTOR',
          message: 'No extractor available',
          recoverable: false,
        },
      ],
    };
  }

  // Run extraction
  const result = await extractor.extract(project, options);

  return result;
}

/**
 * Merge multiple IRs into one.
 * Useful when extracting from multiple sources or frameworks.
 */
export function mergeIRs(irs: ImportIR[]): ImportIR {
  if (irs.length === 0) {
    throw new Error('Cannot merge empty IR array');
  }

  if (irs.length === 1) {
    if (!irs[0]) throw new Error('First IR is undefined');
    return irs[0];
  }

  const first = irs[0];
  if (!first) throw new Error('First IR is undefined');
  const merged: ImportIR = {
    version: '1.0',
    extractedAt: new Date().toISOString(),
    project: first.project,
    endpoints: [],
    schemas: [],
    errors: [],
    events: [],
    ambiguities: [],
    stats: {
      filesScanned: 0,
      endpointsFound: 0,
      schemasFound: 0,
      errorsFound: 0,
      eventsFound: 0,
      ambiguitiesFound: 0,
      highConfidence: 0,
      mediumConfidence: 0,
      lowConfidence: 0,
    },
  };

  for (const ir of irs) {
    merged.endpoints.push(...ir.endpoints);
    merged.schemas.push(...ir.schemas);
    merged.errors.push(...ir.errors);
    merged.events.push(...ir.events);
    merged.ambiguities.push(...ir.ambiguities);

    merged.stats.filesScanned += ir.stats.filesScanned;
    merged.stats.endpointsFound += ir.stats.endpointsFound;
    merged.stats.schemasFound += ir.stats.schemasFound;
    merged.stats.errorsFound += ir.stats.errorsFound;
    merged.stats.eventsFound += ir.stats.eventsFound;
    merged.stats.ambiguitiesFound += ir.stats.ambiguitiesFound;
    merged.stats.highConfidence += ir.stats.highConfidence;
    merged.stats.mediumConfidence += ir.stats.mediumConfidence;
    merged.stats.lowConfidence += ir.stats.lowConfidence;
  }

  return merged;
}

/**
 * Create an empty IR structure.
 */
export function createEmptyIR(project: ProjectInfo): ImportIR {
  return {
    version: '1.0',
    extractedAt: new Date().toISOString(),
    project,
    endpoints: [],
    schemas: [],
    errors: [],
    events: [],
    ambiguities: [],
    stats: {
      filesScanned: 0,
      endpointsFound: 0,
      schemasFound: 0,
      errorsFound: 0,
      eventsFound: 0,
      ambiguitiesFound: 0,
      highConfidence: 0,
      mediumConfidence: 0,
      lowConfidence: 0,
    },
  };
}
