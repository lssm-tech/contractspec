/**
 * Unit tests for Hono extractor.
 */

import { describe, expect, it, beforeEach } from 'bun:test';
import { HonoExtractor } from './extractors/hono/extractor';
import type { ExtractorFsAdapter } from './extractors/base';
import type { ProjectInfo } from './types';

const FIXTURE_CONTENT = `
import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';

const app = new Hono();

const createItemSchema = z.object({
  name: z.string(),
  quantity: z.number(),
});

app.get('/items', (c) => {
  return c.json([]);
});

app.get('/items/:id', (c) => {
  const id = c.req.param('id');
  return c.json({ id, name: 'Test' });
});

app.post('/items', zValidator('json', createItemSchema), (c) => {
  const data = c.req.valid('json');
  return c.json({ id: '1', ...data });
});

app.put('/items/:id', (c) => {
  return c.json({ success: true });
});

app.delete('/items/:id', (c) => {
  return c.body(null, 204);
});
`;

describe('HonoExtractor', () => {
  let extractor: HonoExtractor;
  let mockFs: ExtractorFsAdapter;
  let project: ProjectInfo;

  beforeEach(() => {
    extractor = new HonoExtractor();

    mockFs = {
      readFile: async () => FIXTURE_CONTENT,
      glob: async () => ['src/app.ts'],
      exists: async () => true,
    };

    extractor.setFs(mockFs);

    project = {
      rootPath: '/test-project',
      frameworks: [{ id: 'hono', name: 'Hono', confidence: 'high' }],
    };
  });

  it('should detect Hono projects', async () => {
    const detected = await extractor.detect(project);
    expect(detected).toBe(true);
  });

  it('should not detect non-Hono projects', async () => {
    const nonHonoProject: ProjectInfo = {
      rootPath: '/other-project',
      frameworks: [{ id: 'express', name: 'Express', confidence: 'high' }],
    };
    const detected = await extractor.detect(nonHonoProject);
    expect(detected).toBe(false);
  });

  it('should extract endpoints from routes', async () => {
    const result = await extractor.extract(project, {});

    expect(result.success).toBe(true);
    expect(result.ir).toBeDefined();
    expect(result.ir).toBeDefined();
    expect(result.ir?.endpoints.length).toBeGreaterThan(0);
  });

  it('should extract all HTTP methods', async () => {
    const result = await extractor.extract(project, {});

    const methods = result.ir?.endpoints.map((e) => e.method) || [];
    expect(methods).toContain('GET');
    expect(methods).toContain('POST');
    expect(methods).toContain('PUT');
    expect(methods).toContain('DELETE');
  });

  it('should assign query kind to GET endpoints', async () => {
    const result = await extractor.extract(project, {});

    const getEndpoint = result.ir?.endpoints.find((e) => e.method === 'GET');
    expect(getEndpoint?.kind).toBe('query');
  });

  it('should assign command kind to mutation endpoints', async () => {
    const result = await extractor.extract(project, {});

    const postEndpoint = result.ir?.endpoints.find((e) => e.method === 'POST');
    expect(postEndpoint?.kind).toBe('command');
  });

  it('should include source location for all endpoints', async () => {
    const result = await extractor.extract(project, {});

    const endpoints = result.ir?.endpoints || [];
    for (const endpoint of endpoints) {
      expect(endpoint.source).toBeDefined();
      expect(endpoint.source.file).toBeDefined();
    }
  });

  it('should extract correct paths', async () => {
    const result = await extractor.extract(project, {});

    const paths = result.ir?.endpoints.map((e) => e.path) || [];
    expect(paths).toContain('/items');
    expect(paths.some((p) => p.includes(':id'))).toBe(true);
  });
});
