import type { AnySchemaModel } from '@contractspec/lib.schema';

export type SpecDefinition = unknown;

export type PluginCapabilityType =
  | 'generator'
  | 'validator'
  | 'adapter'
  | 'formatter'
  | 'registryResolver';

export interface PluginMeta {
  id: string;
  version: string;
  type: PluginCapabilityType;
  provides: string[];
  description?: string;
  compatibility?: string;
}

export interface PluginContext {
  workspaceRoot: string;
  configPath?: string;
  generators: GeneratorRegistry;
  validators: ValidatorRegistry;
  adapters: AdapterRegistry;
  formatters: FormatterRegistry;
  registryResolvers: RegistryResolverRegistry;
}

export interface PluginRegistryItem {
  id: string;
  package: string;
  capabilities: PluginCapabilityType[];
  options?: Record<string, unknown>;
}

export interface PluginRegistryConfig {
  plugins: PluginRegistryItem[];
  registry?: {
    resolutionOrder: ('workspace' | 'npm' | 'remote')[];
    allowPrerelease?: boolean;
    sources?: Record<string, string>;
  };
}

export interface GeneratorCapability {
  id: string;
  description?: string;
  generate: (specs: SpecDefinition[], context: PluginContext) => Promise<void>;
}

export interface ValidatorCapability {
  id: string;
  description?: string;
  validate: (specs: SpecDefinition[], context: PluginContext) => Promise<void>;
}

export interface AdapterCapability {
  id: string;
  description?: string;
  create: (context: PluginContext) => Promise<unknown>;
}

export interface FormatterCapability {
  id: string;
  description?: string;
  format: (output: string, context: PluginContext) => Promise<string>;
}

export interface RegistryResolverCapability {
  id: string;
  description?: string;
  resolve: (request: { package: string }) => Promise<Record<string, unknown>>;
}

export interface ContractSpecPlugin {
  meta: PluginMeta;
  register: (context: PluginContext) => void | Promise<void>;
  configure?: (
    options: Record<string, unknown>,
    context: PluginContext
  ) => void | Promise<void>;
  validate?: (
    specs: SpecDefinition[],
    context: PluginContext
  ) => void | Promise<void>;
  generate?: (
    specs: SpecDefinition[],
    context: PluginContext
  ) => void | Promise<void>;
  dispose?: () => void | Promise<void>;
}

export interface GeneratorRegistry {
  register: (generator: GeneratorCapability) => void;
  list: () => GeneratorCapability[];
}

export interface ValidatorRegistry {
  register: (validator: ValidatorCapability) => void;
  list: () => ValidatorCapability[];
}

export interface AdapterRegistry {
  register: (adapter: AdapterCapability) => void;
  list: () => AdapterCapability[];
}

export interface FormatterRegistry {
  register: (formatter: FormatterCapability) => void;
  list: () => FormatterCapability[];
}

export interface RegistryResolverRegistry {
  register: (resolver: RegistryResolverCapability) => void;
  list: () => RegistryResolverCapability[];
}

export interface SpecRegistryEntry {
  id: string;
  spec: SpecDefinition;
  schemas: Record<string, AnySchemaModel>;
}
