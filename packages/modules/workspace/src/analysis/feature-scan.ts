import {
  isStability,
  matchStringArrayField,
  matchStringField,
} from './utils/matchers';
import type { FeatureScanResult } from '../types/analysis-types';
import { extractFeatureRefs } from './feature-extractor';

/**
 * Check if a file is a feature file based on naming conventions.
 */
export function isFeatureFile(filePath: string): boolean {
  return filePath.includes('.feature.') && filePath.endsWith('.ts');
}

/**
 * Scan a feature source file to extract metadata.
 */
export function scanFeatureSource(
  code: string,
  filePath: string
): FeatureScanResult {
  const key = matchStringField(code, 'key') ?? extractKeyFromFilePath(filePath);
  const versionRaw = matchStringField(code, 'version');
  const version = versionRaw ?? '1.0.0'; // Default version
  const title = matchStringField(code, 'title') ?? undefined;
  const description = matchStringField(code, 'description') ?? undefined;
  const goal = matchStringField(code, 'goal') ?? undefined;
  const context = matchStringField(code, 'context') ?? undefined;
  const stabilityRaw = matchStringField(code, 'stability');
  const stability = isStability(stabilityRaw) ? stabilityRaw : undefined;
  const owners = matchStringArrayField(code, 'owners');
  const tags = matchStringArrayField(code, 'tags');

  // Parse structure using ts-morph to extract nested refs
  const refs = extractFeatureRefs(code);

  return {
    filePath,
    key,
    version,
    title,
    description,
    goal,
    context,
    stability,
    owners,
    tags,
    operations: refs.operations,
    events: refs.events,
    presentations: refs.presentations,
    experiments: refs.experiments,
    capabilities: refs.capabilities,
    opToPresentationLinks: refs.opToPresentationLinks,
    presentationsTargets: refs.presentationsTargets,
    sourceBlock: code,
  };
}

/**
 * Extract key from file path as fallback.
 */
function extractKeyFromFilePath(filePath: string): string {
  const fileName = filePath.split('/').pop() ?? filePath;
  return fileName
    .replace(/\.feature\.[jt]s$/, '')
    .replace(/[^a-zA-Z0-9-]/g, '-');
}
