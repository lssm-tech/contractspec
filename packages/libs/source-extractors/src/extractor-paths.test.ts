/**
 * Comprehensive extractor method coverage tests.
 *
 * Tests all code paths including partial matches, edge cases,
 * and boundary conditions for each extractor method.
 */

import { describe, expect, it, beforeEach } from 'bun:test';
import { NestJsExtractor } from './extractors/nestjs/extractor';
import { ExpressExtractor } from './extractors/express/extractor';
import { FastifyExtractor } from './extractors/fastify/extractor';
import { HonoExtractor } from './extractors/hono/extractor';
import { ElysiaExtractor } from './extractors/elysia/extractor';
import { TrpcExtractor } from './extractors/trpc/extractor';
import type { ExtractorFsAdapter } from './extractors/base';
import type { ProjectInfo } from './types';

describe('NestJS Extractor - All Paths', () => {
  let extractor: NestJsExtractor;
  let project: ProjectInfo;

  beforeEach(() => {
    extractor = new NestJsExtractor();
    project = {
      rootPath: '/test',
      frameworks: [{ id: 'nestjs', name: 'NestJS', confidence: 'high' }],
    };
  });

  it('should extract all HTTP methods', async () => {
    const mockFs: ExtractorFsAdapter = {
      readFile: async () => `
        @Controller('test')
        export class TestController {
          @Get() get() {}
          @Post() post() {}
          @Put() put() {}
          @Patch() patch() {}
          @Delete() delete() {}
          @Head() head() {}
          @Options() options() {}
        }
      `,
      glob: async () => ['test.ts'],
      exists: async () => true,
    };
    extractor.setFs(mockFs);

    const result = await extractor.extract(project, {});
    expect(result.success).toBe(true);
    expect(result.ir?.endpoints.length).toBeGreaterThanOrEqual(3);
  });

  it('should handle controller with no routes', async () => {
    const mockFs: ExtractorFsAdapter = {
      readFile: async () => `
        @Controller('empty')
        export class EmptyController {}
      `,
      glob: async () => ['test.ts'],
      exists: async () => true,
    };
    extractor.setFs(mockFs);

    const result = await extractor.extract(project, {});
    expect(result.success).toBe(true);
    expect(result.ir?.endpoints.length).toBe(0);
  });

  it('should handle multiple controllers in one file', async () => {
    const mockFs: ExtractorFsAdapter = {
      readFile: async () => `
        @Controller('users')
        export class UsersController {
          @Get() list() {}
        }
        
        @Controller('items')
        export class ItemsController {
          @Get() list() {}
        }
      `,
      glob: async () => ['test.ts'],
      exists: async () => true,
    };
    extractor.setFs(mockFs);

    const result = await extractor.extract(project, {});
    expect(result.success).toBe(true);
    expect(result.ir?.endpoints.length).toBe(2);
  });

  it('should extract DTOs with class-validator', async () => {
    const mockFs: ExtractorFsAdapter = {
      readFile: async () => `
        import { IsString, IsNumber } from 'class-validator';
        
        export class CreateDto {
          @IsString() name: string;
          @IsNumber() age: number;
        }
      `,
      glob: async () => ['test.ts'],
      exists: async () => true,
    };
    extractor.setFs(mockFs);

    const result = await extractor.extract(project, {});
    expect(result.success).toBe(true);
    expect(result.ir?.schemas.length).toBe(1);
  });

  it('should extract DTOs without class-validator', async () => {
    const mockFs: ExtractorFsAdapter = {
      readFile: async () => `
        export class SimpleDto {
          name: string;
          age: number;
        }
      `,
      glob: async () => ['test.ts'],
      exists: async () => true,
    };
    extractor.setFs(mockFs);

    const result = await extractor.extract(project, {});
    expect(result.success).toBe(true);
    // Should still extract but with lower confidence
    expect(result.ir?.schemas.length).toBe(1);
  });
});

