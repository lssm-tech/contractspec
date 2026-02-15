import { DataViewRegistry, type DataViewSpec } from '../data-views';
import { OperationSpecRegistry } from '../operations';
import type { HandlerCtx } from '../types';

export interface DataViewRuntimeConfig {
  registry: DataViewRegistry;
  operationRegistry: OperationSpecRegistry;
  // eventBus?: EventBus; // To be integrated with actual bus implementation
}

export interface DataViewResult<T = unknown> {
  data: T[];
  total: number;
  loading: boolean;
  error?: Error;
}

// Helper guard for paginated results
interface PaginatedResult {
  items: unknown[];
  total?: number;
}

function isPaginatedResult(value: unknown): value is PaginatedResult {
  return (
    typeof value === 'object' &&
    value !== null &&
    'items' in value &&
    Array.isArray((value as { items: unknown }).items)
  );
}

export class DataViewRuntime {
  private cache = new Map<string, { data: unknown[]; timestamp: number }>();
  private subscriptions = new Map<string, Set<() => void>>();

  constructor(private config: DataViewRuntimeConfig) {}

  register(spec: DataViewSpec) {
    this.config.registry.register(spec);
  }

  getSpec(name: string, version?: string) {
    return this.config.registry.get(name, version);
  }

  async executeQuery(
    specName: string,
    params: unknown,
    ctx: HandlerCtx
  ): Promise<DataViewResult> {
    const spec = this.getSpec(specName);
    if (!spec) {
      throw new Error(`DataView spec not found: ${specName}`);
    }

    const opRef = spec.source.primary;
    if (!opRef) {
      throw new Error(`DataView spec ${specName} missing primary source`);
    }

    try {
      const result = await this.config.operationRegistry.execute(
        opRef.key,
        opRef.version,
        params,
        ctx
      );

      // Runtime validation and normalization to DataViewResult shape.
      // Current Adapter Logic:
      // 1. Array -> { data: result, total: length }
      // 2. Paginated { items: [], total? } -> { data: items, total: total ?? length }
      // 3. Single -> { data: [result], total: 1 }

      if (Array.isArray(result)) {
        return {
          data: result,
          total: result.length,
          loading: false,
        };
      }

      // Handle common paginated response shape { items: [], total: number }
      if (isPaginatedResult(result)) {
        return {
          data: result.items,
          total: result.total ?? result.items.length,
          loading: false,
        };
      }

      // Fallback for unknown shapes
      return {
        data: [result],
        total: 1,
        loading: false,
      };
    } catch (error) {
      return {
        data: [],
        total: 0,
        loading: false,
        error: error instanceof Error ? error : new Error(String(error)),
      };
    }
  }

  invalidate(specName: string) {
    this.cache.delete(specName);
    this.notifySubscribers(specName);
  }

  subscribe(specName: string, callback: () => void) {
    if (!this.subscriptions.has(specName)) {
      this.subscriptions.set(specName, new Set());
    }
    this.subscriptions.get(specName)?.add(callback);
    return () => {
      this.subscriptions.get(specName)?.delete(callback);
    };
  }

  private notifySubscribers(specName: string) {
    this.subscriptions.get(specName)?.forEach((cb) => cb());
  }
}
