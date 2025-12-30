/**
 * Diff ContractSpec specs against OpenAPI operations.
 * Used for sync operations to detect changes.
 */

import type { AnyOperationSpec } from '@contractspec/lib.contracts';
import type { ParsedOperation } from './types';
import type {
  DiffChange,
  DiffChangeType,
  ImportedOperationSpec,
  SpecDiff,
} from '../common/types';
import { deepEqual } from '../common/utils';

/**
 * Options for diffing specs.
 */
export interface DiffOptions {
  /** Ignore description changes */
  ignoreDescriptions?: boolean;
  /** Ignore tag changes */
  ignoreTags?: boolean;
  /** Ignore transport changes (path, method) */
  ignoreTransport?: boolean;
  /** Custom paths to ignore */
  ignorePaths?: string[];
}

/**
 * Compare two values and generate a diff change if different.
 */
function compareValues(
  path: string,
  oldValue: unknown,
  newValue: unknown,
  description: string
): DiffChange | null {
  if (deepEqual(oldValue, newValue)) {
    return null;
  }

  let changeType: DiffChangeType = 'modified';
  if (oldValue === undefined || oldValue === null) {
    changeType = 'added';
  } else if (newValue === undefined || newValue === null) {
    changeType = 'removed';
  } else if (typeof oldValue !== typeof newValue) {
    changeType = 'type_changed';
  }

  return {
    path,
    type: changeType,
    oldValue,
    newValue,
    description,
  };
}

/**
 * Diff two objects recursively.
 */
function diffObjects(
  path: string,
  oldObj: Record<string, unknown> | undefined,
  newObj: Record<string, unknown> | undefined,
  options: DiffOptions
): DiffChange[] {
  const changes: DiffChange[] = [];

  if (!oldObj && !newObj) return changes;
  if (!oldObj) {
    changes.push({
      path,
      type: 'added',
      newValue: newObj,
      description: `Added ${path}`,
    });
    return changes;
  }
  if (!newObj) {
    changes.push({
      path,
      type: 'removed',
      oldValue: oldObj,
      description: `Removed ${path}`,
    });
    return changes;
  }

  const allKeys = new Set([...Object.keys(oldObj), ...Object.keys(newObj)]);

  for (const key of allKeys) {
    const keyPath = path ? `${path}.${key}` : key;

    // Skip ignored paths
    if (options.ignorePaths?.some((p) => keyPath.startsWith(p))) {
      continue;
    }

    const oldVal = oldObj[key];
    const newVal = newObj[key];

    if (typeof oldVal === 'object' && typeof newVal === 'object') {
      changes.push(
        ...diffObjects(
          keyPath,
          oldVal as Record<string, unknown>,
          newVal as Record<string, unknown>,
          options
        )
      );
    } else {
      const change = compareValues(
        keyPath,
        oldVal,
        newVal,
        `Changed ${keyPath}`
      );
      if (change) {
        changes.push(change);
      }
    }
  }

  return changes;
}

/**
 * Diff a ContractSpec against an OpenAPI operation.
 */
export function diffSpecVsOperation(
  spec: AnyOperationSpec,
  operation: ParsedOperation,
  options: DiffOptions = {}
): DiffChange[] {
  const changes: DiffChange[] = [];

  // Compare basic metadata
  if (!options.ignoreDescriptions) {
    const descChange = compareValues(
      'meta.description',
      spec.meta.description,
      operation.summary ?? operation.description,
      'Description changed'
    );
    if (descChange) changes.push(descChange);
  }

  if (!options.ignoreTags) {
    const oldTags = [...(spec.meta.tags ?? [])].sort();
    const newTags = [...operation.tags].sort();
    if (!deepEqual(oldTags, newTags)) {
      changes.push({
        path: 'meta.tags',
        type: 'modified',
        oldValue: oldTags,
        newValue: newTags,
        description: 'Tags changed',
      });
    }
  }

  // Compare transport
  if (!options.ignoreTransport) {
    const specMethod =
      spec.transport?.rest?.method ??
      (spec.meta.kind === 'query' ? 'GET' : 'POST');
    const opMethod = operation.method.toUpperCase();

    if (specMethod !== opMethod) {
      changes.push({
        path: 'transport.rest.method',
        type: 'modified',
        oldValue: specMethod,
        newValue: opMethod,
        description: 'HTTP method changed',
      });
    }

    const specPath = spec.transport?.rest?.path;
    if (specPath && specPath !== operation.path) {
      changes.push({
        path: 'transport.rest.path',
        type: 'modified',
        oldValue: specPath,
        newValue: operation.path,
        description: 'Path changed',
      });
    }
  }

  // Compare deprecation status
  const specDeprecated = spec.meta.stability === 'deprecated';
  if (specDeprecated !== operation.deprecated) {
    changes.push({
      path: 'meta.stability',
      type: 'modified',
      oldValue: spec.meta.stability,
      newValue: operation.deprecated ? 'deprecated' : 'stable',
      description: 'Deprecation status changed',
    });
  }

  return changes;
}

