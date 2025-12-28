/**
 * Export ContractSpec specs to OpenAPI 3.1 format.
 * Refactored to use modular exporters for all surfaces.
 */
import type {
  OperationSpecRegistry,
  FeatureRegistry,
  PresentationRegistry,
  FormRegistry,
  DataViewRegistry,
  WorkflowRegistry,
  EventSpec,
  PresentationSpec,
} from '@contractspec/lib.contracts';
import type { AnySchemaModel } from '@contractspec/lib.schema';
import type {
  ContractSpecOpenApiDocument,
  OpenApiExportOptions,
  OpenApiServer,
  ContractSpecExportOptions,
  ContractSpecExportResult,
} from './types';
import {
  exportOperations,
  generateOperationsRegistry,
  defaultRestPath as defaultRestPathFn,
} from './exporter/operations';
import { exportEvents, generateEventsExports } from './exporter/events';
import { exportFeatures, generateFeaturesRegistry } from './exporter/features';
import {
  exportPresentations,
  generatePresentationsRegistry,
} from './exporter/presentations';
import { exportForms, generateFormsRegistry } from './exporter/forms';
import {
  exportDataViews,
  generateDataViewsRegistry,
} from './exporter/data-views';
import {
  exportWorkflows,
  generateWorkflowsRegistry,
} from './exporter/workflows';
import { generateRegistryIndex } from './exporter/registries';

/**
 * Input registries for unified export.
 */
export interface ContractSpecRegistries {
  operations?: OperationSpecRegistry;
  events?: EventSpec<AnySchemaModel>[];
  features?: FeatureRegistry;
  presentations?: PresentationRegistry;
  presentationsArray?: PresentationSpec[];
  forms?: FormRegistry;
  dataViews?: DataViewRegistry;
  workflows?: WorkflowRegistry;
}

// Re-export for backwards compatibility
export { defaultRestPathFn as defaultRestPath };

/**
 * Export a OperationSpecRegistry to an OpenAPI 3.1 document.
 * @deprecated Use exportContractSpec for full surface support.
 */
export function openApiForRegistry(
  registry: OperationSpecRegistry,
  options: OpenApiExportOptions = {}
): ContractSpecOpenApiDocument {
  const { paths, schemas } = exportOperations(registry);

  return {
    openapi: '3.1.0',
    info: {
      title: options.title ?? 'ContractSpec API',
      version: options.version ?? '0.0.0',
      ...(options.description ? { description: options.description } : {}),
    },
    ...(options.servers ? { servers: options.servers } : {}),
    paths,
    components: { schemas },
  };
}

/**
 * Export all ContractSpec surfaces to OpenAPI document with extensions.
 */
