/**
 * Serialization functions for converting spec types to their serialized forms.
 */

import type { AnySchemaModel } from '@contractspec/lib.schema';
import type { ResourceRefDescriptor } from '../resources';
import type { AnyOperationSpec } from '../operations';
import type { AnyEventSpec } from '../events';
import type { PresentationSpec } from '../presentations';
import type { DataViewSpec } from '../data-views';
import type { FormSpec } from '../forms';
import type {
  SerializedSchemaModel,
  SerializedOperationSpec,
  SerializedEventSpec,
  SerializedPresentationSpec,
  SerializedDataViewSpec,
  SerializedFormSpec,
} from './types';

/**
 * Type guard to check if a value is a ResourceRefDescriptor.
 */
function isResourceRefDescriptor(
  value: unknown
): value is ResourceRefDescriptor<boolean> {
  return (
    typeof value === 'object' &&
    value !== null &&
    'kind' in value &&
    (value as { kind: unknown }).kind === 'resource_ref'
  );
}

function getTypeName(type: unknown): string {
  if (!type) return 'unknown';
  if (typeof type === 'string') return type;
  if (typeof type === 'object') {
    // Check for SchemaModel
    if (
      'config' in type &&
      (type as { config?: { name?: string } }).config?.name
    ) {
      return (type as { config: { name: string } }).config.name;
    }
    // Check for FieldType or EnumType with name
    if (
      'name' in type &&
      typeof (type as { name: unknown }).name === 'string'
    ) {
      return (type as { name: string }).name;
    }
  }
  return 'unknown';
}

/**
 * Serialize a SchemaModel to a plain JSON object.
 */
export function serializeSchemaModel(
  model: AnySchemaModel | ResourceRefDescriptor<boolean> | null | undefined
): SerializedSchemaModel | null {
  if (!model) return null;

  // Handle ResourceRefDescriptor - return a simplified schema representation
  if (isResourceRefDescriptor(model)) {
    return {
      name: `ResourceRef<${model.graphQLType}>`,
      description: `Reference to ${model.graphQLType} resource (${model.uriTemplate})`,
      fields: {},
    };
  }

  // Check if it's a SchemaModel with config
  if ('config' in model && model.config) {
    const config = model.config as {
      name: string;
      description?: string | null;
      fields: Record<
        string,
        { type: unknown; isOptional: boolean; isArray?: boolean }
      >;
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

/**
 * Serialize an OperationSpec to a plain JSON object.
 */
export function serializeOperationSpec(
  spec: AnyOperationSpec | null | undefined
): SerializedOperationSpec | null {
  if (!spec) return null;

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
 * Serialize an EventSpec to a plain JSON object.
 */
export function serializeEventSpec(
  spec: AnyEventSpec | null | undefined
): SerializedEventSpec | null {
  if (!spec) return null;

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
 * Serialize a PresentationSpec to a plain JSON object.
 */
export function serializePresentationSpec(
  spec: PresentationSpec | null | undefined
): SerializedPresentationSpec | null {
  if (!spec) return null;

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
      framework:
        spec.source.type === 'component' ? spec.source.framework : undefined,
      componentKey:
        spec.source.type === 'component' ? spec.source.componentKey : undefined,
    },
    targets: spec.targets,
  };
}

/**
 * Serialize a DataViewSpec to a plain JSON object.
 */
export function serializeDataViewSpec(
  spec: DataViewSpec | null | undefined
): SerializedDataViewSpec | null {
  if (!spec) return null;

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
    source: spec.source,
    view: spec.view,
  };
}

/**
 * Serialize a FormSpec to a plain JSON object.
 */
export function serializeFormSpec(
  spec: FormSpec | null | undefined
): SerializedFormSpec | null {
  if (!spec) return null;

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
    // Serialize fields and actions as-is for display purposes
    fields: spec.fields as unknown as SerializedFormSpec['fields'],
    actions: spec.actions as unknown as SerializedFormSpec['actions'],
  };
}
