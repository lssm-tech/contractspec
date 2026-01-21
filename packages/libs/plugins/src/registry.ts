import type {
  AdapterCapability,
  AdapterRegistry,
  FormatterCapability,
  FormatterRegistry,
  GeneratorCapability,
  GeneratorRegistry,
  PluginRegistryConfig,
  RegistryResolverCapability,
  RegistryResolverRegistry,
  ValidatorCapability,
  ValidatorRegistry,
} from './types.js';

class SimpleRegistry<T extends { id: string }> {
  private readonly entries = new Map<string, T>();

  register(entry: T): void {
    this.entries.set(entry.id, entry);
  }

  list(): T[] {
    return Array.from(this.entries.values());
  }
}

export class PluginRegistries {
  readonly generators: GeneratorRegistry;
  readonly validators: ValidatorRegistry;
  readonly adapters: AdapterRegistry;
  readonly formatters: FormatterRegistry;
  readonly registryResolvers: RegistryResolverRegistry;

  constructor() {
    this.generators = new SimpleRegistry<GeneratorCapability>();
    this.validators = new SimpleRegistry<ValidatorCapability>();
    this.adapters = new SimpleRegistry<AdapterCapability>();
    this.formatters = new SimpleRegistry<FormatterCapability>();
    this.registryResolvers = new SimpleRegistry<RegistryResolverCapability>();
  }
}

export const defaultPluginRegistryConfig: PluginRegistryConfig = {
  plugins: [],
  registry: {
    resolutionOrder: ['workspace', 'npm', 'remote'],
    allowPrerelease: false,
    sources: {},
  },
};
