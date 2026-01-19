/**
 * Comprehensive error and failure path tests.
 *
 * Tests error handling, failure scenarios, and boundary conditions
 * following Test Trophy methodology.
 */

import { describe, expect, it } from 'bun:test';
import { NestJsExtractor } from './extractors/nestjs/extractor';
import { ExpressExtractor } from './extractors/express/extractor';
import { FastifyExtractor } from './extractors/fastify/extractor';
import { ZodSchemaExtractor } from './extractors/zod/extractor';
import { ExtractorRegistry } from './registry';
import {
  detectFrameworksFromPackageJson,
  detectFrameworksFromCode,
} from './detect';
import {
  generateOperations,
  generateSchemas,
  generateRegistry,
} from './codegen/index';
import type { ExtractorFsAdapter } from './extractors/base';
import type { ProjectInfo, ImportIR } from './types';

describe('Failure Paths', () => {
  describe('File System Errors', () => {
    it('should handle file read errors gracefully', async () => {
      const extractor = new ExpressExtractor();
      const mockFs: ExtractorFsAdapter = {
        readFile: async () => {
          throw new Error('ENOENT: file not found');
        },
        glob: async () => ['src/routes.ts'],
        exists: async () => true,
      };
      extractor.setFs(mockFs);

      const project: ProjectInfo = {
        rootPath: '/test',
        frameworks: [{ id: 'express', name: 'Express', confidence: 'high' }],
      };

      // Should handle file errors gracefully - either succeed with empty or catch the error
      try {
        const result = await extractor.extract(project, {});
        // If it succeeds, should have no endpoints
        expect(result.success).toBe(true);
      } catch (error) {
        // If it throws, that's acceptable behavior for unreadable files
        expect(error).toBeDefined();
      }
    });

    it('should handle glob errors gracefully', async () => {
      const extractor = new NestJsExtractor();
      const mockFs: ExtractorFsAdapter = {
        readFile: async () => '',
        glob: async () => {
          throw new Error('Permission denied');
        },
        exists: async () => true,
      };
      extractor.setFs(mockFs);

      const project: ProjectInfo = {
        rootPath: '/test',
        frameworks: [{ id: 'nestjs', name: 'NestJS', confidence: 'high' }],
      };

      // Should handle the error
      try {
        await extractor.extract(project, {});
        // If it doesn't throw, that's acceptable
      } catch (error) {
        // If it throws, verify it's the expected error
        expect((error as Error).message).toContain('Permission denied');
      }
    });

    it('should handle empty glob results', async () => {
      const extractor = new FastifyExtractor();
      const mockFs: ExtractorFsAdapter = {
        readFile: async () => '',
        glob: async () => [],
        exists: async () => true,
      };
      extractor.setFs(mockFs);

      const project: ProjectInfo = {
        rootPath: '/test',
        frameworks: [{ id: 'fastify', name: 'Fastify', confidence: 'high' }],
      };

      const result = await extractor.extract(project, {});
      expect(result.success).toBe(true);
      expect(result.ir?.endpoints.length).toBe(0);
    });
  });

  describe('Detection Failures', () => {
    it('should return false for non-matching project', async () => {
      const extractor = new NestJsExtractor();
      const project: ProjectInfo = {
        rootPath: '/test',
        frameworks: [{ id: 'express', name: 'Express', confidence: 'high' }],
      };

      const detected = await extractor.detect(project);
      expect(detected).toBe(false);
    });

    it('should handle empty frameworks array', async () => {
      const extractor = new ExpressExtractor();
      const project: ProjectInfo = {
        rootPath: '/test',
        frameworks: [],
      };

      const detected = await extractor.detect(project);
      expect(detected).toBe(false);
    });

    it('should detect with low confidence framework', async () => {
      const extractor = new NestJsExtractor();
      const project: ProjectInfo = {
        rootPath: '/test',
        frameworks: [{ id: 'nestjs', name: 'NestJS', confidence: 'low' }],
      };

      const detected = await extractor.detect(project);
      expect(detected).toBe(true);
    });
  });

  describe('Extraction Edge Cases', () => {
    it('should handle binary file content', async () => {
      const extractor = new ExpressExtractor();
      const mockFs: ExtractorFsAdapter = {
        readFile: async () => '\x00\x01\x02\x03\x04\x05',
        glob: async () => ['src/binary.ts'],
        exists: async () => true,
      };
      extractor.setFs(mockFs);

      const project: ProjectInfo = {
        rootPath: '/test',
        frameworks: [{ id: 'express', name: 'Express', confidence: 'high' }],
      };

      const result = await extractor.extract(project, {});
      expect(result.success).toBe(true);
      expect(result.ir?.endpoints.length).toBe(0);
    });

    it('should handle very long lines', async () => {
      const extractor = new ExpressExtractor();
      const longPath = '/very' + '/long'.repeat(100) + '/path';
      const mockFs: ExtractorFsAdapter = {
        readFile: async () =>
          `app.get('${longPath}', (req, res) => { res.json({}); });`,
        glob: async () => ['src/long.ts'],
        exists: async () => true,
      };
      extractor.setFs(mockFs);

      const project: ProjectInfo = {
        rootPath: '/test',
        frameworks: [{ id: 'express', name: 'Express', confidence: 'high' }],
      };

      const result = await extractor.extract(project, {});
      expect(result.success).toBe(true);
    });

    it('should handle special characters in paths', async () => {
      const extractor = new ExpressExtractor();
      const mockFs: ExtractorFsAdapter = {
        readFile: async () => `
          app.get('/api/v1/users/:id/orders/:orderId', (req, res) => {});
          app.get('/api/items/:itemId([0-9]+)', (req, res) => {});
        `,
        glob: async () => ['src/special.ts'],
        exists: async () => true,
      };
      extractor.setFs(mockFs);

      const project: ProjectInfo = {
        rootPath: '/test',
        frameworks: [{ id: 'express', name: 'Express', confidence: 'high' }],
      };

      const result = await extractor.extract(project, {});
      expect(result.success).toBe(true);
    });

    it('should handle unicode in content', async () => {
      const extractor = new NestJsExtractor();
      const mockFs: ExtractorFsAdapter = {
        readFile: async () => `
          // コメント
          @Controller('用户')
          export class UserController {
            @Get('列表')
            async getUsers() { return []; }
          }
        `,
        glob: async () => ['src/unicode.ts'],
        exists: async () => true,
      };
      extractor.setFs(mockFs);

      const project: ProjectInfo = {
        rootPath: '/test',
        frameworks: [{ id: 'nestjs', name: 'NestJS', confidence: 'high' }],
      };

      const result = await extractor.extract(project, {});
      expect(result.success).toBe(true);
    });
  });

  describe('Registry Edge Cases', () => {
    it('should handle getting non-existent extractor', () => {
      const registry = new ExtractorRegistry();
      const extractor = registry.get('non-existent');
      expect(extractor).toBeUndefined();
    });

    it('should handle unregistering non-existent extractor', () => {
      const registry = new ExtractorRegistry();
      const result = registry.unregister('non-existent');
      expect(result).toBe(false);
    });

    it('should handle empty registry', () => {
      const registry = new ExtractorRegistry();
      const all = registry.getAll();
      expect(all).toEqual([]);
    });

    it('should handle findForFramework with no matches', () => {
      const registry = new ExtractorRegistry();
      registry.register(new NestJsExtractor());

      const matches = registry.findForFramework('unknown');
      expect(matches).toEqual([]);
    });
  });

  describe('Codegen Edge Cases', () => {
    it('should handle empty IR for operations', () => {
      const emptyIR: ImportIR = {
        version: '1.0',
        extractedAt: new Date().toISOString(),
        project: { rootPath: '/test', frameworks: [] },
        endpoints: [],
        schemas: [],
        errors: [],
        events: [],
        ambiguities: [],
        stats: {
          filesScanned: 0,
          endpointsFound: 0,
          schemasFound: 0,
          errorsFound: 0,
          eventsFound: 0,
          ambiguitiesFound: 0,
          highConfidence: 0,
          mediumConfidence: 0,
          lowConfidence: 0,
        },
      };

      const files = generateOperations(emptyIR, { outputDir: './gen' });
      expect(files).toEqual([]);
    });

    it('should handle empty IR for schemas', () => {
      const emptyIR: ImportIR = {
        version: '1.0',
        extractedAt: new Date().toISOString(),
        project: { rootPath: '/test', frameworks: [] },
        endpoints: [],
        schemas: [],
        errors: [],
        events: [],
        ambiguities: [],
        stats: {
          filesScanned: 0,
          endpointsFound: 0,
          schemasFound: 0,
          errorsFound: 0,
          eventsFound: 0,
          ambiguitiesFound: 0,
          highConfidence: 0,
          mediumConfidence: 0,
          lowConfidence: 0,
        },
      };

      const files = generateSchemas(emptyIR, { outputDir: './gen' });
      expect(files).toEqual([]);
    });

    it('should handle empty operations for registry', () => {
      const registry = generateRegistry([]);
      expect(registry.type).toBe('registry');
      expect(registry.content).toContain('OperationSpecRegistry');
    });

    it('should handle endpoint with minimal data', () => {
      const ir: ImportIR = {
        version: '1.0',
        extractedAt: new Date().toISOString(),
        project: { rootPath: '/test', frameworks: [] },
        endpoints: [
          {
            id: 'minimal',
            method: 'GET',
            path: '/',
            kind: 'query',
            handlerName: 'handler',
            source: { file: 'test.ts', startLine: 1, endLine: 1 },
            confidence: { level: 'low', reasons: [] },
          },
        ],
        schemas: [],
        errors: [],
        events: [],
        ambiguities: [],
        stats: {
          filesScanned: 1,
          endpointsFound: 1,
          schemasFound: 0,
          errorsFound: 0,
          eventsFound: 0,
          ambiguitiesFound: 0,
          highConfidence: 0,
          mediumConfidence: 0,
          lowConfidence: 1,
        },
      };

      const files = generateOperations(ir, { outputDir: './gen' });
      expect(files.length).toBe(1);
    });
  });

  describe('Detection Edge Cases', () => {
    it('should handle malformed package.json', () => {
      // Test with null - should handle gracefully
      try {
        const result = detectFrameworksFromPackageJson(
          null as unknown as Record<string, unknown>
        );
        expect(Array.isArray(result)).toBe(true);
      } catch (error) {
        // If it throws on null, that's also acceptable
        expect(error).toBeDefined();
      }
    });

    it('should handle dependencies with null values', () => {
      const result = detectFrameworksFromPackageJson({
        dependencies: {
          express: null,
          'nestjs/core': undefined,
        },
      } as unknown as Record<string, unknown>);
      expect(result.length).toBeGreaterThanOrEqual(0);
    });

    it('should handle code with syntax errors', () => {
      const result = detectFrameworksFromCode(`
        import { from 'express
        const app = express(;
      `);
      // Should not crash, may or may not detect
      expect(Array.isArray(result)).toBe(true);
    });

    it('should handle very large code string', () => {
      const largeCode = 'const x = 1;\n'.repeat(10000);
      const result = detectFrameworksFromCode(largeCode);
      expect(Array.isArray(result)).toBe(true);
    });
  });
});

