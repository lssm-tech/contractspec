/**
 * Central contracts registry for ContractSpec.
 *
 * This registry holds all operation, event, presentation, data view, and form specs
 * so they can be resolved by key for the feature discovery system.
 * Unlike the MCP's OperationSpecRegistry (which also binds handlers),
 * this is a spec-only registry for documentation and discovery purposes.
 */

import {
  OperationSpecRegistry,
  type AnyOperationSpec,
  EventRegistry,
  type AnyEventSpec,
  type PresentationSpec,
  type DataViewSpec,
  type FormSpec,
} from '@contractspec/lib.contracts';
import { PresentationRegistry } from '@contractspec/lib.contracts/presentations';
import { DataViewRegistry } from '@contractspec/lib.contracts/data-views';
import { FormRegistry } from '@contractspec/lib.contracts/forms';
import type { AnySchemaModel } from '@contractspec/lib.schema';

// Import all operation specs from features
import { docsSearchSpec } from './docs';

// ============================================================================
// Serialization Types (for Server -> Client Component transfer)
// ============================================================================

/** Serialized schema model that can be passed to client components */
export interface SerializedSchemaModel {
  name: string;
  description?: string | null;
  fields: Record<string, SerializedFieldConfig>;
}

export interface SerializedFieldConfig {
  typeName: string;
  isOptional: boolean;
  isArray?: boolean;
}

/** Serialized operation spec for client components */
export interface SerializedOperationSpec {
  meta: {
    key: string;
    version: string;
    stability?: string;
    owners?: string[];
    tags?: string[];
    description?: string;
    goal?: string;
    context?: string;
  };
  io: {
    input: SerializedSchemaModel | null;
    output: SerializedSchemaModel | null;
  };
  policy?: {
    auth?: string;
  };
}

/** Serialized event spec for client components */
export interface SerializedEventSpec {
  meta: {
    key: string;
    version: string;
    stability?: string;
    owners?: string[];
    tags?: string[];
    description?: string;
  };
  payload: SerializedSchemaModel | null;
}

/** Serialized presentation spec for client components */
export interface SerializedPresentationSpec {
  meta: {
    key: string;
    version: string;
    stability?: string;
    owners?: string[];
    tags?: string[];
    description?: string;
    goal?: string;
    context?: string;
  };
  source: {
    type: string;
    framework?: string;
    componentKey?: string;
  };
  targets?: string[];
}

/** Serialized data view spec for client components */
export interface SerializedDataViewSpec {
  meta: {
    key: string;
    version: string;
    stability?: string;
    owners?: string[];
    tags?: string[];
    description?: string;
    title?: string;
  };
}

/** Serialized form spec for client components */
export interface SerializedFormSpec {
  meta: {
    key: string;
    version?: string;
    stability?: string;
    owners?: string[];
    tags?: string[];
    description?: string;
    title?: string;
  };
}

// ============================================================================
// Serialization Helpers
// ============================================================================

function serializeSchemaModel(
  model: AnySchemaModel | null | undefined
): SerializedSchemaModel | null {
  if (!model) return null;

  // Check if it's a SchemaModel with config
  if ('config' in model && model.config) {
    const config = model.config as {
      name: string;
      description?: string | null;
      fields: Record<string, { type: unknown; isOptional: boolean; isArray?: boolean }>;
    };
    return {
      name: config.name,
      description: config.description,
      fields: Object.fromEntries(
        Object.entries(config.fields).map(([key, field]) => [
          key,
          {
            typeName: getTypeName(field.type),
            isOptional: field.isOptional,
            isArray: field.isArray,
          },
        ])
      ),
    };
  }

  // Fallback for other schema types
  return {
    name: 'unknown',
    fields: {},
  };
}