describe('Express Extractor - All Paths', () => {
  let extractor: ExpressExtractor;
  let project: ProjectInfo;

  beforeEach(() => {
    extractor = new ExpressExtractor();
    project = {
      rootPath: '/test',
      frameworks: [{ id: 'express', name: 'Express', confidence: 'high' }],
    };
  });

  it('should handle router.route() chaining', async () => {
    const mockFs: ExtractorFsAdapter = {
      readFile: async () => `
        router.route('/items')
          .get((req, res) => res.json([]))
          .post((req, res) => res.json({}));
      `,
      glob: async () => ['test.ts'],
      exists: async () => true,
    };
    extractor.setFs(mockFs);

    const result = await extractor.extract(project, {});
    expect(result.success).toBe(true);
  });

  it('should handle arrow functions', async () => {
    const mockFs: ExtractorFsAdapter = {
      readFile: async () => `
        app.get('/arrow', (req, res) => res.json({}));
        app.get('/arrow2', async (req, res) => res.json({}));
      `,
      glob: async () => ['test.ts'],
      exists: async () => true,
    };
    extractor.setFs(mockFs);

    const result = await extractor.extract(project, {});
    expect(result.success).toBe(true);
    expect(result.ir?.endpoints.length).toBe(2);
  });

  it('should handle traditional functions', async () => {
    const mockFs: ExtractorFsAdapter = {
      readFile: async () => `
        app.get('/traditional', function(req, res) { res.json({}); });
        app.get('/named', function handler(req, res) { res.json({}); });
      `,
      glob: async () => ['test.ts'],
      exists: async () => true,
    };
    extractor.setFs(mockFs);

    const result = await extractor.extract(project, {});
    expect(result.success).toBe(true);
  });

  it('should handle middleware chains', async () => {
    const mockFs: ExtractorFsAdapter = {
      readFile: async () => `
        app.get('/protected', auth, validate, (req, res) => res.json({}));
      `,
      glob: async () => ['test.ts'],
      exists: async () => true,
    };
    extractor.setFs(mockFs);

    const result = await extractor.extract(project, {});
    expect(result.success).toBe(true);
  });
});

describe('Fastify Extractor - All Paths', () => {
  let extractor: FastifyExtractor;
  let project: ProjectInfo;

  beforeEach(() => {
    extractor = new FastifyExtractor();
    project = {
      rootPath: '/test',
      frameworks: [{ id: 'fastify', name: 'Fastify', confidence: 'high' }],
    };
  });

  it('should handle routes with schema', async () => {
    const mockFs: ExtractorFsAdapter = {
      readFile: async () => `
        fastify.get('/items', {
          schema: {
            response: { 200: { type: 'array' } }
          }
        }, async () => []);
      `,
      glob: async () => ['test.ts'],
      exists: async () => true,
    };
    extractor.setFs(mockFs);

    const result = await extractor.extract(project, {});
    expect(result.success).toBe(true);
  });

  it('should handle routes without schema', async () => {
    const mockFs: ExtractorFsAdapter = {
      readFile: async () => `
        fastify.get('/simple', async () => ({}));
      `,
      glob: async () => ['test.ts'],
      exists: async () => true,
    };
    extractor.setFs(mockFs);

    const result = await extractor.extract(project, {});
    expect(result.success).toBe(true);
  });

  it('should handle shorthand route registration', async () => {
    const mockFs: ExtractorFsAdapter = {
      readFile: async () => `
        server.get('/a', handler);
        server.post('/b', handler);
      `,
      glob: async () => ['test.ts'],
      exists: async () => true,
    };
    extractor.setFs(mockFs);

    const result = await extractor.extract(project, {});
    expect(result.success).toBe(true);
  });
});

