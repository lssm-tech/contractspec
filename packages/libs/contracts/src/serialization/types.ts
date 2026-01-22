/**
 * Serialized types for Server -> Client Component transfer.
 *
 * These are plain JSON-serializable versions of spec types that can be
 * safely passed from Server Components to Client Components in Next.js.
 */

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
  /** Serialized source configuration */
  source?: unknown;
  /** Serialized view configuration */
  view?: unknown;
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
  /** Serialized form fields (passed through for display) */
  fields?: unknown;
  /** Serialized form actions (passed through for display) */
  actions?: unknown;
}
