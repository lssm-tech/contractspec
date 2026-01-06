import { describe, expect, it } from 'bun:test';
import { DataViewRegistry, type DataViewSpec } from './index';
import { DataViewRuntime } from './runtime';
import { OperationSpecRegistry } from '../operations';
import { z } from 'zod';
import { defineQuery } from '../operations';
import type { HandlerCtx } from '../types';
import { fromZod } from '@contractspec/lib.schema';

const mockOp = defineQuery({
  meta: {
    key: 'test.op',
    version: '1.0.0',
    title: 'Test Op',
    description: 'Test Op Description',
    goal: 'Test op goal',
    context: 'Test op context',
    owners: [],
    tags: [],
    stability: 'stable',
  },
  io: {
    input: fromZod(z.object({ filter: z.string().optional() })),
    output: fromZod(z.array(z.object({ id: z.string(), name: z.string() }))),
  },
  policy: {
    auth: 'anonymous',
  },
});

const mockDataViewSpec: DataViewSpec = {
  meta: {
    key: 'test.view',
    version: '1.0.0',
    entity: 'test',
    title: 'Test View',
    description: 'Test View',
    owners: [],
    tags: [],
    stability: 'stable',
  },
  source: {
    primary: { key: 'test.op', version: '1.0.0' },
  },
  view: {
    kind: 'list',
    fields: [{ key: 'name', label: 'Name', dataPath: 'name' }],
  },
};

const mockPaginatedOp = defineQuery({
  meta: {
    key: 'test.paginated',
    version: '1.0.0',
    title: 'Test Paginated Op',
    description: 'Test Paginated Op',
    goal: 'Test paginated op',
    context: 'Test paginated op',
    owners: [],
    tags: [],
    stability: 'stable',
  },
  io: {
    input: fromZod(z.object({})),
    output: fromZod(
      z.object({
        items: z.array(z.object({ id: z.string(), name: z.string() })),
        total: z.number(),
      })
    ),
  },
  policy: { auth: 'anonymous' },
});

const mockPaginatedSpec: DataViewSpec = {
  ...mockDataViewSpec,
  meta: { ...mockDataViewSpec.meta, key: 'test.paginated_view' },
  source: { primary: { key: 'test.paginated', version: '1.0.0' } },
};

const mockCtx = {} as HandlerCtx;

describe('DataViewRuntime', () => {
  it('executes query via OperationSpecRegistry', async () => {
    const dataViewRegistry = new DataViewRegistry();
    const opRegistry = new OperationSpecRegistry();

    dataViewRegistry.register(mockDataViewSpec);
    opRegistry.register(mockOp);

    const mockData = [{ id: '1', name: 'Test Item' }];

    // Bind a mock handler
    opRegistry.bind(mockOp, async () => mockData);

    const runtime = new DataViewRuntime({
      registry: dataViewRegistry,
      operationRegistry: opRegistry,
    });

    const result = await runtime.executeQuery('test.view', {}, mockCtx);

    expect(result.loading).toBe(false);
    expect(result.data).toEqual(mockData);
    expect(result.total).toBe(1);
  });

  it('handles paginated response shape', async () => {
    const dataViewRegistry = new DataViewRegistry();
    const opRegistry = new OperationSpecRegistry();

    dataViewRegistry.register(mockPaginatedSpec);
    opRegistry.register(mockPaginatedOp);

    const mockResponse = {
      items: [
        { id: '1', name: 'Item 1' },
        { id: '2', name: 'Item 2' },
      ],
      total: 10,
    };

    // Bind handler returning paginated shape
    opRegistry.bind(mockPaginatedOp, async () => mockResponse);

    const runtime = new DataViewRuntime({
      registry: dataViewRegistry,
      operationRegistry: opRegistry,
    });

    const result = await runtime.executeQuery(
      'test.paginated_view',
      {},
      mockCtx
    );

    expect(result.data).toEqual(mockResponse.items);
    expect(result.total).toBe(10);
  });

  it('handles operation errors', async () => {
    const dataViewRegistry = new DataViewRegistry();
    const opRegistry = new OperationSpecRegistry();

    dataViewRegistry.register(mockDataViewSpec);
    opRegistry.register(mockOp);

    opRegistry.bind(mockOp, async () => {
      throw new Error('Op failed');
    });

    const runtime = new DataViewRuntime({
      registry: dataViewRegistry,
      operationRegistry: opRegistry,
    });

    const result = await runtime.executeQuery('test.view', {}, mockCtx);

    expect(result.error).toBeInstanceOf(Error);
    expect(result.error?.message).toBe('Op failed');
    expect(result.data).toEqual([]);
  });

  it('throws if spec not found', async () => {
    const runtime = new DataViewRuntime({
      registry: new DataViewRegistry(),
      operationRegistry: new OperationSpecRegistry(),
    });

    expect(runtime.executeQuery('missing.view', {}, mockCtx)).rejects.toThrow(
      'DataView spec not found'
    );
  });
});