function getTypeName(type: unknown): string {
  if (!type) return 'unknown';
  if (typeof type === 'string') return type;
  if (typeof type === 'object') {
    // Check for SchemaModel
    if ('config' in type && (type as { config?: { name?: string } }).config?.name) {
      return (type as { config: { name: string } }).config.name;
    }
    // Check for FieldType or EnumType with name
    if ('name' in type && typeof (type as { name: unknown }).name === 'string') {
      return (type as { name: string }).name;
    }
  }
  return 'unknown';
}

// ============================================================================
// Operation Registry
// ============================================================================

let operationRegistry: OperationSpecRegistry | null = null;

export function createContractSpecOperationRegistry(): OperationSpecRegistry {
  const registry = new OperationSpecRegistry();
  registry.register(docsSearchSpec);
  // TODO: Register additional operation specs as they are extracted
  return registry;
}

export function getContractSpecOperationRegistry(): OperationSpecRegistry {
  if (!operationRegistry) {
    operationRegistry = createContractSpecOperationRegistry();
  }
  return operationRegistry;
}

export function resolveOperationSpec(
  key: string,
  version?: string
): AnyOperationSpec | undefined {
  return getContractSpecOperationRegistry().get(key, version);
}

// ============================================================================
// Event Registry
// ============================================================================

let eventRegistry: EventRegistry | null = null;

export function createContractSpecEventRegistry(): EventRegistry {
  const registry = new EventRegistry();
  // TODO: Register event specs as they are extracted to module level
  // registry.register(someEventSpec);
  return registry;
}

export function getContractSpecEventRegistry(): EventRegistry {
  if (!eventRegistry) {
    eventRegistry = createContractSpecEventRegistry();
  }
  return eventRegistry;
}

export function resolveEventSpec(
  key: string,
  version?: string
): AnyEventSpec | undefined {
  return getContractSpecEventRegistry().get(key, version);
}

// ============================================================================
// Presentation Registry
// ============================================================================

let presentationRegistry: PresentationRegistry | null = null;

export function createContractSpecPresentationRegistry(): PresentationRegistry {
  const registry = new PresentationRegistry();
  // TODO: Register presentation specs as they are extracted to module level
  // registry.register(somePresentationSpec);
  return registry;
}

export function getContractSpecPresentationRegistry(): PresentationRegistry {
  if (!presentationRegistry) {
    presentationRegistry = createContractSpecPresentationRegistry();
  }
  return presentationRegistry;
}

export function resolvePresentationSpec(
  key: string,
  version?: string
): PresentationSpec | undefined {
  return getContractSpecPresentationRegistry().get(key, version);
}

// ============================================================================
// DataView Registry
// ============================================================================

let dataViewRegistry: DataViewRegistry | null = null;

export function createContractSpecDataViewRegistry(): DataViewRegistry {
  const registry = new DataViewRegistry();
  // TODO: Register data view specs as they are extracted to module level
  // registry.register(someDataViewSpec);
  return registry;
}

export function getContractSpecDataViewRegistry(): DataViewRegistry {
  if (!dataViewRegistry) {
    dataViewRegistry = createContractSpecDataViewRegistry();
  }
  return dataViewRegistry;
}

export function resolveDataViewSpec(
  key: string,
  version?: string
): DataViewSpec | undefined {
  return getContractSpecDataViewRegistry().get(key, version);
}

// ============================================================================
// Form Registry
// ============================================================================

let formRegistry: FormRegistry | null = null;

export function createContractSpecFormRegistry(): FormRegistry {
  const registry = new FormRegistry();
  // TODO: Register form specs as they are extracted to module level
  // registry.register(someFormSpec);
  return registry;
}

export function getContractSpecFormRegistry(): FormRegistry {
  if (!formRegistry) {
    formRegistry = createContractSpecFormRegistry();
  }
  return formRegistry;
}

export function resolveFormSpec(
  key: string,
  _version?: string
): FormSpec | undefined {
  return getContractSpecFormRegistry().get(key);
}

// ============================================================================
// Serialized Spec Resolution (for Server -> Client Component transfer)
// ============================================================================

/**
 * Resolve and serialize an operation spec for passing to client components.
 * Returns a plain JSON-serializable object.
 */
