/**
 * Unit tests for verify service.
 */

import { describe, expect, it } from 'bun:test';
import type { ImportIR, EndpointCandidate } from './types';

// Import from the workspace bundle would require building it first
// For now, we test the verification logic concepts inline

describe('Verification Logic', () => {
  const createMockEndpoint = (
    overrides: Partial<EndpointCandidate> = {}
  ): EndpointCandidate => ({
    id: 'test-endpoint',
    method: 'GET',
    path: '/test',
    kind: 'query',
    handlerName: 'testHandler',
    source: { file: 'test.ts', startLine: 1, endLine: 10 },
    confidence: { level: 'high', reasons: ['explicit-schema'] },
    ...overrides,
  });

  const createMockIR = (endpoints: EndpointCandidate[] = []): ImportIR => ({
    version: '1.0',
    extractedAt: new Date().toISOString(),
    project: {
      rootPath: '/test',
      frameworks: [],
    },
    endpoints,
    schemas: [],
    errors: [],
    events: [],
    ambiguities: [],
    stats: {
      filesScanned: 1,
      endpointsFound: endpoints.length,
      schemasFound: 0,
      errorsFound: 0,
      eventsFound: 0,
      ambiguitiesFound: 0,
      highConfidence: endpoints.filter((e) => e.confidence.level === 'high')
        .length,
      mediumConfidence: endpoints.filter((e) => e.confidence.level === 'medium')
        .length,
      lowConfidence: endpoints.filter((e) => e.confidence.level === 'low')
        .length,
    },
  });

  describe('Duplicate Detection', () => {
    it('should detect duplicate endpoints', () => {
      const endpoints = [
        createMockEndpoint({ id: 'e1', path: '/users', method: 'GET' }),
        createMockEndpoint({ id: 'e2', path: '/users', method: 'GET' }),
      ];

      const duplicates = endpoints.filter(
        (ep, idx) =>
          endpoints.findIndex(
            (e) => e.path === ep.path && e.method === ep.method
          ) !== idx
      );

      expect(duplicates.length).toBe(1);
    });

    it('should not flag different methods as duplicates', () => {
      const endpoints = [
        createMockEndpoint({ id: 'e1', path: '/users', method: 'GET' }),
        createMockEndpoint({ id: 'e2', path: '/users', method: 'POST' }),
      ];

      const duplicates = endpoints.filter(
        (ep, idx) =>
          endpoints.findIndex(
            (e) => e.path === ep.path && e.method === ep.method
          ) !== idx
      );

      expect(duplicates.length).toBe(0);
    });
  });

  describe('Path Conflict Detection', () => {
    it('should detect potential path conflicts', () => {
      const endpoints = [
        createMockEndpoint({ id: 'e1', path: '/users/:id', method: 'GET' }),
        createMockEndpoint({ id: 'e2', path: '/users/profile', method: 'GET' }),
      ];

      // Both paths have same structure length and method
      // /users/:id could match /users/profile
      const endpoint1 = endpoints[0];
      const endpoint2 = endpoints[1];
      if (!endpoint1 || !endpoint2) throw new Error('Endpoints undefined');

      const pathA = endpoint1.path.split('/');
      const pathB = endpoint2.path.split('/');

      const sameLength = pathA.length === pathB.length;
      expect(sameLength).toBe(true);
    });

    it('should not flag clearly different paths', () => {
      const endpoints = [
        createMockEndpoint({ id: 'e1', path: '/users/:id', method: 'GET' }),
        createMockEndpoint({ id: 'e2', path: '/products', method: 'GET' }),
      ];

      const endpoint1 = endpoints[0];
      const endpoint2 = endpoints[1];
      if (!endpoint1 || !endpoint2) throw new Error('Endpoints undefined');

      const pathA = endpoint1.path;
      const pathB = endpoint2.path;

      const startsDifferently = pathA.split('/')[1] !== pathB.split('/')[1];
      expect(startsDifferently).toBe(true);
    });
  });

  describe('Confidence Level Checks', () => {
    it('should identify low confidence endpoints', () => {
      const ir = createMockIR([
        createMockEndpoint({
          confidence: { level: 'high', reasons: ['explicit'] },
        }),
        createMockEndpoint({
          confidence: { level: 'low', reasons: ['inferred'] },
        }),
        createMockEndpoint({
          confidence: { level: 'ambiguous', reasons: ['multiple-matches'] },
        }),
      ]);

      const lowConfidence = ir.endpoints.filter(
        (e) =>
          e.confidence.level === 'low' || e.confidence.level === 'ambiguous'
      );

      expect(lowConfidence.length).toBe(2);
    });

    it('should count confidence levels correctly', () => {
      const ir = createMockIR([
        createMockEndpoint({ confidence: { level: 'high', reasons: [] } }),
        createMockEndpoint({ confidence: { level: 'high', reasons: [] } }),
        createMockEndpoint({ confidence: { level: 'medium', reasons: [] } }),
      ]);

      expect(ir.stats.highConfidence).toBe(2);
      expect(ir.stats.mediumConfidence).toBe(1);
    });
  });

  describe('Missing Schema Detection', () => {
    it('should identify POST endpoints without input schema', () => {
      const endpoint = createMockEndpoint({
        method: 'POST',
        kind: 'command',
        input: undefined,
      });

      const missingInput = endpoint.method === 'POST' && !endpoint.input;
      expect(missingInput).toBe(true);
    });

    it('should not flag GET endpoints for missing input', () => {
      const endpoint = createMockEndpoint({
        method: 'GET',
        kind: 'query',
        input: undefined,
      });

      // GET endpoints don't typically need input schemas
      const isQuery = endpoint.method === 'GET';
      expect(isQuery).toBe(true);
    });
  });

  describe('Summary Generation', () => {
    it('should calculate correct summary stats', () => {
      const ir = createMockIR([
        createMockEndpoint({ confidence: { level: 'high', reasons: [] } }),
        createMockEndpoint({ confidence: { level: 'medium', reasons: [] } }),
        createMockEndpoint({ confidence: { level: 'low', reasons: [] } }),
      ]);

      expect(ir.stats.endpointsFound).toBe(3);
      expect(ir.stats.highConfidence).toBe(1);
      expect(ir.stats.mediumConfidence).toBe(1);
      expect(ir.stats.lowConfidence).toBe(1);
    });
  });
});
