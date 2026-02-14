/**
 * Canonical contract snapshot types.
 *
 * These types define the normalized, deterministic representation
 * of contracts for comparison and impact detection.
 */

import type { EventRef } from '@contractspec/lib.contracts-spec';

/** Field type in a schema */
export type FieldType =
  | 'string'
  | 'number'
  | 'boolean'
  | 'object'
  | 'array'
  | 'enum'
  | 'union'
  | 'literal'
  | 'date'
  | 'unknown';

/** Schema field definition */
export interface FieldSnapshot {
  name: string;
  type: FieldType;
  required: boolean;
  nullable: boolean;
  description?: string;
  enumValues?: string[];
  literalValue?: unknown;
  items?: FieldSnapshot; // For arrays
  properties?: Record<string, FieldSnapshot>; // For objects
  unionTypes?: FieldSnapshot[]; // For unions
}

/** IO schema snapshot */
export interface IoSnapshot {
  input: Record<string, FieldSnapshot>;
  output: Record<string, FieldSnapshot>;
}

/** HTTP binding snapshot */
export interface HttpBindingSnapshot {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
}

/** Operation snapshot */
export interface OperationSnapshot {
  type: 'operation';
  key: string;
  version: string;
  kind: 'command' | 'query';
  stability: string;
  http?: HttpBindingSnapshot;
  io: IoSnapshot;
  authLevel?: string;
  emittedEvents?: EventRef[];
}

/** Event payload snapshot */
export interface EventSnapshot {
  type: 'event';
  key: string;
  version: string;
  stability: string;
  payload: Record<string, FieldSnapshot>;
}

/** Spec snapshot union type */
export type SpecSnapshot = OperationSnapshot | EventSnapshot;

/** Full contract snapshot for a workspace */
export interface ContractSnapshot {
  /** Schema version for forward compatibility */
  version: '1.0.0';
  /** Generation timestamp (ISO 8601) */
  generatedAt: string;
  /** Git commit SHA if available */
  commitSha?: string;
  /** All specs in the workspace */
  specs: SpecSnapshot[];
  /** Content hash for quick comparison */
  hash: string;
}

/** Options for snapshot generation */
export interface SnapshotOptions {
  /** Glob pattern for spec discovery */
  pattern?: string;
  /** Include only specific spec types */
  types?: ('operation' | 'event')[];
}
