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
import {
  serializeOperationSpec,
  serializeEventSpec,
  serializePresentationSpec,
  serializeDataViewSpec,
  serializeFormSpec,
} from '@contractspec/lib.contracts/serialization';
import {
  ContractReferenceDataView,
  ContractReferenceQuery,
  DocsGeneratedEvent,
  DocsGenerateCommand,
  DocsIndexDataView,
  DocsIndexQuery,
  DocsLayoutPresentation,
  DocsPublishedEvent,
  DocsPublishCommand,
  DocsReferencePagePresentation,
  DocsSearchForm,
  ExampleCatalogDataView,
} from '@contractspec/lib.contracts/docs';

// Re-export serialization types from lib.contracts for convenience
export type {
  SerializedSchemaModel,
  SerializedFieldConfig,
  SerializedOperationSpec,
  SerializedEventSpec,
  SerializedPresentationSpec,
  SerializedDataViewSpec,
  SerializedFormSpec,
} from '@contractspec/lib.contracts/serialization';

// ============================================================================
// Operation Registry
// ============================================================================

let operationRegistry: OperationSpecRegistry | null = null;

export function createContractSpecOperationRegistry(): OperationSpecRegistry {
  const registry = new OperationSpecRegistry();
  registry
    .register(DocsIndexQuery)
    .register(ContractReferenceQuery)
    .register(DocsGenerateCommand)
    .register(DocsPublishCommand);
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
  registry.register(DocsGeneratedEvent).register(DocsPublishedEvent);
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
  registry
    .register(DocsLayoutPresentation)
    .register(DocsReferencePagePresentation);
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
  registry
    .register(DocsIndexDataView)
    .register(ContractReferenceDataView)
    .register(ExampleCatalogDataView);
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
  registry.register(DocsSearchForm);
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
export function resolveSerializedOperationSpec(key: string, version?: string) {
  const spec = resolveOperationSpec(key, version);
  return serializeOperationSpec(spec) ?? undefined;
}

/**
 * Resolve and serialize an event spec for passing to client components.
 */
export function resolveSerializedEventSpec(key: string, version?: string) {
  const spec = resolveEventSpec(key, version);
  return serializeEventSpec(spec) ?? undefined;
}

/**
 * Resolve and serialize a presentation spec for passing to client components.
 */
export function resolveSerializedPresentationSpec(
  key: string,
  version?: string
) {
  const spec = resolvePresentationSpec(key, version);
  return serializePresentationSpec(spec) ?? undefined;
}

/**
 * Resolve and serialize a data view spec for passing to client components.
 */
export function resolveSerializedDataViewSpec(key: string, version?: string) {
  const spec = resolveDataViewSpec(key, version);
  return serializeDataViewSpec(spec) ?? undefined;
}

/**
 * Resolve and serialize a form spec for passing to client components.
 */
export function resolveSerializedFormSpec(key: string, version?: string) {
  const spec = resolveFormSpec(key, version);
  return serializeFormSpec(spec) ?? undefined;
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
