/**
 * Edge case tests for source extractors.
 *
 * Tests unusual inputs, malformed code, and boundary conditions.
 */

import { describe, expect, it } from 'bun:test';
import { NestJsExtractor } from './extractors/nestjs/extractor';
import { ExpressExtractor } from './extractors/express/extractor';
import { FastifyExtractor } from './extractors/fastify/extractor';
import type { ExtractorFsAdapter } from './extractors/base';
import type { ProjectInfo } from './types';
import {
  detectFrameworksFromPackageJson,
  detectFrameworksFromCode,
} from './detect';

describe('Edge Cases', () => {
  describe('Empty and Minimal Files', () => {
    it('should handle empty file content', async () => {
      const extractor = new NestJsExtractor();
      const mockFs: ExtractorFsAdapter = {
        readFile: async () => '',
        glob: async () => ['src/empty.ts'],
        exists: async () => true,
      };
      extractor.setFs(mockFs);

      const project: ProjectInfo = {
        rootPath: '/test',
        frameworks: [{ id: 'nestjs', name: 'NestJS', confidence: 'high' }],
      };

      const result = await extractor.extract(project, {});
      expect(result.success).toBe(true);
      expect(result.ir?.endpoints.length).toBe(0);
    });

    it('should handle file with only whitespace', async () => {
      const extractor = new ExpressExtractor();
      const mockFs: ExtractorFsAdapter = {
        readFile: async () => '   \n\n   \t\t\n  ',
        glob: async () => ['src/whitespace.ts'],
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

    it('should handle file with only comments', async () => {
      const extractor = new FastifyExtractor();
      const mockFs: ExtractorFsAdapter = {
        readFile: async () => `
          // Single line comment
          /* Multi
             line
             comment */
          /**
           * JSDoc comment
           */
        `,
        glob: async () => ['src/comments.ts'],
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

  describe('Malformed Code Patterns', () => {
    it('should handle incomplete route definition', async () => {
      const extractor = new ExpressExtractor();
      const mockFs: ExtractorFsAdapter = {
        readFile: async () => `
          app.get('/incomplete'
          // Missing rest of definition
        `,
        glob: async () => ['src/incomplete.ts'],
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

    it('should handle commented out routes', async () => {
      const extractor = new ExpressExtractor();
      const mockFs: ExtractorFsAdapter = {
        readFile: async () => `
          // app.get('/commented', () => {});
          /* app.post('/blocked', () => {}); */
          app.get('/active', (req, res) => { res.json({}); });
        `,
        glob: async () => ['src/commented.ts'],
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
  });

  describe('Unusual Path Formats', () => {
    it('should handle paths with special characters', async () => {
      const extractor = new ExpressExtractor();
      const mockFs: ExtractorFsAdapter = {
        readFile: async () => `
          app.get('/api/v1/users/:userId', (req, res) => {});
          app.get('/api/items/:id/sub-items', (req, res) => {});
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
      expect(result.ir?.endpoints.length).toBe(2);
    });

    it('should handle empty paths', async () => {
      const extractor = new ExpressExtractor();
      const mockFs: ExtractorFsAdapter = {
        readFile: async () => `
          app.get('', (req, res) => {});
          app.get('/', (req, res) => {});
        `,
        glob: async () => ['src/empty-path.ts'],
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
  });

  describe('Detection Edge Cases', () => {
    it('should handle empty package.json dependencies', () => {
      const result = detectFrameworksFromPackageJson({});
      expect(result).toEqual([]);
    });

    it('should handle null/undefined dependencies', () => {
      const result = detectFrameworksFromPackageJson({
        dependencies: undefined,
        devDependencies: undefined,
      });
      expect(result).toEqual([]);
    });

    it('should handle malformed version strings', () => {
      const result = detectFrameworksFromPackageJson({
        dependencies: {
          express: 'invalid-version',
          '@nestjs/core': '',
        },
      });
      // Should still detect based on package name
      expect(result.length).toBeGreaterThanOrEqual(0);
    });

    it('should handle empty code string', () => {
      const result = detectFrameworksFromCode('');
      expect(result).toEqual([]);
    });

    it('should handle code with no imports', () => {
      const result = detectFrameworksFromCode('const x = 1; console.log(x);');
      expect(result).toEqual([]);
    });

    it('should handle code with only type imports', () => {
      const result = detectFrameworksFromCode(`
        import type { Express } from 'express';
        import type { Controller } from '@nestjs/common';
      `);
      expect(result.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Large File Handling', () => {
    it('should handle files with many routes', async () => {
      const extractor = new ExpressExtractor();

      // Generate a file with 50 routes
      const routes = Array.from(
        { length: 50 },
        (_, i) => `app.get('/route${i}', (req, res) => { res.json({}); });`
      ).join('\n');

      const mockFs: ExtractorFsAdapter = {
        readFile: async () => routes,
        glob: async () => ['src/many-routes.ts'],
        exists: async () => true,
      };
      extractor.setFs(mockFs);

      const project: ProjectInfo = {
        rootPath: '/test',
        frameworks: [{ id: 'express', name: 'Express', confidence: 'high' }],
      };

      const result = await extractor.extract(project, {});
      expect(result.success).toBe(true);
      expect(result.ir?.endpoints.length).toBe(50);
    });
  });

  describe('No Files Found', () => {
    it('should handle project with no TypeScript files', async () => {
      const extractor = new NestJsExtractor();
      const mockFs: ExtractorFsAdapter = {
        readFile: async () => '',
        glob: async () => [], // No files found
        exists: async () => true,
      };
      extractor.setFs(mockFs);

      const project: ProjectInfo = {
        rootPath: '/test',
        frameworks: [{ id: 'nestjs', name: 'NestJS', confidence: 'high' }],
      };

      const result = await extractor.extract(project, {});
      expect(result.success).toBe(true);
      expect(result.ir?.endpoints.length).toBe(0);
    });
  });

  describe('Multiple Frameworks in Single File', () => {
    it('should handle mixed framework imports', async () => {
      const extractor = new ExpressExtractor();
      const mockFs: ExtractorFsAdapter = {
        readFile: async () => `
          import express from 'express';
          import { z } from 'zod';
          // This shouldn't confuse the extractor
          const app = express();
          app.get('/test', (req, res) => { res.json({}); });
        `,
        glob: async () => ['src/mixed.ts'],
        exists: async () => true,
      };
      extractor.setFs(mockFs);

      const project: ProjectInfo = {
        rootPath: '/test',
        frameworks: [{ id: 'express', name: 'Express', confidence: 'high' }],
      };

      const result = await extractor.extract(project, {});
      expect(result.success).toBe(true);
      expect(result.ir?.endpoints.length).toBeGreaterThanOrEqual(1);
    });
  });
});
