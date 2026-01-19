/**
 * Unit tests for extractor registry.
 */

import { describe, expect, it, beforeEach } from 'bun:test';
import { ExtractorRegistry } from './registry';
import { NestJsExtractor } from './extractors/nestjs/extractor';
import { ExpressExtractor } from './extractors/express/extractor';

describe('ExtractorRegistry', () => {
  let registry: ExtractorRegistry;

  beforeEach(() => {
    registry = new ExtractorRegistry();
  });

  describe('Registration', () => {
    it('should register extractors', () => {
      const extractor = new NestJsExtractor();
      registry.register(extractor);

      const found = registry.get('nestjs');
      expect(found).toBeDefined();
      expect(found?.id).toBe('nestjs');
    });

    it('should register multiple extractors', () => {
      registry.register(new NestJsExtractor());
      registry.register(new ExpressExtractor());

      const all = registry.getAll();
      expect(all.length).toBe(2);
    });

    it('should prevent duplicate registration', () => {
      registry.register(new NestJsExtractor());
      registry.register(new NestJsExtractor());

      const all = registry.getAll();
      // Should only have one NestJS extractor
      const nestjsCount = all.filter((e) => e.id === 'nestjs').length;
      expect(nestjsCount).toBe(1);
    });
  });

  describe('Lookup', () => {
    beforeEach(() => {
      registry.register(new NestJsExtractor());
      registry.register(new ExpressExtractor());
    });

    it('should find extractor by id', () => {
      const extractor = registry.get('nestjs');
      expect(extractor).toBeDefined();
      expect(extractor?.name).toBe('NestJS Extractor');
    });

    it('should return undefined for unknown id', () => {
      const extractor = registry.get('unknown-framework');
      expect(extractor).toBeUndefined();
    });

    it('should find extractor for framework', () => {
      const extractors = registry.findForFramework('nestjs');
      expect(extractors.length).toBeGreaterThan(0);
    });

    it('should return empty array for unsupported framework', () => {
      const extractors = registry.findForFramework('unsupported');
      expect(extractors.length).toBe(0);
    });
  });

  describe('Priority Ordering', () => {
    it('should return extractors sorted by priority', () => {
      const extractor1 = new NestJsExtractor();
      const extractor2 = new ExpressExtractor();

      registry.register(extractor1);
      registry.register(extractor2);

      const all = registry.getAll();
      // Should be sorted by priority (higher priority first)
      expect(all.length).toBe(2);
    });
  });

  describe('Framework Support', () => {
    it('should check if framework is supported', () => {
      registry.register(new NestJsExtractor());

      expect(registry.hasExtractorFor('nestjs')).toBe(true);
      expect(registry.hasExtractorFor('unknown')).toBe(false);
    });

    it('should list supported frameworks', () => {
      registry.register(new NestJsExtractor());
      registry.register(new ExpressExtractor());

      const supported = registry.getSupportedFrameworks();
      expect(supported).toContain('nestjs');
      expect(supported).toContain('express');
    });
  });
});