export function resolveSerializedOperationSpec(
  key: string,
  version?: string
): SerializedOperationSpec | undefined {
  const spec = resolveOperationSpec(key, version);
  if (!spec) return undefined;

  return {
    meta: {
      key: spec.meta.key,
      version: spec.meta.version,
      stability: spec.meta.stability,
      owners: spec.meta.owners,
      tags: spec.meta.tags,
      description: spec.meta.description,
      goal: spec.meta.goal,
      context: spec.meta.context,
    },
    io: {
      input: serializeSchemaModel(spec.io.input),
      output: serializeSchemaModel(spec.io.output),
    },
    policy: spec.policy ? { auth: spec.policy.auth } : undefined,
  };
}

/**
 * Resolve and serialize an event spec for passing to client components.
 */
export function resolveSerializedEventSpec(
  key: string,
  version?: string
): SerializedEventSpec | undefined {
  const spec = resolveEventSpec(key, version);
  if (!spec) return undefined;

  return {
    meta: {
      key: spec.meta.key,
      version: spec.meta.version,
      stability: spec.meta.stability,
      owners: spec.meta.owners,
      tags: spec.meta.tags,
      description: spec.meta.description,
    },
    payload: serializeSchemaModel(spec.payload),
  };
}

/**
 * Resolve and serialize a presentation spec for passing to client components.
 */
export function resolveSerializedPresentationSpec(
  key: string,
  version?: string
): SerializedPresentationSpec | undefined {
  const spec = resolvePresentationSpec(key, version);
  if (!spec) return undefined;

  return {
    meta: {
      key: spec.meta.key,
      version: spec.meta.version,
      stability: spec.meta.stability,
      owners: spec.meta.owners,
      tags: spec.meta.tags,
      description: spec.meta.description,
      goal: spec.meta.goal,
      context: spec.meta.context,
    },
    source: {
      type: spec.source.type,
      framework: spec.source.type === 'component' ? spec.source.framework : undefined,
      componentKey: spec.source.type === 'component' ? spec.source.componentKey : undefined,
    },
    targets: spec.targets,
  };
}

/**
 * Resolve and serialize a data view spec for passing to client components.
 */
export function resolveSerializedDataViewSpec(
  key: string,
  version?: string
): SerializedDataViewSpec | undefined {
  const spec = resolveDataViewSpec(key, version);
  if (!spec) return undefined;

  return {
    meta: {
      key: spec.meta.key,
      version: spec.meta.version,
      stability: spec.meta.stability,
      owners: spec.meta.owners,
      tags: spec.meta.tags,
      description: spec.meta.description,
      title: spec.meta.title,
    },
  };
}

/**
 * Resolve and serialize a form spec for passing to client components.
 */
export function resolveSerializedFormSpec(
  key: string,
  version?: string
): SerializedFormSpec | undefined {
  const spec = resolveFormSpec(key, version);
  if (!spec) return undefined;

  return {
    meta: {
      key: spec.meta.key,
      version: spec.meta.version,
      stability: spec.meta.stability,
      owners: spec.meta.owners,
      tags: spec.meta.tags,
      description: spec.meta.description,
      title: spec.meta.title,
    },
  };
}

// ============================================================================
// Reset all registries (for testing)
// ============================================================================

export function resetContractSpecOperationRegistry(): void {
  operationRegistry = null;
}

export function resetContractSpecEventRegistry(): void {
  eventRegistry = null;
}

export function resetContractSpecPresentationRegistry(): void {
  presentationRegistry = null;
}

export function resetContractSpecDataViewRegistry(): void {
  dataViewRegistry = null;
}

export function resetContractSpecFormRegistry(): void {
  formRegistry = null;
}

export function resetAllContractSpecRegistries(): void {
  resetContractSpecOperationRegistry();
  resetContractSpecEventRegistry();
  resetContractSpecPresentationRegistry();
  resetContractSpecDataViewRegistry();
  resetContractSpecFormRegistry();
}
