import { describe, expect, it } from 'bun:test';
import type {
  ResolvedImplementation,
  SpecImplementationResult,
} from '../types';
import { determineStatus, getImplementationSummary } from './status';

describe('status', () => {
  describe('determineStatus', () => {
    it('should return missing if no implementations', () => {
      expect(determineStatus([])).toBe('missing');
    });

    it('should return missing if only test implementations exist', () => {
      const impls: ResolvedImplementation[] = [
        {
          path: 'foo.test.ts',
          type: 'test',
          source: 'convention',
          exists: true,
        },
      ];
      expect(determineStatus(impls)).toBe('missing');
    });

    it('should return missing if implementations missing', () => {
      const impls: ResolvedImplementation[] = [
        {
          path: 'foo.ts',
          type: 'handler',
          source: 'convention',
          exists: false,
        },
      ];
      expect(determineStatus(impls)).toBe('missing');
    });

    it('should return implemented if all exist', () => {
      const impls: ResolvedImplementation[] = [
        {
          path: 'foo.ts',
          type: 'handler',
          source: 'convention',
          exists: true,
        },
        {
          path: 'foo.test.ts',
          type: 'test',
          source: 'convention',
          exists: true,
        },
      ];
      expect(determineStatus(impls)).toBe('implemented');
    });

    it('should return partial if some exist', () => {
      const impls: ResolvedImplementation[] = [
        {
          path: 'foo.ts',
          type: 'handler',
          source: 'convention',
          exists: true,
        },
        {
          path: 'foo.test.ts',
          type: 'test',
          source: 'convention',
          exists: false, // missing test
        },
      ];
      expect(determineStatus(impls)).toBe('partial');
    });
  });

  describe('getImplementationSummary', () => {
    it('should calculate summary correctly', () => {
      const results: SpecImplementationResult[] = [
        { status: 'implemented' } as unknown as SpecImplementationResult,
        { status: 'implemented' } as unknown as SpecImplementationResult,
        { status: 'partial' } as unknown as SpecImplementationResult,
        { status: 'missing' } as unknown as SpecImplementationResult,
      ];

      const summary = getImplementationSummary(results);
      expect(summary.total).toBe(4);
      expect(summary.implemented).toBe(2);
      expect(summary.partial).toBe(1);
      expect(summary.missing).toBe(1);
      expect(summary.coverage).toBe(50);
    });
  });
});
