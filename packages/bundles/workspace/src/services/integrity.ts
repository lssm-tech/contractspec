/**
 * Contract integrity analysis service.
 *
 * Analyzes contract specs and features to detect:
 * - Orphaned specs (not linked to any feature)
 * - Unresolved references (broken event/op/presentation refs)
 * - Feature coverage metrics
 */

import {
  type AnalyzedSpecType,
  type FeatureScanResult,
  isFeatureFile,
  type RefInfo,
  scanAllSpecsFromSource,
  scanFeatureSource,
} from '@contractspec/module.workspace';
import type { FsAdapter } from '../ports/fs';
import type { LoggerAdapter } from '../ports/logger';
import {
  buildTestIndex,
  type ExtractedTestTarget,
  type TestSpecScanResult,
} from './test-link';

/**
 * Options for integrity analysis.
 */
export interface IntegrityAnalysisOptions {
  /**
   * Glob pattern for file discovery.
   */
  pattern?: string;
  /**
   * Working directory for scanning.
   */
  cwd?: string;

  /**
   * Scan all packages in monorepo.
   */
  all?: boolean;

  /**
   * Analyze only a specific feature by key.
   */
  featureKey?: string;

  /**
   * Filter by spec type.
   */
  specType?: AnalyzedSpecType;

  /**
   * Require tests for specific spec types.
   */
  requireTestsFor?: AnalyzedSpecType[];
}

/**
 * Location of a spec in the codebase.
 */
export interface SpecLocation {
  key: string;
  version: string;
  file: string;
  type: AnalyzedSpecType;
  stability?: string;
  /** Test target for test-spec files (extracted from TestSpec.target) */
  testTarget?: ExtractedTestTarget;
}

/**
 * Inventory of all discovered specs organized by type.
 */
export interface SpecInventory {
  operations: Map<string, SpecLocation>;
  events: Map<string, SpecLocation>;
  presentations: Map<string, SpecLocation>;
  capabilities: Map<string, SpecLocation>;
  workflows: Map<string, SpecLocation>;
  dataViews: Map<string, SpecLocation>;
  forms: Map<string, SpecLocation>;
  migrations: Map<string, SpecLocation>;
  experiments: Map<string, SpecLocation>;
  integrations: Map<string, SpecLocation>;
  knowledge: Map<string, SpecLocation>;
  telemetry: Map<string, SpecLocation>;
  appConfigs: Map<string, SpecLocation>;
  policies: Map<string, SpecLocation>;
  testSpecs: Map<string, SpecLocation>;
}

/**
 * An integrity issue found during analysis.
 */
export interface IntegrityIssue {
  severity: 'error' | 'warning';
  type:
    | 'orphaned'
    | 'unresolved-ref'
    | 'missing-feature'
    | 'broken-link'
    | 'missing-test';
  message: string;
  file: string;
  specKey?: string;
  specType?: AnalyzedSpecType;
  ref?: RefInfo;
  featureKey?: string;
}

/**
 * Coverage metrics by spec type.
 */
export interface CoverageByType {
  total: number;
  covered: number;
  orphaned: number;
  missingTest?: number;
}

/**
 * Result of integrity analysis.
 */
export interface IntegrityAnalysisResult {
  /**
   * All discovered specs organized by type.
   */
  inventory: SpecInventory;

  /**
   * All discovered features.
   */
  features: FeatureScanResult[];

  /**
   * Coverage metrics.
   */
  coverage: {
    total: number;
    linkedToFeature: number;
    orphaned: number;
    missingTest: number;
    byType: Record<string, CoverageByType>;
  };

  /**
   * Issues found during analysis.
   */
  issues: IntegrityIssue[];

  /**
   * Specs not linked to any feature.
   */
  orphanedSpecs: SpecLocation[];

  /**
   * Overall health status.
   */
  healthy: boolean;
}

/**
 * Build a spec key from name and version.
 */
function specKey(key: string, version: string): string {
  return `${key}.v${version}`;
}

/**
 * Create an empty spec inventory.
 */
function createEmptyInventory(): SpecInventory {
  return {
    operations: new Map(),
    events: new Map(),
    presentations: new Map(),
    capabilities: new Map(),
    workflows: new Map(),
    dataViews: new Map(),
    forms: new Map(),
    migrations: new Map(),
    experiments: new Map(),
    integrations: new Map(),
    knowledge: new Map(),
    telemetry: new Map(),
    appConfigs: new Map(),
    policies: new Map(),
    testSpecs: new Map(),
  };
}

/**
 * Get the inventory map for a spec type.
 */
function getInventoryMap(
  inventory: SpecInventory,
  specType: AnalyzedSpecType
): Map<string, SpecLocation> | undefined {
  const typeToMap: Record<string, Map<string, SpecLocation>> = {
    operation: inventory.operations,
    event: inventory.events,
    presentation: inventory.presentations,
    capability: inventory.capabilities,
    workflow: inventory.workflows,
    'data-view': inventory.dataViews,
    form: inventory.forms,
    migration: inventory.migrations,
    experiment: inventory.experiments,
    integration: inventory.integrations,
    knowledge: inventory.knowledge,
    telemetry: inventory.telemetry,
    'app-config': inventory.appConfigs,
    policy: inventory.policies,
    'test-spec': inventory.testSpecs,
  };

  return typeToMap[specType];
}

