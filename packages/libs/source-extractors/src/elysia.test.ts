/**
 * Unit tests for Elysia extractor.
 */

import { describe, expect, it, beforeEach } from 'bun:test';
import { ElysiaExtractor } from './extractors/elysia/extractor';
import type { ExtractorFsAdapter } from './extractors/base';
import type { ProjectInfo } from './types';

const FIXTURE_CONTENT = `
import { Elysia, t } from 'elysia';

const app = new Elysia()
  .get('/items', () => {
    return [];
  })
  .get('/items/:id', ({ params }) => {
    return { id: params.id };
  })
  .post('/items', ({ body }) => {
    return { id: '1', ...body };
  }, {
    body: t.Object({
      name: t.String(),
      quantity: t.Number()
    })
  })
  .put('/items/:id', ({ params, body }) => {
    return { success: true };
  })
  .delete('/items/:id', ({ params }) => {
    return null;
  });
`;

describe('ElysiaExtractor', () => {
  let extractor: ElysiaExtractor;
  let mockFs: ExtractorFsAdapter;
  let project: ProjectInfo;

  beforeEach(() => {
    extractor = new ElysiaExtractor();

    mockFs = {
      readFile: async () => FIXTURE_CONTENT,
      glob: async () => ['src/app.ts'],
      exists: async () => true,
    };

    extractor.setFs(mockFs);

    project = {
      rootPath: '/test-project',
      frameworks: [{ id: 'elysia', name: 'Elysia', confidence: 'high' }],
    };
  });

  it('should detect Elysia projects', async () => {
    const detected = await extractor.detect(project);
    expect(detected).toBe(true);
  });

  it('should not detect non-Elysia projects', async () => {
    const nonElysiaProject: ProjectInfo = {
      rootPath: '/other-project',
      frameworks: [{ id: 'express', name: 'Express', confidence: 'high' }],
    };
    const detected = await extractor.detect(nonElysiaProject);
    expect(detected).toBe(false);
  });

  it('should extract endpoints from chained routes', async () => {
    const result = await extractor.extract(project, {});

    expect(result.success).toBe(true);
    expect(result.success).toBe(true);
    expect(result.ir).toBeDefined();
    expect(result.ir?.endpoints.length).toBeGreaterThan(0);
  });

  it('should extract GET endpoints', async () => {
    const result = await extractor.extract(project, {});

    const getEndpoints =
      result.ir?.endpoints.filter((e) => e.method === 'GET') || [];
    expect(getEndpoints.length).toBeGreaterThanOrEqual(1);
    expect(getEndpoints.length).toBeGreaterThanOrEqual(1);
  });

  it('should extract POST endpoints', async () => {
    const result = await extractor.extract(project, {});

    const postEndpoints =
      result.ir?.endpoints.filter((e) => e.method === 'POST') || [];
    expect(postEndpoints.length).toBeGreaterThanOrEqual(1);
  });

  it('should extract PUT endpoints', async () => {
    const result = await extractor.extract(project, {});

    const putEndpoints =
      result.ir?.endpoints.filter((e) => e.method === 'PUT') || [];
    expect(putEndpoints.length).toBeGreaterThanOrEqual(1);
  });

  it('should extract DELETE endpoints', async () => {
    const result = await extractor.extract(project, {});

    const deleteEndpoints =
      result.ir?.endpoints.filter((e) => e.method === 'DELETE') || [];
    expect(deleteEndpoints.length).toBeGreaterThanOrEqual(1);
  });

  it('should assign correct kinds', async () => {
    const result = await extractor.extract(project, {});

    const getEndpoint = result.ir?.endpoints.find((e) => e.method === 'GET');
    expect(getEndpoint?.kind).toBe('query');

    const postEndpoint = result.ir?.endpoints.find((e) => e.method === 'POST');
    expect(postEndpoint?.kind).toBe('command');
  });

  it('should include source location', async () => {
    const result = await extractor.extract(project, {});

    const endpoints = result.ir?.endpoints || [];
    for (const endpoint of endpoints) {
      expect(endpoint.source.file).toBeDefined();
      expect(endpoint.source.startLine).toBeGreaterThan(0);
    }
  });
});
