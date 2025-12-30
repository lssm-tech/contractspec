/**
 * Analytics Query Engine
 *
 * Provides query execution and caching for analytics dashboards.
 */

// ============ Types ============

export interface QueryDefinition {
  type: 'SQL' | 'METRIC' | 'AGGREGATION' | 'CUSTOM';
  sql?: string;
  metricIds?: string[];
  aggregation?: AggregationDefinition;
  custom?: CustomQueryDefinition;
}

export interface AggregationDefinition {
  source: string;
  measures: MeasureDefinition[];
  dimensions: DimensionDefinition[];
  filters?: FilterDefinition[];
  orderBy?: OrderByDefinition[];
  limit?: number;
}

export interface MeasureDefinition {
  name: string;
  field: string;
  aggregation: 'COUNT' | 'SUM' | 'AVG' | 'MIN' | 'MAX' | 'COUNT_DISTINCT';
  format?: string;
}

export interface DimensionDefinition {
  name: string;
  field: string;
  type?: 'TIME' | 'STRING' | 'NUMBER';
  granularity?: 'HOUR' | 'DAY' | 'WEEK' | 'MONTH' | 'YEAR';
}

export interface FilterDefinition {
  field: string;
  operator:
    | 'eq'
    | 'neq'
    | 'gt'
    | 'gte'
    | 'lt'
    | 'lte'
    | 'in'
    | 'nin'
    | 'contains'
    | 'between';
  value: unknown;
}

export interface OrderByDefinition {
  field: string;
  direction: 'ASC' | 'DESC';
}

export interface CustomQueryDefinition {
  handler: string;
  parameters: Record<string, unknown>;
}

export interface QueryParameters {
  dateRange?: {
    start: Date;
    end: Date;
    granularity?: string;
  };
  filters?: FilterDefinition[];
  parameters?: Record<string, unknown>;
}

export interface QueryResult {
  data: Record<string, unknown>[];
  columns: ColumnDefinition[];
  rowCount: number;
  executionTimeMs: number;
  cached: boolean;
  cachedAt?: Date;
  error?: string;
}

export interface ColumnDefinition {
  name: string;
  type: 'STRING' | 'NUMBER' | 'DATE' | 'BOOLEAN';
  label?: string;
  format?: string;
}

// ============ Query Engine Interface ============

export interface IQueryEngine {
  execute(
    definition: QueryDefinition,
    params: QueryParameters
  ): Promise<QueryResult>;
  validateQuery(definition: QueryDefinition): {
    valid: boolean;
    errors: string[];
  };
}

// ============ Query Cache ============

export interface IQueryCache {
  get(key: string): Promise<QueryResult | null>;
  set(key: string, result: QueryResult, ttlSeconds: number): Promise<void>;
  invalidate(pattern: string): Promise<void>;
}

export class InMemoryQueryCache implements IQueryCache {
  private cache = new Map<string, { result: QueryResult; expiresAt: Date }>();

  async get(key: string): Promise<QueryResult | null> {
    const entry = this.cache.get(key);
    if (!entry) return null;
    if (entry.expiresAt < new Date()) {
      this.cache.delete(key);
      return null;
    }
    return { ...entry.result, cached: true, cachedAt: entry.expiresAt };
  }

  async set(
    key: string,
    result: QueryResult,
    ttlSeconds: number
  ): Promise<void> {
    const expiresAt = new Date(Date.now() + ttlSeconds * 1000);
    this.cache.set(key, { result, expiresAt });
  }

  async invalidate(pattern: string): Promise<void> {
    const regex = new RegExp(pattern);
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
      }
    }
  }
}

// ============ Basic Query Engine ============

export class BasicQueryEngine implements IQueryEngine {
  private cache: IQueryCache;

  constructor(cache?: IQueryCache) {
    this.cache = cache ?? new InMemoryQueryCache();
  }

  async execute(
    definition: QueryDefinition,
    params: QueryParameters
  ): Promise<QueryResult> {
    const startTime = Date.now();

    // Validate query
    const validation = this.validateQuery(definition);
    if (!validation.valid) {
      return {
        data: [],
        columns: [],
        rowCount: 0,
        executionTimeMs: Date.now() - startTime,
        cached: false,
        error: validation.errors.join(', '),
      };
    }

    // Check cache
    const cacheKey = this.buildCacheKey(definition, params);
    const cachedResult = await this.cache.get(cacheKey);
    if (cachedResult) {
      return cachedResult;
    }

    // Execute query based on type
    let result: QueryResult;
    switch (definition.type) {
      case 'AGGREGATION':
        if (!definition.aggregation) {
          throw new Error('Aggregation definition is missing');
        }
        result = await this.executeAggregation(definition.aggregation, params);
        break;
      case 'METRIC':
        if (!definition.metricIds) {
          throw new Error('Metric IDs are missing');
        }
        result = await this.executeMetric(definition.metricIds, params);
        break;
      case 'SQL':
        if (!definition.sql) {
          throw new Error('SQL query is missing');
        }
        result = await this.executeSql(definition.sql, params);
        break;
      default:
        result = {
          data: [],
          columns: [],
          rowCount: 0,
          executionTimeMs: Date.now() - startTime,
          cached: false,
          error: `Unknown query type: ${definition.type}`,
        };
    }

    result.executionTimeMs = Date.now() - startTime;
    result.cached = false;

    // Cache result
    await this.cache.set(cacheKey, result, 300);

    return result;
  }