/**
 * Diff two ContractSpecs.
 */
export function diffSpecs(
  oldSpec: AnyOperationSpec,
  newSpec: AnyOperationSpec,
  options: DiffOptions = {}
): DiffChange[] {
  const changes: DiffChange[] = [];

  // Compare meta
  const metaChanges = diffObjects(
    'meta',
    oldSpec.meta as unknown as Record<string, unknown>,
    newSpec.meta as unknown as Record<string, unknown>,
    {
      ...options,
      ignorePaths: [
        ...(options.ignorePaths ?? []),
        ...(options.ignoreDescriptions
          ? ['meta.description', 'meta.goal', 'meta.context']
          : []),
        ...(options.ignoreTags ? ['meta.tags'] : []),
      ],
    }
  );
  changes.push(...metaChanges);

  // Compare transport
  if (!options.ignoreTransport) {
    const transportChanges = diffObjects(
      'transport',
      oldSpec.transport as unknown as Record<string, unknown>,
      newSpec.transport as unknown as Record<string, unknown>,
      options
    );
    changes.push(...transportChanges);
  }

  // Compare policy
  const policyChanges = diffObjects(
    'policy',
    oldSpec.policy as unknown as Record<string, unknown>,
    newSpec.policy as unknown as Record<string, unknown>,
    options
  );
  changes.push(...policyChanges);

  return changes;
}

/**
 * Create a SpecDiff from an existing spec and an imported spec.
 */
export function createSpecDiff(
  operationId: string,
  existing: AnyOperationSpec | undefined,
  incoming: ImportedOperationSpec,
  options: DiffOptions = {}
): SpecDiff {
  let changes: DiffChange[] = [];
  let isEquivalent = false;

  if (existing && incoming.operationSpec) {
    // Compare existing vs incoming
    changes = diffSpecs(existing, incoming.operationSpec, options);
    isEquivalent = changes.length === 0;
  } else if (existing && !incoming.operationSpec) {
    // Incoming has code but no runtime spec - can't compare directly
    changes = [
      {
        path: '',
        type: 'modified',
        oldValue: existing,
        newValue: incoming.code,
        description:
          'Spec code imported from OpenAPI (runtime comparison not available)',
      },
    ];
  } else {
    // New spec - mark as added
    changes = [
      {
        path: '',
        type: 'added',
        newValue: incoming.operationSpec ?? incoming.code,
        description: 'New spec imported from OpenAPI',
      },
    ];
  }

  return {
    operationId,
    existing,
    incoming,
    changes,
    isEquivalent,
  };
}

/**
 * Batch diff multiple specs against OpenAPI operations.
 */
export function diffAll(
  existingSpecs: Map<string, AnyOperationSpec>,
  importedSpecs: ImportedOperationSpec[],
  options: DiffOptions = {}
): SpecDiff[] {
  const diffs: SpecDiff[] = [];

  // Track which existing specs have been matched
  const matchedExisting = new Set<string>();

  for (const imported of importedSpecs) {
    const operationId = imported.source.sourceId;

    // Try to find matching existing spec
    // Match by operationId in x-contractspec extension or by name
    let existing: AnyOperationSpec | undefined;

    for (const [key, spec] of existingSpecs) {
      // Check x-contractspec match or name match
      const specName = spec.meta.key;
      if (key === operationId || specName.includes(operationId)) {
        existing = spec;
        matchedExisting.add(key);
        break;
      }
    }

    diffs.push(createSpecDiff(operationId, existing, imported, options));
  }

  // Add diffs for existing specs that weren't matched (removed from OpenAPI)
  for (const [key, spec] of existingSpecs) {
    if (!matchedExisting.has(key)) {
      diffs.push({
        operationId: key,
        existing: spec,
        incoming: undefined as unknown as ImportedOperationSpec,
        changes: [
          {
            path: '',
            type: 'removed',
            oldValue: spec,
            description: 'Spec no longer exists in OpenAPI source',
          },
        ],
        isEquivalent: false,
      });
    }
  }

  return diffs;
}

/**
 * Format diff changes for display.
 */
export function formatDiffChanges(changes: DiffChange[]): string {
  if (changes.length === 0) {
    return 'No changes detected';
  }

  const lines: string[] = [];

  for (const change of changes) {
    const prefix = {
      added: '+',
      removed: '-',
      modified: '~',
      type_changed: '!',
      required_changed: '?',
    }[change.type];

    lines.push(`${prefix} ${change.path}: ${change.description}`);

    if (change.type === 'modified' || change.type === 'type_changed') {
      lines.push(`    old: ${JSON.stringify(change.oldValue)}`);
      lines.push(`    new: ${JSON.stringify(change.newValue)}`);
    } else if (change.type === 'added') {
      lines.push(`    value: ${JSON.stringify(change.newValue)}`);
    } else if (change.type === 'removed') {
      lines.push(`    was: ${JSON.stringify(change.oldValue)}`);
    }
  }

  return lines.join('\n');
}
