/**
 * Unit tests for Zod schema extractor.
 */

import { describe, expect, it, beforeEach } from 'bun:test';
import { ZodSchemaExtractor } from './extractors/zod/extractor';
import type { ExtractorFsAdapter } from './extractors/base';
import type { ProjectInfo } from './types';

const FIXTURE_CONTENT = `
import { z } from 'zod';

export const userSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  email: z.string().email(),
  age: z.number().int().positive().optional(),
  role: z.enum(['admin', 'user', 'guest']),
});

export const createUserInput = z.object({
  name: z.string(),
  email: z.string().email(),
});

export type User = z.infer<typeof userSchema>;
export type CreateUserInput = z.infer<typeof createUserInput>;
`;

describe('ZodSchemaExtractor', () => {
  let extractor: ZodSchemaExtractor;
  let mockFs: ExtractorFsAdapter;
  let project: ProjectInfo;

  beforeEach(() => {
    extractor = new ZodSchemaExtractor();

    mockFs = {
      readFile: async () => FIXTURE_CONTENT,
      glob: async () => ['src/schemas.ts'],
      exists: async () => true,
    };

    extractor.setFs(mockFs);

    project = {
      rootPath: '/test-project',
      frameworks: [],
    };
  });

  it('should always detect as available', async () => {
    const detected = await extractor.detect(project);
    expect(detected).toBe(true);
  });

  it('should extract Zod schemas', async () => {
    const result = await extractor.extract(project, {});

    expect(result.success).toBe(true);
    expect(result.ir?.schemas.length).toBeGreaterThan(0);
  });

  it('should find userSchema', async () => {
    const result = await extractor.extract(project, {});

    const userSchema = result.ir?.schemas.find((s) => s.name === 'userSchema');
    expect(userSchema).toBeDefined();
  });

  it('should find createUserInput', async () => {
    const result = await extractor.extract(project, {});

    const schema = result.ir?.schemas.find((s) => s.name === 'createUserInput');
    expect(schema).toBeDefined();
  });

  it('should identify zod schema type', async () => {
    const result = await extractor.extract(project, {});

    const schemas = result.ir?.schemas || [];
    for (const schema of schemas) {
      expect(schema.schemaType).toBe('zod');
    }
  });

  it('should assign high confidence to Zod schemas', async () => {
    const result = await extractor.extract(project, {});

    const schemas = result.ir?.schemas || [];
    for (const schema of schemas) {
      expect(schema.confidence.level).toBe('high');
      expect(schema.confidence.reasons).toContain('explicit-schema');
    }
  });

  it('should include raw definition', async () => {
    const result = await extractor.extract(project, {});

    const userSchema = result.ir?.schemas.find((s) => s.name === 'userSchema');
    expect(userSchema?.rawDefinition).toBeDefined();
    expect(userSchema?.rawDefinition).toContain('z.object');
  });

  it('should include source location', async () => {
    const result = await extractor.extract(project, {});

    const schemas = result.ir?.schemas || [];
    for (const schema of schemas) {
      expect(schema.source.file).toBeDefined();
      expect(schema.source.startLine).toBeGreaterThan(0);
    }
  });
});
