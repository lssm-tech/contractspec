export type ExampleId = string;

export type ExampleKind =
  | 'template'
  | 'workflow'
  | 'integration'
  | 'knowledge'
  | 'blueprint'
  | 'ui'
  | 'script'
  | 'library';

export type ExampleVisibility = 'public' | 'internal' | 'mixed';

export type ExampleSandboxMode =
  | 'playground'
  | 'specs'
  | 'builder'
  | 'markdown'
  | 'evolution';

export interface ExampleDocRefs {
  /** Canonical doc route id(s) in DocBlocks registry */
  rootDocId?: string;
  goalDocId?: string;
  usageDocId?: string;
  referenceDocId?: string;
  constraintsDocId?: string;
}

export interface ExampleSurfacesSupport {
  templates: boolean;
  sandbox: {
    enabled: boolean;
    modes: readonly ExampleSandboxMode[];
  };
  studio: {
    enabled: boolean;
    /** If true, Studio can create a real project from this example via API. */
    installable: boolean;
  };
  mcp: {
    enabled: boolean;
  };
}

export interface ExampleEntrypoints {
  /** Package name in the monorepo (workspace) */
  packageName: string;
  /** Optional exports from the example package (strings are subpath exports). */
  feature?: string;
  presentations?: string;
  contracts?: string;
  handlers?: string;
  ui?: string;
  docs?: string;
}

export interface ExampleDefinition {
  id: ExampleId;
  title: string;
  summary: string;
  tags: readonly string[];
  kind: ExampleKind;
  visibility: ExampleVisibility;
  docs?: ExampleDocRefs;
  entrypoints: ExampleEntrypoints;
  surfaces: ExampleSurfacesSupport;
}