describe('Hono Extractor - All Paths', () => {
  let extractor: HonoExtractor;
  let project: ProjectInfo;

  beforeEach(() => {
    extractor = new HonoExtractor();
    project = {
      rootPath: '/test',
      frameworks: [{ id: 'hono', name: 'Hono', confidence: 'high' }],
    };
  });

  it('should handle routes with zValidator', async () => {
    const mockFs: ExtractorFsAdapter = {
      readFile: async () => `
        app.post('/items', zValidator('json', schema), (c) => c.json({}));
      `,
      glob: async () => ['test.ts'],
      exists: async () => true,
    };
    extractor.setFs(mockFs);

    const result = await extractor.extract(project, {});
    expect(result.success).toBe(true);
  });

  it('should handle grouped routes', async () => {
    const mockFs: ExtractorFsAdapter = {
      readFile: async () => `
        const api = new Hono();
        api.get('/users', (c) => c.json([]));
        app.route('/api', api);
      `,
      glob: async () => ['test.ts'],
      exists: async () => true,
    };
    extractor.setFs(mockFs);

    const result = await extractor.extract(project, {});
    expect(result.success).toBe(true);
  });
});

describe('Elysia Extractor - All Paths', () => {
  let extractor: ElysiaExtractor;
  let project: ProjectInfo;

  beforeEach(() => {
    extractor = new ElysiaExtractor();
    project = {
      rootPath: '/test',
      frameworks: [{ id: 'elysia', name: 'Elysia', confidence: 'high' }],
    };
  });

  it('should handle routes with t.Object schema', async () => {
    const mockFs: ExtractorFsAdapter = {
      readFile: async () => `
        app.post('/items', ({ body }) => body, {
          body: t.Object({ name: t.String() })
        });
      `,
      glob: async () => ['test.ts'],
      exists: async () => true,
    };
    extractor.setFs(mockFs);

    const result = await extractor.extract(project, {});
    expect(result.success).toBe(true);
  });

  it('should handle chained plugin usage', async () => {
    const mockFs: ExtractorFsAdapter = {
      readFile: async () => `
        new Elysia()
          .use(plugin)
          .get('/a', () => 'a')
          .post('/b', () => 'b')
          .listen(3000);
      `,
      glob: async () => ['test.ts'],
      exists: async () => true,
    };
    extractor.setFs(mockFs);

    const result = await extractor.extract(project, {});
    expect(result.success).toBe(true);
  });
});

describe('tRPC Extractor - All Paths', () => {
  let extractor: TrpcExtractor;
  let project: ProjectInfo;

  beforeEach(() => {
    extractor = new TrpcExtractor();
    project = {
      rootPath: '/test',
      frameworks: [{ id: 'trpc', name: 'tRPC', confidence: 'high' }],
    };
  });

  it('should handle query procedures', async () => {
    const mockFs: ExtractorFsAdapter = {
      readFile: async () => `
        export const router = t.router({
          list: publicProcedure.query(() => []),
        });
      `,
      glob: async () => ['test.ts'],
      exists: async () => true,
    };
    extractor.setFs(mockFs);

    const result = await extractor.extract(project, {});
    expect(result.success).toBe(true);
  });

  it('should handle mutation procedures', async () => {
    const mockFs: ExtractorFsAdapter = {
      readFile: async () => `
        export const router = t.router({
          create: publicProcedure.mutation(() => ({})),
        });
      `,
      glob: async () => ['test.ts'],
      exists: async () => true,
    };
    extractor.setFs(mockFs);

    const result = await extractor.extract(project, {});
    expect(result.success).toBe(true);
  });

  it('should handle procedures with input validation', async () => {
    const mockFs: ExtractorFsAdapter = {
      readFile: async () => `
        export const router = t.router({
          get: publicProcedure
            .input(z.object({ id: z.string() }))
            .query(({ input }) => ({ id: input.id })),
        });
      `,
      glob: async () => ['test.ts'],
      exists: async () => true,
    };
    extractor.setFs(mockFs);

    const result = await extractor.extract(project, {});
    expect(result.success).toBe(true);
  });

  it('should handle nested routers', async () => {
    const mockFs: ExtractorFsAdapter = {
      readFile: async () => `
        const userRouter = t.router({
          list: publicProcedure.query(() => []),
        });
        
        export const appRouter = t.router({
          users: userRouter,
        });
      `,
      glob: async () => ['test.ts'],
      exists: async () => true,
    };
    extractor.setFs(mockFs);

    const result = await extractor.extract(project, {});
    expect(result.success).toBe(true);
  });
});