  validateQuery(definition: QueryDefinition): {
    valid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!definition.type) {
      errors.push('Query type is required');
    }

    switch (definition.type) {
      case 'SQL':
        if (!definition.sql) {
          errors.push('SQL query is required for SQL type');
        }
        break;
      case 'METRIC':
        if (!definition.metricIds || definition.metricIds.length === 0) {
          errors.push('Metric IDs are required for METRIC type');
        }
        break;
      case 'AGGREGATION':
        if (!definition.aggregation) {
          errors.push(
            'Aggregation definition is required for AGGREGATION type'
          );
        } else {
          if (!definition.aggregation.source) {
            errors.push('Aggregation source is required');
          }
          if (
            !definition.aggregation.measures ||
            definition.aggregation.measures.length === 0
          ) {
            errors.push('At least one measure is required');
          }
        }
        break;
    }

    return { valid: errors.length === 0, errors };
  }

  private buildCacheKey(
    definition: QueryDefinition,
    params: QueryParameters
  ): string {
    return JSON.stringify({ definition, params });
  }

  private async executeAggregation(
    aggregation: AggregationDefinition,
    params: QueryParameters
  ): Promise<QueryResult> {
    // In production, this would execute against a data warehouse
    // For demo, return mock data
    const columns: ColumnDefinition[] = [
      ...aggregation.dimensions.map((d) => ({
        name: d.name,
        type: (d.type === 'NUMBER'
          ? 'NUMBER'
          : d.type === 'TIME'
            ? 'DATE'
            : 'STRING') as ColumnDefinition['type'],
        label: d.name,
      })),
      ...aggregation.measures.map((m) => ({
        name: m.name,
        type: 'NUMBER' as const,
        label: m.name,
        format: m.format,
      })),
    ];

    // Mock data generation
    const data = this.generateMockData(aggregation, params);

    return {
      data,
      columns,
      rowCount: data.length,
      executionTimeMs: 0,
      cached: false,
    };
  }

  private async executeMetric(
    metricIds: string[],
    _params: QueryParameters
  ): Promise<QueryResult> {
    // In production, this would fetch from metering service
    const data = metricIds.map((id) => ({
      metricId: id,
      value: Math.random() * 1000,
      change: (Math.random() - 0.5) * 20,
    }));

    return {
      data,
      columns: [
        { name: 'metricId', type: 'STRING' },
        { name: 'value', type: 'NUMBER' },
        { name: 'change', type: 'NUMBER' },
      ],
      rowCount: data.length,
      executionTimeMs: 0,
      cached: false,
    };
  }

  private async executeSql(
    _sql: string,
    _params: QueryParameters
  ): Promise<QueryResult> {
    // In production, this would execute SQL against a database
    return {
      data: [],
      columns: [],
      rowCount: 0,
      executionTimeMs: 0,
      cached: false,
      error: 'SQL execution not implemented in demo',
    };
  }

  private generateMockData(
    aggregation: AggregationDefinition,
    params: QueryParameters
  ): Record<string, unknown>[] {
    const data: Record<string, unknown>[] = [];
    const rowCount = 10;

    // Generate time series data if there's a time dimension
    const timeDimension = aggregation.dimensions.find((d) => d.type === 'TIME');

    for (let i = 0; i < rowCount; i++) {
      const row: Record<string, unknown> = {};

      for (const dim of aggregation.dimensions) {
        if (dim.type === 'TIME') {
          const date = new Date(params.dateRange?.start ?? new Date());
          date.setDate(date.getDate() + i);
          row[dim.name] = date.toISOString().split('T')[0];
        } else {
          row[dim.name] = `${dim.name}_${i % 5}`;
        }
      }

      for (const measure of aggregation.measures) {
        const baseValue = timeDimension ? 100 + i * 10 : Math.random() * 1000;
        const noise = (Math.random() - 0.5) * 20;
        row[measure.name] = Math.round((baseValue + noise) * 100) / 100;
      }

      data.push(row);
    }

    return data;
  }
}

// ============ Factory ============

export function createQueryEngine(cache?: IQueryCache): IQueryEngine {
  return new BasicQueryEngine(cache);
}
