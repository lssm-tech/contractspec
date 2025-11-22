import { DataViewRegistry, type DataViewSpec } from '../data-views';

export interface DataViewRuntimeConfig {
  registry: DataViewRegistry;
  // eventBus?: EventBus; // To be integrated with actual bus implementation
}

export interface DataViewResult<T = any> {
  data: T[];
  total: number;
  loading: boolean;
  error?: Error;
}

export class DataViewRuntime {
  private cache = new Map<string, { data: any[]; timestamp: number }>();
  private subscriptions = new Map<string, Set<() => void>>();

  constructor(private config: DataViewRuntimeConfig) {}

  register(spec: DataViewSpec) {
    this.config.registry.register(spec);
  }

  getSpec(name: string, version?: number) {
    return this.config.registry.get(name, version);
  }

  // Simulating query execution for now as we don't have a full backend context here
  // In a real app, this would call the backend API via an adapter
  async executeQuery(specName: string, params: any): Promise<DataViewResult> {
    const spec = this.getSpec(specName);
    if (!spec) {
      throw new Error(`DataView spec not found: ${specName}`);
    }

    // TODO: Implement actual data fetching via Operation runtime
    // For now, return empty or cached data

    return {
      data: [],
      total: 0,
      loading: false,
    };
  }

  invalidate(specName: string) {
    this.cache.delete(specName);
    this.notifySubscribers(specName);
  }

  subscribe(specName: string, callback: () => void) {
    if (!this.subscriptions.has(specName)) {
      this.subscriptions.set(specName, new Set());
    }
    this.subscriptions.get(specName)!.add(callback);
    return () => {
      this.subscriptions.get(specName)?.delete(callback);
    };
  }

  private notifySubscribers(specName: string) {
    this.subscriptions.get(specName)?.forEach((cb) => cb());
  }
}



