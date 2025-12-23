/**
 * SARIF output formatter.
 *
 * Formats CI check results as SARIF (Static Analysis Results Interchange Format)
 * for integration with GitHub Code Scanning and other security tools.
 *
 * SARIF Specification: https://docs.oasis-open.org/sarif/sarif/v2.1.0/sarif-v2.1.0.html
 */

import type {
  CICheckResult,
  CIIssue,
  CIIssueSeverity,
} from '../services/ci-check/types';

/**
 * SARIF v2.1.0 output structure.
 */
export interface SarifOutput {
  $schema: string;
  version: string;
  runs: SarifRun[];
}

interface SarifRun {
  tool: {
    driver: {
      name: string;
      version: string;
      informationUri: string;
      rules: SarifRule[];
    };
  };
  results: SarifResult[];
  invocations: SarifInvocation[];
  versionControlProvenance?: SarifVersionControl[];
}

interface SarifRule {
  id: string;
  name: string;
  shortDescription: { text: string };
  fullDescription?: { text: string };
  defaultConfiguration: {
    level: 'error' | 'warning' | 'note' | 'none';
  };
  helpUri?: string;
}

interface SarifResult {
  ruleId: string;
  ruleIndex: number;
  level: 'error' | 'warning' | 'note' | 'none';
  message: { text: string };
  locations?: SarifLocation[];
  partialFingerprints?: Record<string, string>;
}

interface SarifLocation {
  physicalLocation: {
    artifactLocation: {
      uri: string;
      uriBaseId?: string;
    };
    region?: {
      startLine?: number;
      startColumn?: number;
      endLine?: number;
      endColumn?: number;
    };
  };
}

interface SarifInvocation {
  executionSuccessful: boolean;
  endTimeUtc: string;
  workingDirectory?: { uri: string };
}

interface SarifVersionControl {
  repositoryUri?: string;
  revisionId?: string;
  branch?: string;
}

/**
 * Options for SARIF formatting.
 */
export interface SarifFormatOptions {
  /** Tool name. */
  toolName?: string;
  /** Tool version. */
  toolVersion?: string;
  /** Tool information URI. */
  toolUri?: string;
  /** Repository URI for version control provenance. */
  repositoryUri?: string;
  /** Working directory. */
  workingDirectory?: string;
}

/**
 * Map of rule IDs to their metadata.
 */
const RULE_METADATA: Record<
  string,
  { name: string; description: string; helpUri?: string }
> = {
  'spec-structure-error': {
    name: 'Spec Structure Error',
    description:
      'Contract specification is missing required structure elements',
  },
  'spec-structure-warning': {
    name: 'Spec Structure Warning',
    description: 'Contract specification has recommended but missing elements',
  },
  'integrity-orphaned': {
    name: 'Orphaned Spec',
    description: 'Contract specification is not linked to any feature',
  },
  'integrity-unresolved-ref': {
    name: 'Unresolved Reference',
    description: 'Contract specification references a non-existent spec',
  },
  'integrity-missing-feature': {
    name: 'Missing Feature',
    description: 'Feature referenced by spec does not exist',
  },
  'integrity-broken-link': {
    name: 'Broken Link',
    description: 'Link between specs is broken',
  },
  'deps-circular': {
    name: 'Circular Dependency',
    description: 'Circular dependency detected between contracts',
  },
  'deps-missing': {
    name: 'Missing Dependency',
    description: 'Contract depends on a non-existent contract',
  },
  'handler-missing': {
    name: 'Missing Handler',
    description: 'Handler implementation file does not exist for this contract',
  },
  'handler-warning': {
    name: 'Handler Warning',
    description: 'Handler implementation has potential issues',
  },
  'test-missing': {
    name: 'Missing Test',
    description: 'Test file does not exist for this contract',
  },
  'test-warning': {
    name: 'Test Warning',
    description: 'Test implementation has potential issues',
  },
};

/**
 * Format CI check results as SARIF.
 */
