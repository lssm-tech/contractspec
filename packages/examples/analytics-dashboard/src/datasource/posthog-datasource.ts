import type {
  AnalyticsQueryResult,
  AnalyticsReader,
} from '@contractspec/lib.contracts-integrations';
import type {
  AggregationDefinition,
  ColumnDefinition,
  IQueryEngine,
  QueryDefinition,
  QueryParameters,
  QueryResult,
} from '../query-engine';

export interface PosthogQueryEngineOptions {
  defaultLimit?: number;
}

export class PosthogQueryEngine implements IQueryEngine {
  private readonly reader: AnalyticsReader;
  private readonly defaultLimit: number;

  constructor(
    reader: AnalyticsReader,
    options: PosthogQueryEngineOptions = {}
  ) {
    this.reader = reader;
    this.defaultLimit = options.defaultLimit ?? 100;
  }

  async execute(
    definition: QueryDefinition,
    params: QueryParameters
  ): Promise<QueryResult> {
    const startTime = Date.now();
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

    if (!this.reader.queryHogQL) {
      return {
        data: [],
        columns: [],
        rowCount: 0,
        executionTimeMs: Date.now() - startTime,
        cached: false,
        error: 'Analytics reader does not support HogQL queries.',
      };
    }

    try {
      const result = await this.executeHogQL(definition, params);
      return {
        data: result.data,
        columns: result.columns,
        rowCount: result.rowCount,
        executionTimeMs: Date.now() - startTime,
        cached: false,
      };
    } catch (error) {
      return {
        data: [],
        columns: [],
        rowCount: 0,
        executionTimeMs: Date.now() - startTime,
        cached: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  validateQuery(definition: QueryDefinition): {
    valid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];
    if (definition.type === 'SQL' && !definition.sql) {
      errors.push('SQL query is missing.');
    }
    if (definition.type === 'AGGREGATION' && !definition.aggregation) {
      errors.push('Aggregation definition is missing.');
    }
    if (definition.type === 'METRIC' && !definition.metricIds?.length) {
      errors.push('Metric IDs are missing.');
    }
    if (definition.type === 'CUSTOM' && !definition.custom?.handler) {
      errors.push('Custom handler is missing.');
    }
    return { valid: errors.length === 0, errors };
  }

  private async executeHogQL(
    definition: QueryDefinition,
    params: QueryParameters
  ): Promise<{
    data: Record<string, unknown>[];
    columns: ColumnDefinition[];
    rowCount: number;
  }> {
    if (!this.reader.queryHogQL) {
      throw new Error('Analytics reader does not support HogQL queries.');
    }
    if (definition.type === 'SQL') {
      const result = await this.reader.queryHogQL({
        query: definition.sql ?? '',
        values: params.parameters ?? {},
      });
      return mapHogqlResult(result);
    }
    if (definition.type === 'AGGREGATION' && definition.aggregation) {
      const { query, values } = buildAggregationQuery(
        definition.aggregation,
        params
      );
      const result = await this.reader.queryHogQL({ query, values });
      return mapHogqlResult(result);
    }
    if (definition.type === 'METRIC' && definition.metricIds) {
      const { query, values } = buildMetricQuery(definition.metricIds, params);
      const result = await this.reader.queryHogQL({ query, values });
      return mapHogqlResult(result);
    }
    throw new Error('Unsupported query type for PostHog datasource.');
  }
}

export function createPosthogQueryEngine(
  reader: AnalyticsReader,
  options?: PosthogQueryEngineOptions
): IQueryEngine {
  return new PosthogQueryEngine(reader, options);
}

function buildMetricQuery(
  metricIds: string[],
  params: QueryParameters
): { query: string; values: Record<string, unknown> } {
  const range = resolveDateRange(params);
  const values: Record<string, unknown> = {
    dateFrom: range?.from.toISOString(),
    dateTo: range?.to.toISOString(),
  };
  const metricClauses = metricIds.map((metricId, index) => {
    values[`metric${index}`] = metricId;
    return `event = {metric${index}}`;
  });
  const whereClauses = [
    metricClauses.length ? `(${metricClauses.join(' or ')})` : '',
    range ? 'timestamp >= {dateFrom} and timestamp < {dateTo}' : '',
  ]
    .filter(Boolean)
    .join(' and ');

  return {
    query: [
      'select',
      '  event as metric,',
      '  count() as total',
      'from events',
      whereClauses ? `where ${whereClauses}` : '',
      'group by metric',
    ]
      .filter(Boolean)
      .join('\n'),
    values,
  };
}

function buildAggregationQuery(
  aggregation: AggregationDefinition,
  params: QueryParameters
): { query: string; values: Record<string, unknown> } {
  const measures = aggregation.measures.map((measure) => ({
    ...measure,
    expression: buildMeasureExpression(measure.field, measure.aggregation),
  }));
  const dimensions = aggregation.dimensions.map((dimension) => ({
    ...dimension,
    expression: buildDimensionExpression(
      dimension.field,
      dimension.type,
      dimension.granularity
    ),
  }));
  const selections = [
    ...dimensions.map(
      (dimension) => `${dimension.expression} as ${dimension.name}`
    ),
    ...measures.map((measure) => `${measure.expression} as ${measure.name}`),
  ];
  const values: Record<string, unknown> = {};
  const filters = buildFilterClauses(aggregation, params, values);
  const limit = aggregation.limit ?? 100;
  const orderBy = aggregation.orderBy?.length
    ? `order by ${aggregation.orderBy
        .map((order) => `${order.field} ${order.direction}`)
        .join(', ')}`
    : '';

  return {
    query: [
      'select',
      `  ${selections.join(',\n  ')}`,
      `from ${aggregation.source}`,
      filters.length ? `where ${filters.join(' and ')}` : '',
      dimensions.length
        ? `group by ${dimensions.map((d) => d.name).join(', ')}`
        : '',
      orderBy,
      `limit ${limit}`,
    ]
      .filter(Boolean)
      .join('\n'),
    values,
  };
}

function buildMeasureExpression(field: string, aggregation: string): string {
  switch (aggregation) {
    case 'COUNT':
      return field === '*' ? 'count()' : `count(${field})`;
    case 'COUNT_DISTINCT':
      return `countDistinct(${field})`;
    case 'SUM':
      return `sum(${field})`;
    case 'AVG':
      return `avg(${field})`;
    case 'MIN':
      return `min(${field})`;
    case 'MAX':
      return `max(${field})`;
    default:
      return `count(${field})`;
  }
}

function buildDimensionExpression(
  field: string,
  type?: string,
  granularity?: string
): string {
  if (type === 'TIME') {
    switch (granularity) {
      case 'HOUR':
        return `toStartOfHour(${field})`;
      case 'WEEK':
        return `toStartOfWeek(${field})`;
      case 'MONTH':
        return `toStartOfMonth(${field})`;
      case 'YEAR':
        return `toStartOfYear(${field})`;
      case 'DAY':
      default:
        return `toStartOfDay(${field})`;
    }
  }
  return field;
}

function buildFilterClauses(
  aggregation: AggregationDefinition,
  params: QueryParameters,
  values: Record<string, unknown>
): string[] {
  const clauses: string[] = [];
  const range = resolveDateRange(params);
  if (range) {
    values.dateFrom = range.from.toISOString();
    values.dateTo = range.to.toISOString();
    clauses.push(`timestamp >= {dateFrom} and timestamp < {dateTo}`);
  }

  aggregation.filters?.forEach((filter, index) => {
    const key = `filter${index}`;
    switch (filter.operator) {
      case 'eq':
        values[key] = filter.value;
        clauses.push(`${filter.field} = {${key}}`);
        break;
      case 'neq':
        values[key] = filter.value;
        clauses.push(`${filter.field} != {${key}}`);
        break;
      case 'gt':
        values[key] = filter.value;
        clauses.push(`${filter.field} > {${key}}`);
        break;
      case 'gte':
        values[key] = filter.value;
        clauses.push(`${filter.field} >= {${key}}`);
        break;
      case 'lt':
        values[key] = filter.value;
        clauses.push(`${filter.field} < {${key}}`);
        break;
      case 'lte':
        values[key] = filter.value;
        clauses.push(`${filter.field} <= {${key}}`);
        break;
      case 'contains':
        values[key] = filter.value;
        clauses.push(`${filter.field} LIKE '%' || {${key}} || '%'`);
        break;
      case 'between': {
        if (Array.isArray(filter.value) && filter.value.length >= 2) {
          values[`${key}Start`] = filter.value[0];
          values[`${key}End`] = filter.value[1];
          clauses.push(`${filter.field} BETWEEN {${key}Start} AND {${key}End}`);
        }
        break;
      }
      case 'in':
      case 'nin':
        if (Array.isArray(filter.value)) {
          const placeholders: string[] = [];
          filter.value.forEach((value, valueIndex) => {
            const valueKey = `${key}_${valueIndex}`;
            values[valueKey] = value;
            placeholders.push(`{${valueKey}}`);
          });
          if (placeholders.length) {
            clauses.push(
              `${filter.field} ${filter.operator === 'in' ? 'IN' : 'NOT IN'} (${placeholders.join(
                ', '
              )})`
            );
          }
        }
        break;
      default:
        break;
    }
  });
  return clauses;
}

function resolveDateRange(
  params: QueryParameters
): { from: Date; to: Date } | null {
  const range = params.dateRange;
  if (!range) return null;
  return { from: range.start, to: range.end };
}

function mapHogqlResult(result: AnalyticsQueryResult): {
  data: Record<string, unknown>[];
  columns: ColumnDefinition[];
  rowCount: number;
} {
  if (!Array.isArray(result.results) || !Array.isArray(result.columns)) {
    return { data: [], columns: [], rowCount: 0 };
  }
  const columns = result.columns.map((name) => ({
    name,
    type: 'STRING' as const,
  }));
  const data = result.results.map((row) => {
    if (!Array.isArray(row)) return {};
    const record: Record<string, unknown> = {};
    result.columns?.forEach((column, index) => {
      record[column] = row[index];
    });
    return record;
  });
  return {
    data,
    columns,
    rowCount: data.length,
  };
}
