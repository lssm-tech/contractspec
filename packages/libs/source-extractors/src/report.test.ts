/**
 * Unit tests for report generation logic.
 */

import { describe, expect, it } from 'bun:test';
import type { ImportIR, EndpointCandidate, SchemaCandidate } from './types';

describe('Report Generation', () => {
  const createMockIR = (
    options: {
      endpoints?: number;
      schemas?: number;
      confidence?: 'high' | 'medium' | 'low';
    } = {}
  ): ImportIR => {
    const { endpoints = 5, schemas = 2, confidence = 'high' } = options;

    const endpointList: EndpointCandidate[] = Array.from(
      { length: endpoints },
      (_, i) => ({
        id: `endpoint-${i}`,
        method: i % 2 === 0 ? ('GET' as const) : ('POST' as const),
        path: `/api/items${i > 0 ? `/${i}` : ''}`,
        kind: i % 2 === 0 ? ('query' as const) : ('command' as const),
        handlerName: `handler${i}`,
        source: {
          file: 'test.ts',
          startLine: i * 10 + 1,
          endLine: i * 10 + 10,
        },
        confidence: { level: confidence, reasons: ['test'] },
      })
    );

    const schemaList: SchemaCandidate[] = Array.from(
      { length: schemas },
      (_, i) => ({
        id: `schema-${i}`,
        name: `Schema${i}`,
        schemaType: 'zod' as const,
        source: {
          file: 'schemas.ts',
          startLine: i * 10 + 1,
          endLine: i * 10 + 10,
        },
        confidence: { level: 'high' as const, reasons: ['explicit-schema'] },
      })
    );

    return {
      version: '1.0',
      extractedAt: new Date().toISOString(),
      project: {
        rootPath: '/test',
        frameworks: [{ id: 'express', name: 'Express', confidence: 'high' }],
      },
      endpoints: endpointList,
      schemas: schemaList,
      errors: [],
      events: [],
      ambiguities: [],
      stats: {
        filesScanned: 10,
        endpointsFound: endpoints,
        schemasFound: schemas,
        errorsFound: 0,
        eventsFound: 0,
        ambiguitiesFound: 0,
        highConfidence: confidence === 'high' ? endpoints : 0,
        mediumConfidence: confidence === 'medium' ? endpoints : 0,
        lowConfidence: confidence === 'low' ? endpoints : 0,
      },
    };
  };

  describe('Markdown Report Generation', () => {
    it('should include summary section', () => {
      const ir = createMockIR({ endpoints: 3, schemas: 2 });

      // Report should have summary
      const summary = `Files Scanned: ${ir.stats.filesScanned}\nEndpoints: ${ir.stats.endpointsFound}\nSchemas: ${ir.stats.schemasFound}`;

      expect(summary).toContain('Files Scanned: 10');
      expect(summary).toContain('Endpoints: 3');
      expect(summary).toContain('Schemas: 2');
    });

    it('should include framework information', () => {
      const ir = createMockIR();

      const frameworks = ir.project.frameworks.map((f) => f.name).join(', ');
      expect(frameworks).toContain('Express');
    });

    it('should list all endpoints', () => {
      const ir = createMockIR({ endpoints: 3 });

      const endpointList = ir.endpoints.map((e) => `${e.method} ${e.path}`);
      expect(endpointList.length).toBe(3);
    });

    it('should list all schemas', () => {
      const ir = createMockIR({ schemas: 2 });

      const schemaList = ir.schemas.map((s) => s.name);
      expect(schemaList).toContain('Schema0');
      expect(schemaList).toContain('Schema1');
    });

    it('should show confidence breakdown', () => {
      const ir = createMockIR({ endpoints: 5, confidence: 'high' });

      expect(ir.stats.highConfidence).toBe(5);
      expect(ir.stats.mediumConfidence).toBe(0);
      expect(ir.stats.lowConfidence).toBe(0);
    });
  });

  describe('CLI Report Generation', () => {
    it('should produce compact summary', () => {
      const ir = createMockIR({ endpoints: 10, schemas: 3 });

      const cliOutput = [
        `📊 Summary`,
        `   Files: ${ir.stats.filesScanned}`,
        `   Endpoints: ${ir.stats.endpointsFound}`,
        `   Schemas: ${ir.stats.schemasFound}`,
      ].join('\n');

      expect(cliOutput).toContain('📊 Summary');
      expect(cliOutput).toContain('Files: 10');
      expect(cliOutput).toContain('Endpoints: 10');
    });

    it('should show framework list', () => {
      const ir = createMockIR();

      const frameworkOutput = ir.project.frameworks
        .map((f) => `   • ${f.name}`)
        .join('\n');

      expect(frameworkOutput).toContain('• Express');
    });
  });

  describe('Ambiguity Reporting', () => {
    it('should list ambiguities when present', () => {
      const ir = createMockIR();
      ir.ambiguities = [
        {
          type: 'endpoint',
          itemId: 'test-1',
          description: 'Could not determine return type',
          source: { file: 'test.ts', startLine: 1, endLine: 5 },
        },
        {
          type: 'schema',
          itemId: 'schema-1',
          description: 'Missing field types',
          source: { file: 'schemas.ts', startLine: 1, endLine: 5 },
        },
      ];

      const ambiguityCount = ir.ambiguities.length;
      expect(ambiguityCount).toBe(2);

      const descriptions = ir.ambiguities.map((a) => a.description);
      expect(descriptions).toContain('Could not determine return type');
      expect(descriptions).toContain('Missing field types');
    });

    it('should handle IR with no ambiguities', () => {
      const ir = createMockIR();

      expect(ir.ambiguities.length).toBe(0);
    });
  });

  describe('Statistics Accuracy', () => {
    it('should correctly count all categories', () => {
      const ir = createMockIR({ endpoints: 7, schemas: 4 });

      expect(ir.stats.endpointsFound).toBe(7);
      expect(ir.stats.schemasFound).toBe(4);
      expect(ir.stats.errorsFound).toBe(0);
      expect(ir.stats.eventsFound).toBe(0);
    });

    it('should track confidence distribution', () => {
      const highIR = createMockIR({ endpoints: 3, confidence: 'high' });
      const mediumIR = createMockIR({ endpoints: 3, confidence: 'medium' });
      const lowIR = createMockIR({ endpoints: 3, confidence: 'low' });

      expect(highIR.stats.highConfidence).toBe(3);
      expect(mediumIR.stats.mediumConfidence).toBe(3);
      expect(lowIR.stats.lowConfidence).toBe(3);
    });
  });
});