export function formatAsSarif(
  result: CICheckResult,
  options: SarifFormatOptions = {}
): SarifOutput {
  const {
    toolName = 'ContractSpec',
    toolVersion = '1.0.0',
    toolUri = 'https://contractspec.dev',
    repositoryUri,
    workingDirectory,
  } = options;

  // Collect unique rules from issues (only from issues with files)
  const ruleMap = new Map<string, SarifRule>();
  const ruleIndexMap = new Map<string, number>();

  // Only collect rules from issues that have files (these are the ones that will be in results)
  const issuesWithFiles = result.issues.filter((issue) => issue.file);

  for (const issue of issuesWithFiles) {
    if (!ruleMap.has(issue.ruleId)) {
      const metadata = RULE_METADATA[issue.ruleId] ?? {
        name: issue.ruleId,
        description: `Rule: ${issue.ruleId}`,
      };

      const rule: SarifRule = {
        id: issue.ruleId,
        name: metadata.name,
        shortDescription: { text: metadata.description },
        defaultConfiguration: {
          level: mapSeverityToLevel(issue.severity),
        },
      };

      if (metadata.helpUri) {
        rule.helpUri = metadata.helpUri;
      }

      ruleIndexMap.set(issue.ruleId, ruleMap.size);
      ruleMap.set(issue.ruleId, rule);
    }
  }

  // Convert issues to SARIF results (only issues with file locations)
  // GitHub Code Scanning requires every result to have at least one location
  const results: SarifResult[] = issuesWithFiles.map((issue) => {
      const sarifResult: SarifResult = {
        ruleId: issue.ruleId,
        ruleIndex: ruleIndexMap.get(issue.ruleId) ?? 0,
        level: mapSeverityToLevel(issue.severity),
        message: { text: issue.message },
      };

      // issue.file is guaranteed to be defined due to the filter above
      const location: SarifLocation = {
        physicalLocation: {
          artifactLocation: {
            uri: normalizeUri(issue.file!),
            uriBaseId: '%SRCROOT%',
          },
        },
      };

      if (issue.line !== undefined) {
        location.physicalLocation.region = {
          startLine: issue.line,
          startColumn: issue.column ?? 1,
          endLine: issue.endLine ?? issue.line,
          endColumn: issue.endColumn,
        };
      }

      sarifResult.locations = [location];

      // Add fingerprint for deduplication
      sarifResult.partialFingerprints = {
        primaryLocationLineHash: createFingerprint(issue),
      };

      return sarifResult;
    });

  // Build version control provenance (only if repositoryUri is provided, as it's required by SARIF schema)
  const versionControlProvenance: SarifVersionControl[] = [];
  if (repositoryUri) {
    versionControlProvenance.push({
      repositoryUri,
      revisionId: result.commitSha,
      branch: result.branch,
    });
  }

  const run: SarifRun = {
    tool: {
      driver: {
        name: toolName,
        version: toolVersion,
        informationUri: toolUri,
        rules: Array.from(ruleMap.values()),
      },
    },
    results,
    invocations: [
      {
        executionSuccessful: result.success,
        endTimeUtc: result.timestamp,
        ...(workingDirectory && {
          workingDirectory: { uri: workingDirectory },
        }),
      },
    ],
  };

  if (versionControlProvenance.length > 0) {
    run.versionControlProvenance = versionControlProvenance;
  }

  return {
    $schema: 'https://json.schemastore.org/sarif-2.1.0.json',
    version: '2.1.0',
    runs: [run],
  };
}

/**
 * Map CI severity to SARIF level.
 */
function mapSeverityToLevel(
  severity: CIIssueSeverity
): 'error' | 'warning' | 'note' {
  switch (severity) {
    case 'error':
      return 'error';
    case 'warning':
      return 'warning';
    case 'note':
      return 'note';
    default:
      return 'warning';
  }
}

/**
 * Normalize file path to SARIF URI format.
 */
function normalizeUri(filePath: string): string {
  // Remove leading ./ and normalize path separators
  return filePath.replace(/^\.\//, '').replace(/\\/g, '/');
}

/**
 * Create a fingerprint for issue deduplication.
 */
function createFingerprint(issue: CIIssue): string {
  const parts = [issue.ruleId, issue.file ?? '', issue.message];
  return Buffer.from(parts.join('|')).toString('base64').slice(0, 16);
}

/**
 * Serialize SARIF output to JSON string.
 */
export function sarifToJson(sarif: SarifOutput): string {
  return JSON.stringify(sarif, null, 2);
}