export function exportContractSpec(
  registries: ContractSpecRegistries,
  options: ContractSpecExportOptions = {}
): ContractSpecExportResult {
  const {
    operations: includeOps = true,
    events: includeEvents = true,
    features: includeFeatures = true,
    presentations: includePresentations = true,
    forms: includeForms = true,
    dataViews: includeDataViews = true,
    workflows: includeWorkflows = true,
    generateRegistries = true,
  } = options;

  // Build OpenAPI document
  let paths: Record<string, Record<string, unknown>> = {};
  let schemas: Record<string, Record<string, unknown>> = {};

  // Export operations
  if (includeOps && registries.operations) {
    const opResult = exportOperations(registries.operations);
    paths = opResult.paths;
    schemas = opResult.schemas;
  }

  const doc: ContractSpecOpenApiDocument = {
    openapi: '3.1.0',
    info: {
      title: options.title ?? 'ContractSpec API',
      version: options.version ?? '0.0.0',
      ...(options.description ? { description: options.description } : {}),
    },
    ...(options.servers ? { servers: options.servers } : {}),
    paths,
    components: { schemas },
  };

  // Add extensions for other surfaces
  if (includeEvents && registries.events?.length) {
    doc['x-contractspec-events'] = exportEvents(registries.events);
  }

  if (includeFeatures && registries.features) {
    doc['x-contractspec-features'] = exportFeatures(registries.features);
  }

  if (includePresentations && registries.presentations) {
    doc['x-contractspec-presentations'] = exportPresentations(
      registries.presentations
    );
  }

  if (includeForms && registries.forms) {
    doc['x-contractspec-forms'] = exportForms(registries.forms);
  }

  if (includeDataViews && registries.dataViews) {
    doc['x-contractspec-dataviews'] = exportDataViews(registries.dataViews);
  }

  if (includeWorkflows && registries.workflows) {
    doc['x-contractspec-workflows'] = exportWorkflows(registries.workflows);
  }

  const result: ContractSpecExportResult = {
    openApi: doc,
  };

  // Generate registry code if requested
  if (generateRegistries) {
    result.registries = {};

    if (includeOps && registries.operations) {
      result.registries.operations = generateOperationsRegistry(
        registries.operations
      );
    }

    if (includeEvents && registries.events?.length) {
      result.registries.events = generateEventsExports(registries.events);
    }

    if (includeFeatures && registries.features) {
      result.registries.features = generateFeaturesRegistry(
        registries.features
      );
    }

    if (includePresentations && registries.presentations) {
      result.registries.presentations = generatePresentationsRegistry(
        registries.presentations
      );
    }

    if (includeForms && registries.forms) {
      result.registries.forms = generateFormsRegistry(registries.forms);
    }

    if (includeDataViews && registries.dataViews) {
      result.registries.dataViews = generateDataViewsRegistry(
        registries.dataViews
      );
    }

    if (includeWorkflows && registries.workflows) {
      result.registries.workflows = generateWorkflowsRegistry(
        registries.workflows
      );
    }

    // Generate index file
    result.registries.index = generateRegistryIndex({
      operations: includeOps && !!registries.operations,
      events: includeEvents && !!registries.events?.length,
      features: includeFeatures && !!registries.features,
      presentations: includePresentations && !!registries.presentations,
      forms: includeForms && !!registries.forms,
      dataViews: includeDataViews && !!registries.dataViews,
      workflows: includeWorkflows && !!registries.workflows,
    });
  }

  return result;
}

/**
 * Export a OperationSpecRegistry to OpenAPI JSON string.
 */
export function openApiToJson(
  registry: OperationSpecRegistry,
  options: OpenApiExportOptions = {}
): string {
  const doc = openApiForRegistry(registry, options);
  return JSON.stringify(doc, null, 2);
}

/**
 * Export a OperationSpecRegistry to OpenAPI YAML string.
 */
export function openApiToYaml(
  registry: OperationSpecRegistry,
  options: OpenApiExportOptions = {}
): string {
  const doc = openApiForRegistry(registry, options);
  return jsonToYaml(doc);
}

/**
 * Export ContractSpec to JSON string (all surfaces).
 */
export function contractSpecToJson(
  registries: ContractSpecRegistries,
  options: ContractSpecExportOptions = {}
): string {
  const result = exportContractSpec(registries, options);
  return JSON.stringify(result.openApi, null, 2);
}

/**
 * Export ContractSpec to YAML string (all surfaces).
 */
export function contractSpecToYaml(
  registries: ContractSpecRegistries,
  options: ContractSpecExportOptions = {}
): string {
  const result = exportContractSpec(registries, options);
  return jsonToYaml(result.openApi);
}

/**
 * Simple JSON to YAML conversion.
 */
function jsonToYaml(obj: unknown, indent = 0): string {
  const spaces = '  '.repeat(indent);
  let yaml = '';

  if (Array.isArray(obj)) {
    for (const item of obj) {
      if (typeof item === 'object' && item !== null) {
        yaml += `${spaces}-\n${jsonToYaml(item, indent + 1)}`;
      } else {
        yaml += `${spaces}- ${JSON.stringify(item)}\n`;
      }
    }
  } else if (typeof obj === 'object' && obj !== null) {
    for (const [key, value] of Object.entries(obj)) {
      if (Array.isArray(value)) {
        yaml += `${spaces}${key}:\n${jsonToYaml(value, indent + 1)}`;
      } else if (typeof value === 'object' && value !== null) {
        yaml += `${spaces}${key}:\n${jsonToYaml(value, indent + 1)}`;
      } else {
        yaml += `${spaces}${key}: ${JSON.stringify(value)}\n`;
      }
    }
  }

  return yaml;
}

// Re-export types for convenience
export type {
  OpenApiExportOptions,
  OpenApiServer,
  ContractSpecOpenApiDocument,
  ContractSpecExportOptions,
  ContractSpecExportResult,
};
