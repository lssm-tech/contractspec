import type { DataViewSpec } from '../data-views';

export interface DataViewQueryParams {
  filters?: Record<string, any>;
  sort?: { field: string; direction: 'asc' | 'desc' };
  pagination?: { page: number; pageSize: number };
  search?: string;
}

export interface DataViewQuery {
  operationName: string;
  input: Record<string, any>;
  meta: {
    pagination: { page: number; pageSize: number; skip: number; take: number };
    sorting?: { field: string; direction: 'asc' | 'desc' };
  };
}

export class DataViewQueryGenerator {
  constructor(private spec: DataViewSpec) {}

  generate(params: DataViewQueryParams): DataViewQuery {
    const { primary } = this.spec.source;
    const page = params.pagination?.page ?? 1;
    const pageSize = params.pagination?.pageSize ?? 20;
    const skip = (page - 1) * pageSize;
    const take = pageSize;

    const input: Record<string, any> = {
      skip,
      take,
      ...params.filters,
    };

    if (params.search) {
      input.search = params.search;
    }

    if (params.sort) {
      input.orderBy = {
        [params.sort.field]: params.sort.direction,
      };
    }

    return {
      operationName: primary.name,
      input,
      meta: {
        pagination: { page, pageSize, skip, take },
        sorting: params.sort,
      },
    };
  }

  validateParams(params: DataViewQueryParams): string[] {
    const errors: string[] = [];

    // Validate filters against spec
    if (params.filters && this.spec.view.filters) {
      for (const key of Object.keys(params.filters)) {
        const defined = this.spec.view.filters.find((f) => f.key === key);
        if (!defined) {
          errors.push(`Unknown filter key: ${key}`);
        }
      }
    }

    // Validate sort field
    if (params.sort) {
      const field = this.spec.view.fields.find(
        (f) => f.key === params.sort!.field
      );
      if (!field) {
        errors.push(`Unknown sort field: ${params.sort.field}`);
      } else if (field.sortable === false) {
        errors.push(`Field is not sortable: ${params.sort.field}`);
      }
    }

    return errors;
  }
}