/**
 * Analyze contract integrity.
 */
export async function analyzeIntegrity(
  adapters: { fs: FsAdapter; logger: LoggerAdapter },
  options: IntegrityAnalysisOptions = {}
): Promise<IntegrityAnalysisResult> {
  const { fs, logger } = adapters;

  logger.info('Starting integrity analysis...', { options });

  // Discover all spec and feature files
  const files = await fs.glob({ pattern: options.pattern, cwd: options.cwd });

  const inventory = createEmptyInventory();
  const features: FeatureScanResult[] = [];
  const issues: IntegrityIssue[] = [];

  // Scan all files
  for (const file of files) {
    // Skip directories to avoid EISDIR
    const stats = await fs.stat(file);
    if (stats.isDirectory) continue;

    const content = await fs.readFile(file);

    if (isFeatureFile(file)) {
      // Scan as feature
      const feature = scanFeatureSource(content, file);
      features.push(feature);
    } else {
      // Scan as spec - use the multi-spec scanner to find ALL specs in the file
      const specs = scanAllSpecsFromSource(content, file);

      for (const spec of specs) {
        if (spec.specType !== 'unknown' && spec.specType !== 'feature') {
          const map = getInventoryMap(inventory, spec.specType);

          if (map && spec.key && spec.version !== undefined) {
            const key = specKey(spec.key, spec.version);
            map.set(key, {
              key: spec.key,
              version: spec.version,
              file: spec.filePath,
              type: spec.specType,
              stability: spec.stability,
              // Include testTarget for test-spec files
              testTarget: (spec as TestSpecScanResult).testTarget,
            });
          }
        }
      }
    }
  }

  // Filter features if featureKey is specified
  const relevantFeatures = options.featureKey
    ? features.filter((f) => f.key === options.featureKey)
    : features;

  // Build set of specs referenced by features
  const referencedSpecs = new Set<string>();

  for (const feature of relevantFeatures) {
    // Check operation refs
    for (const ref of feature.operations) {
      const key = specKey(ref.key, ref.version);
      referencedSpecs.add(`operation:${key}`);

      if (!inventory.operations.has(key)) {
        issues.push({
          severity: 'error',
          type: 'unresolved-ref',
          message: `Operation ${ref.key}.v${ref.version} not found`,
          file: feature.filePath,
          featureKey: feature.key,
          specType: 'operation',
          ref,
        });
      }
    }

    // Check event refs
    for (const ref of feature.events) {
      const key = specKey(ref.key, ref.version);
      referencedSpecs.add(`event:${key}`);

      if (!inventory.events.has(key)) {
        issues.push({
          severity: 'error',
          type: 'unresolved-ref',
          message: `Event ${ref.key}.v${ref.version} not found`,
          file: feature.filePath,
          featureKey: feature.key,
          specType: 'event',
          ref,
        });
      }
    }

    // Check presentation refs
    for (const ref of feature.presentations) {
      const key = specKey(ref.key, ref.version);
      referencedSpecs.add(`presentation:${key}`);

      if (!inventory.presentations.has(key)) {
        issues.push({
          severity: 'error',
          type: 'unresolved-ref',
          message: `Presentation ${ref.key}.v${ref.version} not found`,
          file: feature.filePath,
          featureKey: feature.key,
          specType: 'presentation',
          ref,
        });
      }
    }

    // Check experiment refs
    for (const ref of feature.experiments) {
      const key = specKey(ref.key, ref.version);
      referencedSpecs.add(`experiment:${key}`);

      if (!inventory.experiments.has(key)) {
        issues.push({
          severity: 'error',
          type: 'unresolved-ref',
          message: `Experiment ${ref.key}.v${ref.version} not found`,
          file: feature.filePath,
          featureKey: feature.key,
          specType: 'experiment',
          ref,
        });
      }
    }

    // Check capability refs (provides and requires)
    for (const ref of feature.capabilities.provides) {
      const key = specKey(ref.key, ref.version);
      referencedSpecs.add(`capability:${key}`);

      if (!inventory.capabilities.has(key)) {
        issues.push({
          severity: 'warning',
          type: 'unresolved-ref',
          message: `Provided capability ${ref.key}.v${ref.version} not found`,
          file: feature.filePath,
          featureKey: feature.key,
          specType: 'capability',
          ref,
        });
      }
    }

    for (const ref of feature.capabilities.requires) {
      const key = specKey(ref.key, ref.version);
      // Required capabilities are expected to be provided by other features
      // We just track the reference
      referencedSpecs.add(`capability:${key}`);
    }

    // Check op to presentation links
    for (const link of feature.opToPresentationLinks) {
      const opKey = specKey(link.op.key, link.op.version);
      const presKey = specKey(link.pres.key, link.pres.version);

      if (!inventory.operations.has(opKey)) {
        issues.push({
          severity: 'error',
          type: 'broken-link',
          message: `Linked operation ${link.op.key}.v${link.op.version} not found`,
          file: feature.filePath,
          featureKey: feature.key,
          specType: 'operation',
          ref: link.op,
        });
      }

      if (!inventory.presentations.has(presKey)) {
        issues.push({
          severity: 'error',
          type: 'broken-link',
          message: `Linked presentation ${link.pres.key}.v${link.pres.version} not found`,
          file: feature.filePath,
          featureKey: feature.key,
          specType: 'presentation',
          ref: link.pres,
        });
      }
    }
  }

  // Find orphaned specs (not referenced by any feature)
  const orphanedSpecs: SpecLocation[] = [];
  const typesThatCanBeOrphaned: AnalyzedSpecType[] = [
    'operation',
    'event',
    'presentation',
    'experiment',
  ];

  for (const type of typesThatCanBeOrphaned) {
    const map = getInventoryMap(inventory, type);
    if (!map) continue;

    for (const [key, location] of map) {
      if (!referencedSpecs.has(`${type}:${key}`)) {
        orphanedSpecs.push(location);
        issues.push({
          severity: 'warning',
          type: 'orphaned',
          message: `${type} ${location.key}.v${location.version} is not linked to any feature`,
          file: location.file,
          specKey: location.key,
          specType: location.type,
        });
      }
    }
  }

  // Build test-to-target index for contract-first test discovery
  const testSpecScans: TestSpecScanResult[] = [];
  for (const [, location] of inventory.testSpecs) {
    testSpecScans.push({
      filePath: location.file,
      specType: 'test-spec',
      key: location.key,
      version: location.version,
      testTarget: location.testTarget,
      hasMeta: true,
      hasIo: false,
      hasPolicy: false,
      hasPayload: false,
      hasContent: false,
      hasDefinition: false,
    });
  }
  const testIndex = buildTestIndex(testSpecScans, inventory);

  // Calculate coverage metrics
  const coverageByType: Record<string, CoverageByType> = {};
  let totalMissingTests = 0;

  for (const type of typesThatCanBeOrphaned) {
    const map = getInventoryMap(inventory, type);
    if (!map) continue;

    const total = map.size;
    let covered = 0;
    let missingTest = 0;

    const requireTest = options.requireTestsFor?.includes(type);

    for (const [key, location] of map) {
      if (referencedSpecs.has(`${type}:${key}`)) {
        covered++;
      }

      if (requireTest) {
        const targetKey = specKey(location.key, location.version);

        // Primary: Check if any TestSpec targets this spec via TestSpec.target
        const hasTargetedTest = testIndex.targetToTests.has(targetKey);

        // Backwards compatibility: Also check naming convention ({specKey}.test)
        const conventionTestKey = `${location.key}.test`;
        const hasConventionTest = inventory.testSpecs.has(
          specKey(conventionTestKey, location.version)
        );

        if (!hasTargetedTest && !hasConventionTest) {
          missingTest++;
          totalMissingTests++;
          issues.push({
            severity: 'warning',
            type: 'missing-test',
            message: `${type} ${location.key}.v${location.version} is missing a test spec (no TestSpec.target or naming convention match)`,
            file: location.file,
            specKey: location.key,
            specType: location.type,
          });
        }
      }
    }

    coverageByType[type] = {
      total,
      covered,
      orphaned: total - covered,
      missingTest: requireTest ? missingTest : 0,
    };
  }

  const totalSpecs = Object.values(coverageByType).reduce(
    (sum, c) => sum + c.total,
    0
  );
  const coveredSpecs = Object.values(coverageByType).reduce(
    (sum, c) => sum + c.covered,
    0
  );

  const coverage = {
    total: totalSpecs,
    linkedToFeature: coveredSpecs,
    orphaned: totalSpecs - coveredSpecs,
    missingTest: totalMissingTests,
    byType: coverageByType,
  };

  // Determine overall health
  const hasErrors = issues.some((i) => i.severity === 'error');
  const healthy = !hasErrors;

  logger.info('Integrity analysis complete', {
    features: features.length,
    totalSpecs,
    orphaned: orphanedSpecs.length,
    issues: issues.length,
    healthy,
  });

  return {
    inventory,
    features: relevantFeatures,
    coverage,
    issues,
    orphanedSpecs,
    healthy,
  };
}

/**
 * Get all specs from inventory as a flat list.
 */
export function getAllSpecs(inventory: SpecInventory): SpecLocation[] {
  const all: SpecLocation[] = [];

  for (const map of Object.values(inventory)) {
    for (const spec of map.values()) {
      all.push(spec);
    }
  }

  return all;
}

/**
 * Filter issues by type.
 */
export function filterIssuesByType(
  issues: IntegrityIssue[],
  type: IntegrityIssue['type']
): IntegrityIssue[] {
  return issues.filter((i) => i.type === type);
}

/**
 * Filter issues by severity.
 */
export function filterIssuesBySeverity(
  issues: IntegrityIssue[],
  severity: IntegrityIssue['severity']
): IntegrityIssue[] {
  return issues.filter((i) => i.severity === severity);
}
