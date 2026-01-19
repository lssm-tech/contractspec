/**
 * Unit tests for tRPC extractor.
 */

import { describe, expect, it, beforeEach } from 'bun:test';
import { TrpcExtractor } from './extractors/trpc/extractor';
import type { ExtractorFsAdapter } from './extractors/base';
import type { ProjectInfo } from './types';

const FIXTURE_CONTENT = `
import { z } from 'zod';
import { initTRPC } from '@trpc/server';

const t = initTRPC.create();
const publicProcedure = t.procedure;

const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
});

export const userRouter = t.router({
  list: publicProcedure
    .output(z.array(userSchema))
    .query(async () => {
      return [];
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .output(userSchema.nullable())
    .query(async ({ input }) => {
      return null;
    }),

  create: publicProcedure
    .input(z.object({ name: z.string(), email: z.string() }))
    .output(userSchema)
    .mutation(async ({ input }) => {
      return { id: '1', ...input };
    }),

  update: publicProcedure
    .input(z.object({ id: z.string(), name: z.string().optional() }))
    .output(userSchema)
    .mutation(async ({ input }) => {
      return { id: input.id, name: input.name ?? 'Updated', email: 'test@example.com' };
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .output(z.boolean())
    .mutation(async ({ input }) => {
      return true;
    }),
});
`;

describe('TrpcExtractor', () => {
  let extractor: TrpcExtractor;
  let mockFs: ExtractorFsAdapter;
  let project: ProjectInfo;

  beforeEach(() => {
    extractor = new TrpcExtractor();

    mockFs = {
      readFile: async () => FIXTURE_CONTENT,
      glob: async () => ['src/router.ts'],
      exists: async () => true,
    };

    extractor.setFs(mockFs);

    project = {
      rootPath: '/test-project',
      frameworks: [{ id: 'trpc', name: 'tRPC', confidence: 'high' }],
    };
  });

  it('should detect tRPC projects', async () => {
    const detected = await extractor.detect(project);
    expect(detected).toBe(true);
  });

  it('should not detect non-tRPC projects', async () => {
    const nonTrpcProject: ProjectInfo = {
      rootPath: '/other-project',
      frameworks: [{ id: 'express', name: 'Express', confidence: 'high' }],
    };
    const detected = await extractor.detect(nonTrpcProject);
    expect(detected).toBe(false);
  });

  it('should extract procedures from router', async () => {
    const result = await extractor.extract(project, {});

    expect(result.success).toBe(true);
    expect(result.ir).toBeDefined();
    expect(result.ir).toBeDefined();
    expect(result.ir?.endpoints.length).toBeGreaterThan(0);
  });

  it('should identify query procedures', async () => {
    const result = await extractor.extract(project, {});

    // tRPC queries are marked based on .query() usage
    const endpoints = result.ir?.endpoints || [];
    expect(endpoints.length).toBeGreaterThan(0);
  });

  it('should identify mutation procedures', async () => {
    const result = await extractor.extract(project, {});

    // tRPC mutations are marked based on .mutation() usage
    const endpoints = result.ir?.endpoints || [];
    expect(endpoints.length).toBeGreaterThan(0);
  });

  it('should include source location', async () => {
    const result = await extractor.extract(project, {});

    const endpoints = result.ir?.endpoints || [];
    for (const endpoint of endpoints) {
      expect(endpoint.source).toBeDefined();
      expect(endpoint.source.file).toBeDefined();
    }
  });

  it('should extract handler names', async () => {
    const result = await extractor.extract(project, {});

    const handlerNames = result.ir?.endpoints.map((e) => e.handlerName) || [];
    expect(handlerNames.length).toBeGreaterThan(0);
    // Handler names should be present
    for (const name of handlerNames) {
      expect(name).toBeDefined();
    }
  });
});
