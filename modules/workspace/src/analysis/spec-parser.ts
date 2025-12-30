/**
 * Spec Parser
 *
 * Coordinates scanning of source files and mapping to ParsedSpec format
 * for LLM consumption.
 */

import { readFile } from 'node:fs/promises';
import { isFeatureFile, scanFeatureSource } from './feature-scan';
import { scanAllSpecsFromSource } from './spec-scan';
import type { ParsedSpec, ParsedSpecMeta, SpecRef } from '../types/llm-types';
import type {
  FeatureScanResult,
  RefInfo,
  SpecScanResult,
} from '../types/analysis-types';

/**
 * Load and parse specs from a source file.
 */
export async function loadSpecFromSource(
  filePath: string
): Promise<ParsedSpec[]> {
  try {
    const code = await readFile(filePath, 'utf-8');

    if (isFeatureFile(filePath)) {
      const featureResult = scanFeatureSource(code, filePath);
      return [mapFeatureResultToParsedSpec(featureResult)];
    }

    const specResults = scanAllSpecsFromSource(code, filePath);
    return specResults.map(mapSpecResultToParsedSpec);
  } catch (error) {
    // Return empty array if file reading fails
    console.warn(`Failed to parse spec from ${filePath}:`, error);
    return [];
  }
}

/**
 * Map FeatureScanResult to ParsedSpec.
 */
function mapFeatureResultToParsedSpec(result: FeatureScanResult): ParsedSpec {
  const meta: ParsedSpecMeta = {
    key: result.key,
    version: '1.0.0', // Default for features if not specified
    description: result.description,
    stability: result.stability,
    owners: result.owners,
    tags: result.tags,
    goal: result.goal,
    context: result.context,
  };

  return {
    meta,
    specType: 'feature',
    filePath: result.filePath,
    sourceBlock: result.sourceBlock,
    operations: result.operations.map(mapToSpecRef),
    events: result.events.map(mapToSpecRef),
    presentations: result.presentations.map(mapToSpecRef),
  };
}

/**
 * Map SpecScanResult to ParsedSpec.
 */
function mapSpecResultToParsedSpec(result: SpecScanResult): ParsedSpec {
  const meta: ParsedSpecMeta = {
    key: result.key ?? 'unknown',
    version: result.version ?? '1.0.0',
    description: result.description,
    stability: result.stability,
    owners: result.owners,
    tags: result.tags,
    goal: result.goal,
    context: result.context,
  };

  return {
    meta,
    specType: result.specType,
    kind: result.kind,
    hasIo: result.hasIo,
    hasPolicy: result.hasPolicy,
    hasPayload: result.hasPayload,
    hasContent: result.hasContent,
    hasDefinition: result.hasDefinition,
    emittedEvents: result.emittedEvents?.map(mapToSpecRef),
    policyRefs: result.policyRefs?.map(mapToSpecRef),
    testRefs: result.testRefs?.map(mapToSpecRef),
    filePath: result.filePath,
    sourceBlock: result.sourceBlock,
  };
}

/**
 * Map RefInfo to SpecRef.
 */
function mapToSpecRef(ref: RefInfo): SpecRef {
  return {
    name: ref.key,
    version: ref.version,
  };
}
