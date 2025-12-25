/**
 * Contract snapshot generation.
 *
 * Generates canonical, deterministic snapshots from spec source files
 * for comparison and impact detection.
 */

import { scanSpecSource } from '../spec-scan';
import { computeHash, sortSpecs, sortFields } from './normalizer';
import type {
  ContractSnapshot,
  EventSnapshot,
  FieldSnapshot,
  FieldType,
  IoSnapshot,
  OperationSnapshot,
  SnapshotOptions,
  SpecSnapshot,
} from './types';

/**
 * Generate a contract snapshot from spec source files.
 *
 * @param specs - Array of { path, content } for each spec file
 * @param options - Snapshot generation options
 * @returns Canonical contract snapshot
 */
export function generateSnapshot(
  specs: { path: string; content: string }[],
  options: SnapshotOptions = {}
): ContractSnapshot {
  const snapshots: SpecSnapshot[] = [];

  for (const { path, content } of specs) {
    const scanned = scanSpecSource(content, path);

    // Filter by types if specified
    if (
      options.types &&
      !options.types.includes(scanned.specType as 'operation' | 'event')
    ) {
      continue;
    }

    if (
      scanned.specType === 'operation' &&
      scanned.key &&
      scanned.version !== undefined
    ) {
      const opSnapshot = createOperationSnapshot(scanned, content);
      if (opSnapshot) {
        snapshots.push(opSnapshot);
      }
    } else if (
      scanned.specType === 'event' &&
      scanned.key &&
      scanned.version !== undefined
    ) {
      const eventSnapshot = createEventSnapshot(scanned, content);
      if (eventSnapshot) {
        snapshots.push(eventSnapshot);
      }
    }
  }

  const sortedSpecs = sortSpecs(snapshots);
  const hash = computeHash({ specs: sortedSpecs });

  return {
    version: 1,
    generatedAt: new Date().toISOString(),
    specs: sortedSpecs,
    hash,
  };
}

/**
 * Create an operation snapshot from scanned spec data.
 */
function createOperationSnapshot(
  scanned: ReturnType<typeof scanSpecSource>,
  content: string
): OperationSnapshot | null {
  if (!scanned.key || scanned.version === undefined) {
    return null;
  }

  const io = extractIoFromSource(content);
  const http = extractHttpBinding(content);

  return {
    type: 'operation',
    key: scanned.key,
    version: scanned.version,
    kind:
      scanned.kind === 'command' || scanned.kind === 'query'
        ? scanned.kind
        : 'command',
    stability: scanned.stability ?? 'experimental',
    http: http ?? undefined,
    io,
    authLevel: extractAuthLevel(content),
    emittedEvents: scanned.emittedEvents,
  };
}

/**
 * Create an event snapshot from scanned spec data.
 */
function createEventSnapshot(
  scanned: ReturnType<typeof scanSpecSource>,
  content: string
): EventSnapshot | null {
  if (!scanned.key || scanned.version === undefined) {
    return null;
  }

  const payload = extractPayloadFromSource(content);

  return {
    type: 'event',
    key: scanned.key,
    version: scanned.version,
    stability: scanned.stability ?? 'experimental',
    payload,
  };
}

/**
 * Extract IO schema from source code.
 * This is a heuristic extraction - not full Zod introspection.
 */
function extractIoFromSource(content: string): IoSnapshot {
  const input = extractSchemaFields(content, 'input');
  const output = extractSchemaFields(content, 'output');

  return {
    input: sortFields(input) as Record<string, FieldSnapshot>,
    output: sortFields(output) as Record<string, FieldSnapshot>,
  };
}

/**
 * Extract payload schema from event source code.
 */
function extractPayloadFromSource(
  content: string
): Record<string, FieldSnapshot> {
  const fields = extractSchemaFields(content, 'payload');
  return sortFields(fields) as Record<string, FieldSnapshot>;
}

/**
 * Extract schema fields from a specific section of the source.
 */
function extractSchemaFields(
  content: string,
  section: 'input' | 'output' | 'payload'
): Record<string, FieldSnapshot> {
  const fields: Record<string, FieldSnapshot> = {};

  // Look for z.object({ ... }) patterns within the section
  const sectionPattern = new RegExp(
    `${section}\\s*:\\s*z\\.object\\(\\{([^}]+)\\}`,
    's'
  );
  const sectionMatch = content.match(sectionPattern);

  if (!sectionMatch?.[1]) {
    return fields;
  }

  const sectionContent = sectionMatch[1];

  // Match field definitions: fieldName: z.string(), z.number(), etc.
  const fieldPattern = /(\w+)\s*:\s*z\.(\w+)\((.*?)\)/g;
  let match;

  while ((match = fieldPattern.exec(sectionContent)) !== null) {
    const [, fieldName, zodType] = match;
    if (!fieldName || !zodType) continue;

    const isOptional =
      sectionContent.includes(`${fieldName}:`) &&
      sectionContent
        .slice(sectionContent.indexOf(`${fieldName}:`))
        .includes('.optional()');
    const isNullable =
      sectionContent.includes(`${fieldName}:`) &&
      sectionContent
        .slice(sectionContent.indexOf(`${fieldName}:`))
        .includes('.nullable()');

    fields[fieldName] = {
      name: fieldName,
      type: mapZodTypeToFieldType(zodType),
      required: !isOptional,
      nullable: isNullable,
    };
  }

  return fields;
}

/**
 * Map Zod type to FieldType.
 */
function mapZodTypeToFieldType(zodType: string): FieldType {
  const mapping: Record<string, FieldType> = {
    string: 'string',
    number: 'number',
    boolean: 'boolean',
    object: 'object',
    array: 'array',
    enum: 'enum',
    union: 'union',
    literal: 'literal',
    date: 'date',
    coerce: 'unknown',
  };
  return mapping[zodType] ?? 'unknown';
}

/**
 * Extract HTTP binding from source code.
 */
function extractHttpBinding(content: string): {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
} | null {
  // Look for http: { method: 'X', path: 'Y' } pattern
  const methodMatch = content.match(/method\s*:\s*['"](\w+)['"]/);
  const pathMatch = content.match(/path\s*:\s*['"]([^'"]+)['"]/);

  if (methodMatch?.[1] && pathMatch?.[1]) {
    const method = methodMatch[1].toUpperCase();
    if (['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
      return {
        method: method as 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
        path: pathMatch[1],
      };
    }
  }

  return null;
}

/**
 * Extract auth level from source code.
 */
function extractAuthLevel(content: string): string | undefined {
  const authMatch = content.match(/auth\s*:\s*['"](\w+)['"]/);
  return authMatch?.[1];
}
