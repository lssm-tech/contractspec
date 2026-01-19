/**
 * Unit tests for Fastify extractor.
 */

import { describe, expect, it, beforeEach } from 'bun:test';
import { FastifyExtractor } from './extractors/fastify/extractor';
import type { ExtractorFsAdapter } from './extractors/base';
import type { ProjectInfo } from './types';

const FIXTURE_CONTENT = `
import Fastify from 'fastify';

const server = Fastify();

server.get('/items', {
  schema: {
    response: {
      200: {
        type: 'array',
        items: { type: 'object' }
      }
    }
  }
}, async (request, reply) => {
  return [];
});

server.get('/items/:id', async (request, reply) => {
  return { id: request.params.id };
});

server.post('/items', {
  schema: {
    body: {
      type: 'object',
      properties: {
        name: { type: 'string' }
      }
    }
  }
}, async (request, reply) => {
  return { id: '1', ...request.body };
});

server.put('/items/:id', async (request, reply) => {
  return { success: true };
});

server.delete('/items/:id', async (request, reply) => {
  reply.code(204).send();
});
`;

describe('FastifyExtractor', () => {
  let extractor: FastifyExtractor;
  let mockFs: ExtractorFsAdapter;
  let project: ProjectInfo;

  beforeEach(() => {
    extractor = new FastifyExtractor();

    mockFs = {
      readFile: async () => FIXTURE_CONTENT,
      glob: async () => ['src/server.ts'],
      exists: async () => true,
    };

    extractor.setFs(mockFs);

    project = {
      rootPath: '/test-project',
      frameworks: [{ id: 'fastify', name: 'Fastify', confidence: 'high' }],
    };
  });

  it('should detect Fastify projects', async () => {
    const detected = await extractor.detect(project);
    expect(detected).toBe(true);
  });

  it('should not detect non-Fastify projects', async () => {
    const nonFastifyProject: ProjectInfo = {
      rootPath: '/other-project',
      frameworks: [{ id: 'express', name: 'Express', confidence: 'high' }],
    };
    const detected = await extractor.detect(nonFastifyProject);
    expect(detected).toBe(false);
  });

  it('should extract endpoints from routes', async () => {
    const result = await extractor.extract(project, {});

    expect(result.success).toBe(true);
    expect(result.ir).toBeDefined();
    expect(result.ir?.endpoints.length).toBeGreaterThan(0);
  });

  it('should extract GET endpoints', async () => {
    const result = await extractor.extract(project, {});

    const getEndpoints =
      result.ir?.endpoints.filter((e) => e.method === 'GET') || [];
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

  it('should assign correct operation kinds', async () => {
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
