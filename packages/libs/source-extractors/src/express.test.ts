/**
 * Unit tests for Express extractor.
 */

import { describe, expect, it, beforeEach } from 'bun:test';
import { ExpressExtractor } from './extractors/express/extractor';
import type { ExtractorFsAdapter } from './extractors/base';
import type { ProjectInfo } from './types';

const FIXTURE_CONTENT = `
import express from 'express';
import { z } from 'zod';

const app = express();

const createProductSchema = z.object({
  name: z.string(),
  price: z.number().positive(),
});

app.get('/products', async (req, res) => {
  res.json([]);
});

app.get('/products/:id', async (req, res) => {
  const { id } = req.params;
  res.json({ id, name: 'Test' });
});

app.post('/products', async (req, res) => {
  const data = createProductSchema.parse(req.body);
  res.json({ id: 'new-id', ...data });
});

app.put('/products/:id', async (req, res) => {
  res.json({});
});

app.delete('/products/:id', async (req, res) => {
  res.status(204).send();
});
`;

describe('ExpressExtractor', () => {
  let extractor: ExpressExtractor;
  let mockFs: ExtractorFsAdapter;
  let project: ProjectInfo;

  beforeEach(() => {
    extractor = new ExpressExtractor();

    mockFs = {
      readFile: async () => FIXTURE_CONTENT,
      glob: async () => ['src/products.ts'],
      exists: async () => true,
    };

    extractor.setFs(mockFs);

    project = {
      rootPath: '/test-project',
      frameworks: [{ id: 'express', name: 'Express', confidence: 'high' }],
    };
  });

  it('should detect Express projects', async () => {
    const detected = await extractor.detect(project);
    expect(detected).toBe(true);
  });

  it('should extract GET endpoints', async () => {
    const result = await extractor.extract(project, {});

    expect(result.success).toBe(true);
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

  it('should assign command kind to POST/PUT/DELETE', async () => {
    const result = await extractor.extract(project, {});

    const postEndpoint = result.ir?.endpoints.find((e) => e.method === 'POST');
    expect(postEndpoint?.kind).toBe('command');

    const putEndpoint = result.ir?.endpoints.find((e) => e.method === 'PUT');
    expect(putEndpoint?.kind).toBe('command');
  });

  it('should assign query kind to GET', async () => {
    const result = await extractor.extract(project, {});

    const getEndpoint = result.ir?.endpoints.find((e) => e.method === 'GET');
    expect(getEndpoint?.kind).toBe('query');
  });
});
