/**
 * Integration tests for the source-extractors library.
 *
 * Tests the full extraction pipeline against fixture projects.
 */

import { describe, expect, it } from 'bun:test';
import { NestJsExtractor } from './extractors/nestjs/extractor';
import { ExpressExtractor } from './extractors/express/extractor';
import { TrpcExtractor } from './extractors/trpc/extractor';
import { detectFrameworksFromPackageJson } from './detect';
import { generateOperations, generateRegistry } from './codegen/index';
import type { ProjectInfo, ImportIR } from './types';
import type { ExtractorFsAdapter as BaseExtractorFsAdapter } from './extractors/base';

// Mock filesystem for integration tests
function createMockFs(files: Record<string, string>): BaseExtractorFsAdapter {
  return {
    readFile: async (path: string) => {
      const content =
        files[path] || files[path.replace(/^\/test-project\//, '')];
      if (!content) throw new Error(`File not found: ${path}`);
      return content;
    },
    glob: async (pattern: string) => {
      return Object.keys(files).filter((f) => {
        if (pattern.includes('**/*.ts')) return f.endsWith('.ts');
        return true;
      });
    },
    exists: async (path: string) => {
      return path in files || path.replace(/^\/test-project\//, '') in files;
    },
  };
}

describe('Integration: Full Pipeline', () => {
  describe('NestJS Project Extraction', () => {
    const nestjsFiles = {
      'src/users.controller.ts': `
import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsString()
  email: string;
}

@Controller('users')
export class UsersController {
  @Get()
  async getUsers() {
    return [];
  }

  @Get(':id')
  async getUser(@Param('id') id: string) {
    return { id };
  }

  @Post()
  async createUser(@Body() dto: CreateUserDto) {
    return { id: 'new', ...dto };
  }
}
      `,
      'package.json': JSON.stringify({
        dependencies: {
          '@nestjs/core': '^10.0.0',
          '@nestjs/common': '^10.0.0',
        },
      }),
    };

    it('should extract complete IR from NestJS project', async () => {
      const mockFs = createMockFs(nestjsFiles);
      const extractor = new NestJsExtractor();
      extractor.setFs(mockFs);

      const project: ProjectInfo = {
        rootPath: '/test-project',
        frameworks: [{ id: 'nestjs', name: 'NestJS', confidence: 'high' }],
      };

      const result = await extractor.extract(project, {});

      expect(result.success).toBe(true);
      expect(result.ir).toBeDefined();
      expect(result.ir).toBeDefined();
      expect(result.ir?.endpoints.length).toBe(3); // GET list, GET :id, POST
      expect(result.ir?.schemas.length).toBe(1); // CreateUserDto
    });

    it('should generate operations from IR', async () => {
      const mockFs = createMockFs(nestjsFiles);
      const extractor = new NestJsExtractor();
      extractor.setFs(mockFs);

      const project: ProjectInfo = {
        rootPath: '/test-project',
        frameworks: [{ id: 'nestjs', name: 'NestJS', confidence: 'high' }],
      };

      const result = await extractor.extract(project, {});
      if (!result.ir) throw new Error('IR extraction failed');
      const files = generateOperations(result.ir, {
        outputDir: './generated',
      });

      expect(files.length).toBe(3);
      for (const file of files) {
        expect(file.type).toBe('operation');
        // Each file contains either defineCommand or defineQuery
        const hasCommand = file.content.includes('defineCommand');
        const hasQuery = file.content.includes('defineQuery');
        expect(hasCommand || hasQuery).toBe(true);
      }
    });
  });

  describe('Express Project Extraction', () => {
    const expressFiles = {
      'src/routes.ts': `
import express from 'express';
import { z } from 'zod';

const app = express();

const itemSchema = z.object({
  name: z.string(),
  quantity: z.number(),
});

app.get('/items', async (req, res) => {
  res.json([]);
});

app.post('/items', async (req, res) => {
  const data = itemSchema.parse(req.body);
  res.json({ id: '1', ...data });
});

app.delete('/items/:id', async (req, res) => {
  res.status(204).send();
});
      `,
      'package.json': JSON.stringify({
        dependencies: {
          express: '^4.18.0',
        },
      }),
    };

    it('should extract complete IR from Express project', async () => {
      const mockFs = createMockFs(expressFiles);
      const extractor = new ExpressExtractor();
      extractor.setFs(mockFs);

      const project: ProjectInfo = {
        rootPath: '/test-project',
        frameworks: [{ id: 'express', name: 'Express', confidence: 'high' }],
      };

      const result = await extractor.extract(project, {});

      expect(result.success).toBe(true);
      expect(result.ir).toBeDefined();
      expect(result.ir?.endpoints.length).toBe(3);
    });
  });

  describe('tRPC Project Extraction', () => {
    const trpcFiles = {
      'src/router.ts': `
import { z } from 'zod';
import { initTRPC } from '@trpc/server';

const t = initTRPC.create();
const publicProcedure = t.procedure;

export const appRouter = t.router({
  getUser: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return { id: input.id, name: 'Test' };
    }),

  createUser: publicProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ input }) => {
      return { id: '1', name: input.name };
    }),
});
      `,
      'package.json': JSON.stringify({
        dependencies: {
          '@trpc/server': '^10.0.0',
        },
      }),
    };

    it('should extract tRPC procedures', async () => {
      const mockFs = createMockFs(trpcFiles);
      const extractor = new TrpcExtractor();
      extractor.setFs(mockFs);

      const project: ProjectInfo = {
        rootPath: '/test-project',
        frameworks: [{ id: 'trpc', name: 'tRPC', confidence: 'high' }],
      };

      const result = await extractor.extract(project, {});

      expect(result.success).toBe(true);
      expect(result.ir).toBeDefined();
      expect(result.ir?.endpoints.length).toBeGreaterThanOrEqual(1);

      // tRPC procedures are extracted with their types
      const endpoints = result.ir?.endpoints || [];
      expect(endpoints.length).toBeGreaterThan(0);
    });
  });

  describe('Multi-Framework Detection', () => {
    it('should detect multiple frameworks', () => {
      const result = detectFrameworksFromPackageJson({
        dependencies: {
          express: '^4.18.0',
          '@trpc/server': '^10.0.0',
          hono: '^3.0.0',
        },
      });

      expect(result.length).toBe(3);
      const ids = result.map((f) => f.id);
      expect(ids).toContain('express');
      expect(ids).toContain('trpc');
      expect(ids).toContain('hono');
    });
  });

  describe('Code Generation Pipeline', () => {
    it('should generate complete registry from endpoints', () => {
      const mockIR: ImportIR = {
        version: '1.0',
        extractedAt: new Date().toISOString(),
        project: {
          rootPath: '/test',
          frameworks: [],
        },
        endpoints: [
          {
            id: 'get.users',
            method: 'GET',
            path: '/users',
            kind: 'query',
            handlerName: 'getUsers',
            source: { file: 'test.ts', startLine: 1, endLine: 10 },
            confidence: { level: 'high', reasons: ['explicit-schema'] },
          },
          {
            id: 'post.users',
            method: 'POST',
            path: '/users',
            kind: 'command',
            handlerName: 'createUser',
            source: { file: 'test.ts', startLine: 11, endLine: 20 },
            confidence: { level: 'high', reasons: ['explicit-schema'] },
          },
        ],
        schemas: [],
        errors: [],
        events: [],
        ambiguities: [],
        stats: {
          filesScanned: 1,
          endpointsFound: 2,
          schemasFound: 0,
          errorsFound: 0,
          eventsFound: 0,
          ambiguitiesFound: 0,
          highConfidence: 2,
          mediumConfidence: 0,
          lowConfidence: 0,
        },
      };

      const operations = generateOperations(mockIR, { outputDir: './gen' });
      const registry = generateRegistry(operations);

      expect(operations.length).toBe(2);
      expect(registry.type).toBe('registry');
      expect(registry.content).toContain('OperationSpecRegistry');
      expect(registry.content).toContain('operationRegistry.register');
    });
  });
});
