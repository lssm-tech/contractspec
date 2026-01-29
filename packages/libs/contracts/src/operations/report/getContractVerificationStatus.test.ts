import { describe, expect, it } from 'bun:test';
import {
  GetContractVerificationStatusQuery,
  GetContractVerificationStatusInput,
  GetContractVerificationStatusOutput,
} from './getContractVerificationStatus';

describe('GetContractVerificationStatusQuery', () => {
  describe('meta', () => {
    it('should have correct key', () => {
      expect(GetContractVerificationStatusQuery.meta.key).toBe(
        'report.getContractVerificationStatus'
      );
    });

    it('should have version 1.0.0', () => {
      expect(GetContractVerificationStatusQuery.meta.version).toBe('1.0.0');
    });

    it('should have experimental stability', () => {
      expect(GetContractVerificationStatusQuery.meta.stability).toBe(
        'experimental'
      );
    });

    it('should be owned by platform.core', () => {
      expect(GetContractVerificationStatusQuery.meta.owners).toEqual([
        'platform.core',
      ]);
    });

    it('should belong to report domain', () => {
      expect(GetContractVerificationStatusQuery.meta.domain).toBe('report');
    });

    it('should have report, drift, verification tags', () => {
      expect(GetContractVerificationStatusQuery.meta.tags).toEqual([
        'report',
        'drift',
        'verification',
      ]);
    });

    it('should be a query kind', () => {
      expect(GetContractVerificationStatusQuery.meta.kind).toBe('query');
    });
  });

  describe('io.input schema', () => {
    const inputZod = GetContractVerificationStatusInput.getZod();

    it('should accept valid input with projectPath', () => {
      const result = inputZod.safeParse({ projectPath: '/some/path' });
      expect(result.success).toBe(true);
    });

    it('should accept input with optional baseline', () => {
      const result = inputZod.safeParse({
        projectPath: '/some/path',
        baseline: 'main',
      });
      expect(result.success).toBe(true);
    });

    it('should reject missing projectPath', () => {
      const result = inputZod.safeParse({});
      expect(result.success).toBe(false);
    });
  });

  describe('io.output schema', () => {
    const outputZod = GetContractVerificationStatusOutput.getZod();

    it('should accept empty contracts array', () => {
      const result = outputZod.safeParse({ contracts: [] });
      expect(result.success).toBe(true);
    });

    it('should accept complete contract status', () => {
      const result = outputZod.safeParse({
        contracts: [
          {
            name: 'user.create',
            lastVerifiedSha: 'abc1234',
            lastVerifiedDate: '2025-06-10T12:00:00Z',
            surfaces: ['API', 'runtime validation'],
            driftMismatches: 0,
          },
        ],
      });
      expect(result.success).toBe(true);
    });

    it('should accept contract with minimal fields (no optional)', () => {
      const result = outputZod.safeParse({
        contracts: [
          {
            name: 'order.updated',
            surfaces: ['API'],
            driftMismatches: 3,
          },
        ],
      });
      expect(result.success).toBe(true);
    });

    it('should reject contract missing name', () => {
      const result = outputZod.safeParse({
        contracts: [{ surfaces: ['API'], driftMismatches: 0 }],
      });
      expect(result.success).toBe(false);
    });

    it('should reject contract missing surfaces', () => {
      const result = outputZod.safeParse({
        contracts: [{ name: 'x', driftMismatches: 0 }],
      });
      expect(result.success).toBe(false);
    });

    it('should reject contract missing driftMismatches', () => {
      const result = outputZod.safeParse({
        contracts: [{ name: 'x', surfaces: ['API'] }],
      });
      expect(result.success).toBe(false);
    });
  });

  describe('io.errors', () => {
    it('should define PROJECT_NOT_FOUND with http 404', () => {
      const errors = GetContractVerificationStatusQuery.io.errors;
      expect(errors).toBeDefined();
      expect(errors?.PROJECT_NOT_FOUND).toBeDefined();
      expect(errors?.PROJECT_NOT_FOUND?.http).toBe(404);
    });
  });

  describe('policy', () => {
    it('should allow anonymous auth', () => {
      expect(GetContractVerificationStatusQuery.policy.auth).toBe('anonymous');
    });
  });
});