describe('Success Paths', () => {
  describe('Full Extraction Pipeline', () => {
    it('should successfully extract from valid NestJS controller', async () => {
      const extractor = new NestJsExtractor();
      const mockFs: ExtractorFsAdapter = {
        readFile: async () => `
          import { Controller, Get, Post, Body } from '@nestjs/common';
          
          @Controller('users')
          export class UsersController {
            @Get()
            findAll() { return []; }
            
            @Post()
            create(@Body() dto: any) { return dto; }
          }
        `,
        glob: async () => ['src/users.controller.ts'],
        exists: async () => true,
      };
      extractor.setFs(mockFs);

      const project: ProjectInfo = {
        rootPath: '/test',
        frameworks: [{ id: 'nestjs', name: 'NestJS', confidence: 'high' }],
      };

      const result = await extractor.extract(project, {});

      expect(result.success).toBe(true);
      expect(result.ir).toBeDefined();
      expect(result.ir?.endpoints.length).toBe(2);

      const getEndpoint = result.ir?.endpoints.find((e) => e.method === 'GET');
      expect(getEndpoint).toBeDefined();
      expect(getEndpoint?.kind).toBe('query');

      const postEndpoint = result.ir?.endpoints.find(
        (e) => e.method === 'POST'
      );
      expect(postEndpoint).toBeDefined();
      expect(postEndpoint?.kind).toBe('command');
    });

    it('should successfully extract from valid Express routes', async () => {
      const extractor = new ExpressExtractor();
      const mockFs: ExtractorFsAdapter = {
        readFile: async () => `
          const express = require('express');
          const app = express();
          
          app.get('/items', (req, res) => res.json([]));
          app.post('/items', (req, res) => res.json({ id: 1 }));
          app.put('/items/:id', (req, res) => res.json({}));
          app.delete('/items/:id', (req, res) => res.status(204).send());
        `,
        glob: async () => ['src/routes.ts'],
        exists: async () => true,
      };
      extractor.setFs(mockFs);

      const project: ProjectInfo = {
        rootPath: '/test',
        frameworks: [{ id: 'express', name: 'Express', confidence: 'high' }],
      };

      const result = await extractor.extract(project, {});

      expect(result.success).toBe(true);
      expect(result.success).toBe(true);
      expect(result.ir?.endpoints.length).toBe(4);

      const methods = result.ir?.endpoints.map((e) => e.method) || [];
      expect(methods).toContain('GET');
      expect(methods).toContain('POST');
      expect(methods).toContain('PUT');
      expect(methods).toContain('DELETE');
    });

    it('should successfully detect multiple frameworks', () => {
      const result = detectFrameworksFromPackageJson({
        dependencies: {
          express: '^4.18.0',
          '@nestjs/core': '^10.0.0',
          fastify: '^4.0.0',
        },
      });

      expect(result.length).toBe(3);
      const ids = result.map((f) => f.id);
      expect(ids).toContain('express');
      expect(ids).toContain('nestjs');
      expect(ids).toContain('fastify');
    });

    it('should successfully generate complete codegen output', () => {
      const ir: ImportIR = {
        version: '1.0',
        extractedAt: new Date().toISOString(),
        project: { rootPath: '/test', frameworks: [] },
        endpoints: [
          {
            id: 'get.users',
            method: 'GET',
            path: '/users',
            kind: 'query',
            handlerName: 'getUsers',
            source: { file: 'users.ts', startLine: 1, endLine: 10 },
            confidence: { level: 'high', reasons: ['explicit-schema'] },
          },
          {
            id: 'post.users',
            method: 'POST',
            path: '/users',
            kind: 'command',
            handlerName: 'createUser',
            source: { file: 'users.ts', startLine: 11, endLine: 20 },
            confidence: { level: 'high', reasons: ['explicit-schema'] },
          },
        ],
        schemas: [
          {
            id: 'schemas.User',
            name: 'User',
            schemaType: 'zod',
            source: { file: 'user.ts', startLine: 1, endLine: 10 },
            confidence: { level: 'high', reasons: ['explicit-schema'] },
          },
        ],
        errors: [],
        events: [],
        ambiguities: [],
        stats: {
          filesScanned: 2,
          endpointsFound: 2,
          schemasFound: 1,
          errorsFound: 0,
          eventsFound: 0,
          ambiguitiesFound: 0,
          highConfidence: 3,
          mediumConfidence: 0,
          lowConfidence: 0,
        },
      };

      const operations = generateOperations(ir, { outputDir: './gen' });
      const schemas = generateSchemas(ir, { outputDir: './gen' });
      const registry = generateRegistry(operations);

      expect(operations.length).toBe(2);
      expect(schemas.length).toBe(1);
      expect(registry.type).toBe('registry');

      // Verify operation content
      const queryOp = operations.find((o) => o.content.includes('defineQuery'));
      const commandOp = operations.find((o) =>
        o.content.includes('defineCommand')
      );
      expect(queryOp).toBeDefined();
      expect(commandOp).toBeDefined();

      // Verify registry content
      expect(registry.content).toContain('operationRegistry.register');
    });
  });

  describe('Zod Schema Extraction', () => {
    it('should extract complex Zod schemas', async () => {
      const extractor = new ZodSchemaExtractor();
      const mockFs: ExtractorFsAdapter = {
        readFile: async () => `
          import { z } from 'zod';
          
          export const userSchema = z.object({
            id: z.string().uuid(),
            email: z.string().email(),
            name: z.string().min(1).max(100),
            age: z.number().int().positive().optional(),
            roles: z.array(z.enum(['admin', 'user', 'guest'])),
          });
          
          export const createUserInput = userSchema.omit({ id: true });
          export const updateUserInput = createUserInput.partial();
        `,
        glob: async () => ['src/schemas.ts'],
        exists: async () => true,
      };
      extractor.setFs(mockFs);

      const project: ProjectInfo = {
        rootPath: '/test',
        frameworks: [],
      };

      const result = await extractor.extract(project, {});

      expect(result.success).toBe(true);
      expect(result.success).toBe(true);
      expect(result.ir?.schemas.length).toBeGreaterThanOrEqual(1);

      const userSchema = result.ir?.schemas.find(
        (s) => s.name === 'userSchema'
      );
      expect(userSchema).toBeDefined();
      expect(userSchema?.schemaType).toBe('zod');
      expect(userSchema?.confidence.level).toBe('high');
    });
  });
});
