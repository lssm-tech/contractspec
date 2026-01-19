/**
 * Unit tests for codegen module.
 */

import { describe, expect, it } from 'bun:test';
import {
  generateOperations,
  generateSchemas,
  generateRegistry,
} from './codegen/index';
import type { ImportIR } from './types';

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
      confidence: { level: 'medium', reasons: ['decorator-hints'] },
    },
  ],
  schemas: [
    {
      id: 'schemas.UserDto',
      name: 'UserDto',
      schemaType: 'zod',
      source: { file: 'dto.ts', startLine: 1, endLine: 10 },
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
    highConfidence: 2,
    mediumConfidence: 1,
    lowConfidence: 0,
  },
};

describe('Code Generation', () => {
  describe('generateOperations', () => {
    it('should generate operation files for each endpoint', () => {
      const files = generateOperations(mockIR, { outputDir: './gen' });

      expect(files.length).toBe(2);
      expect(files.every((f) => f.type === 'operation')).toBe(true);
    });

    it('should generate defineQuery for GET endpoints', () => {
      const files = generateOperations(mockIR, { outputDir: './gen' });
      const getFile = files.find((f) => f.path.includes('get-'));

      expect(getFile).toBeDefined();
      expect(getFile?.content).toContain('defineQuery');
    });

    it('should generate defineCommand for POST endpoints', () => {
      const files = generateOperations(mockIR, { outputDir: './gen' });
      const postFile = files.find((f) => f.path.includes('post-'));

      expect(postFile).toBeDefined();
      expect(postFile?.content).toContain('defineCommand');
    });

    it('should include source location comments', () => {
      const files = generateOperations(mockIR, { outputDir: './gen' });

      for (const file of files) {
        expect(file.content).toContain('Generated from:');
      }
    });

    it('should include REST transport hints', () => {
      const files = generateOperations(mockIR, { outputDir: './gen' });

      for (const file of files) {
        expect(file.content).toContain('transport:');
        expect(file.content).toContain('rest:');
      }
    });
  });

  describe('generateSchemas', () => {
    it('should generate schema files', () => {
      const files = generateSchemas(mockIR, { outputDir: './gen' });

      expect(files.length).toBe(1);
      expect(files[0]?.type).toBe('schema');
    });

    it('should use fromZod helper', () => {
      const files = generateSchemas(mockIR, { outputDir: './gen' });

      expect(files[0]?.content).toContain('fromZod');
    });

    it('should include schema type in comments', () => {
      const files = generateSchemas(mockIR, { outputDir: './gen' });

      expect(files[0]?.content).toContain('Schema type: zod');
    });
  });

  describe('generateRegistry', () => {
    it('should generate registry file', () => {
      const operations = generateOperations(mockIR, { outputDir: './gen' });
      const registry = generateRegistry(operations);

      expect(registry.type).toBe('registry');
      expect(registry.path).toBe('registry.ts');
    });

    it('should import all operations', () => {
      const operations = generateOperations(mockIR, { outputDir: './gen' });
      const registry = generateRegistry(operations);

      expect(registry.content).toContain('import {');
    });

    it('should register all operations', () => {
      const operations = generateOperations(mockIR, { outputDir: './gen' });
      const registry = generateRegistry(operations);

      const registerCount = (
        registry.content.match(/operationRegistry\.register/g) || []
      ).length;
      expect(registerCount).toBe(operations.length);
    });

    it('should export the registry', () => {
      const operations = generateOperations(mockIR, { outputDir: './gen' });
      const registry = generateRegistry(operations);

      expect(registry.content).toContain('export const operationRegistry');
    });
  });
});
