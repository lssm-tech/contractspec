import type * as Monaco from 'monaco-editor';

const CONTRACTSPEC_DECLARATIONS = `
declare module '@contractspec/lib.contracts' {
  export type StabilityValue = 'experimental' | 'beta' | 'stable';

  export const StabilityEnum: {
    Experimental: 'experimental';
    Beta: 'beta';
    Stable: 'stable';
  };

  export interface CapabilityMeta {
    key: string;
    version: number;
    kind?: string;
    title?: string;
    description?: string;
    domain?: string;
    owners?: string[];
    tags?: string[];
    stability?: StabilityValue;
  }

  export interface ContractIO<I = unknown, O = unknown> {
    input: I;
    output: O;
  }

  export interface CapabilitySpec<I = unknown, O = unknown> {
    meta: CapabilityMeta;
    provides?: Record<string, unknown>;
    requires?: Record<string, unknown>;
    io?: ContractIO<I, O>;
    policy?: Record<string, unknown>;
  }

  export interface WorkflowSpec {
    meta: CapabilityMeta;
    steps: Record<string, unknown>;
    transitions?: Record<string, unknown>;
  }

  export interface PolicySpec {
    meta: CapabilityMeta;
    rules: Record<string, unknown>;
  }

  export interface DataViewSpec {
    meta: CapabilityMeta;
    view: Record<string, unknown>;
    source?: Record<string, unknown>;
  }

  export interface ComponentSpec {
    meta: CapabilityMeta;
    props?: Record<string, unknown>;
    states?: Record<string, unknown>;
  }

  export type ContractSpec<I = unknown, O = unknown> = {
    meta: CapabilityMeta;
    transport?: Record<string, unknown>;
    io: ContractIO<I, O>;
    policy?: Record<string, unknown>;
  };

  export interface SchemaModel<T = unknown> {
    kind: string;
    config?: T;
  }

  export function schemaModel<T>(model: T): SchemaModel<T>;
  export function contractSpec<I = unknown, O = unknown>(
    key: string,
    spec: ContractSpec<I, O>
  ): ContractSpec<I, O>;
  export function defineCapability<T extends CapabilitySpec>(
    spec: T
  ): T;
  export function defineWorkflow<T extends WorkflowSpec>(spec: T): T;
  export function definePolicy<T extends PolicySpec>(spec: T): T;
  export function defineDataView<T extends DataViewSpec>(spec: T): T;
  export function defineComponentSpec<T extends ComponentSpec>(spec: T): T;
}

declare module '@contractspec/lib.contracts/types/all' {
  export * from '@contractspec/lib.contracts';
}

declare global {
  const contractSpec: typeof import('@contractspec/lib.contracts').contractSpec;
  const defineCapability: typeof import('@contractspec/lib.contracts').defineCapability;
}

export {};
`;

const ZOD_DECLARATIONS = `
declare module 'zod' {
  type Primitive = string | number | bigint | boolean | null | undefined;

  export interface ZodTypeAny {
    optional(): this;
    nullable(): this;
    array(): this;
  }

  export type infer<T> = T extends { _output: infer O } ? O : never;

  export const z: {
    string(): ZodTypeAny;
    number(): ZodTypeAny;
    boolean(): ZodTypeAny;
    bigint(): ZodTypeAny;
    date(): ZodTypeAny;
    object<T extends Record<string, ZodTypeAny>>(shape: T): ZodTypeAny;
    array<T extends ZodTypeAny>(schema: T): ZodTypeAny;
    enum<T extends readonly [string, ...string[]]>(values: T): ZodTypeAny;
    literal<T extends Primitive>(value: T): ZodTypeAny;
    union<T extends readonly ZodTypeAny[]>(schemas: T): ZodTypeAny;
    record(key?: ZodTypeAny, value?: ZodTypeAny): ZodTypeAny;
    optional<T extends ZodTypeAny>(schema: T): ZodTypeAny;
    nullable<T extends ZodTypeAny>(schema: T): ZodTypeAny;
  };
}
`;

let alreadyRegistered = false;

export function registerSpecEditorMonacoTypes(
  monaco: typeof Monaco
): () => void {
  if (alreadyRegistered) {
    return () => {
      /* no-op */
    };
  }

  alreadyRegistered = true;

  const tsDefaults = monaco.typescript.typescriptDefaults;

  tsDefaults.setCompilerOptions({
    allowNonTsExtensions: true,
    allowSyntheticDefaultImports: true,
    allowJs: true,
    moduleResolution: monaco.typescript.ModuleResolutionKind.NodeJs,
    module: monaco.typescript.ModuleKind.ESNext,
    target: monaco.typescript.ScriptTarget.ES2020,
    jsx: monaco.typescript.JsxEmit.ReactJSX,
    skipLibCheck: true,
  });

  const disposers: Monaco.IDisposable[] = [
    tsDefaults.addExtraLib(CONTRACTSPEC_DECLARATIONS, 'ts:contractspec.d.ts'),
    tsDefaults.addExtraLib(ZOD_DECLARATIONS, 'ts:zod.d.ts'),
  ];

  return () => {
    disposers.forEach((disposer) => {
      try {
        disposer.dispose();
      } catch {
        // no-op
      }
    });
    alreadyRegistered = false;
  };
}
