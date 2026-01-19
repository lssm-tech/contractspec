/**
 * Unit tests for framework detection.
 */

import { describe, expect, it } from 'bun:test';
import {
  detectFrameworksFromPackageJson,
  detectFrameworksFromCode,
  mergeFrameworkDetections,
  getSupportedFrameworks,
  isFrameworkSupported,
} from './detect';

describe('Framework Detection', () => {
  describe('detectFrameworksFromPackageJson', () => {
    it('should detect NestJS', () => {
      const result = detectFrameworksFromPackageJson({
        dependencies: {
          '@nestjs/core': '^10.0.0',
          '@nestjs/common': '^10.0.0',
        },
      });

      expect(result).toHaveLength(1);
      expect(result[0]?.id).toBe('nestjs');
      expect(result[0]?.confidence).toBe('high');
    });

    it('should detect Express', () => {
      const result = detectFrameworksFromPackageJson({
        dependencies: {
          express: '^4.18.0',
        },
      });

      expect(result).toHaveLength(1);
      expect(result[0]?.id).toBe('express');
    });

    it('should detect multiple frameworks', () => {
      const result = detectFrameworksFromPackageJson({
        dependencies: {
          express: '^4.18.0',
          '@trpc/server': '^10.0.0',
        },
      });

      expect(result).toHaveLength(2);
      const ids = result.map((f) => f.id);
      expect(ids).toContain('express');
      expect(ids).toContain('trpc');
    });

    it('should detect devDependencies', () => {
      const result = detectFrameworksFromPackageJson({
        devDependencies: {
          hono: '^3.0.0',
        },
      });

      expect(result).toHaveLength(1);
      expect(result[0]?.id).toBe('hono');
    });

    it('should return empty for no frameworks', () => {
      const result = detectFrameworksFromPackageJson({
        dependencies: {
          lodash: '^4.0.0',
        },
      });

      expect(result).toHaveLength(0);
    });
  });

  describe('detectFrameworksFromCode', () => {
    it('should detect NestJS imports', () => {
      const code = `import { Controller, Get } from '@nestjs/common';`;
      const result = detectFrameworksFromCode(code);

      expect(result).toHaveLength(1);
      expect(result[0]?.id).toBe('nestjs');
    });

    it('should detect Express imports', () => {
      const code = `import express from 'express';`;
      const result = detectFrameworksFromCode(code);

      expect(result).toHaveLength(1);
      expect(result[0]?.id).toBe('express');
    });

    it('should detect tRPC imports', () => {
      const code = `import { initTRPC } from '@trpc/server';`;
      const result = detectFrameworksFromCode(code);

      expect(result).toHaveLength(1);
      expect(result[0]?.id).toBe('trpc');
    });
  });

  describe('mergeFrameworkDetections', () => {
    it('should merge and prefer higher confidence', () => {
      const packageDetections = [
        { id: 'nestjs', name: 'NestJS', confidence: 'high' as const },
      ];
      const codeDetections = [
        { id: 'nestjs', name: 'NestJS', confidence: 'medium' as const },
      ];

      const result = mergeFrameworkDetections(
        packageDetections,
        codeDetections
      );

      expect(result).toHaveLength(1);
      expect(result[0]?.confidence).toBe('high');
    });

    it('should include all unique frameworks', () => {
      const d1 = [
        { id: 'express', name: 'Express', confidence: 'high' as const },
      ];
      const d2 = [{ id: 'trpc', name: 'tRPC', confidence: 'medium' as const }];

      const result = mergeFrameworkDetections(d1, d2);

      expect(result).toHaveLength(2);
    });
  });

  describe('getSupportedFrameworks', () => {
    it('should return all supported framework IDs', () => {
      const frameworks = getSupportedFrameworks();

      expect(frameworks).toContain('nestjs');
      expect(frameworks).toContain('express');
      expect(frameworks).toContain('fastify');
      expect(frameworks).toContain('hono');
      expect(frameworks).toContain('elysia');
      expect(frameworks).toContain('trpc');
      expect(frameworks).toContain('next-api');
    });
  });

  describe('isFrameworkSupported', () => {
    it('should return true for supported frameworks', () => {
      expect(isFrameworkSupported('nestjs')).toBe(true);
      expect(isFrameworkSupported('express')).toBe(true);
    });

    it('should return false for unsupported frameworks', () => {
      expect(isFrameworkSupported('unknown-framework')).toBe(false);
    });
  });
});
