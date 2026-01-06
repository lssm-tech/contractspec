
import { describe, it, expect, mock, beforeEach } from 'bun:test';
import { VerifyService, createVerifyService } from './verify-service';
import type { AnyOperationSpec } from '@contractspec/lib.contracts';
import type { VerificationReport } from '@contractspec/lib.contracts/llm';

// Mocks
const mockVerifyStructure = mock(() => ({
  passed: true,
  score: 100,
  tier: 'structure',
  issues: [],
  suggestions: [],
  meta: { specName: 'test', specVersion: '1.0.0', implementationPath: 'code.ts', verifiedAt: 'now', duration: 0 },
  coverage: { scenarios: { covered: 0, total: 0 }, errors: { handled: 0, total: 0 }, fields: { implemented: 0, total: 0 } },
} as VerificationReport));

const mockVerifyBehavior = mock(() => ({
  passed: true,
  score: 100,
  tier: 'behavior',
  issues: [],
  suggestions: [],
  meta: { specName: 'test', specVersion: '1.0.0', implementationPath: 'code.ts', verifiedAt: 'now', duration: 0 },
  coverage: { scenarios: { covered: 0, total: 0 }, errors: { handled: 0, total: 0 }, fields: { implemented: 0, total: 0 } },
} as VerificationReport));

const mockVerifyWithAI = mock(() => Promise.resolve({
  passed: true,
  score: 100,
  tier: 'ai_review',
  issues: [],
  suggestions: [],
  meta: { specName: 'test', specVersion: '1.0.0', implementationPath: 'code.ts', verifiedAt: 'now', duration: 0 },
  coverage: { scenarios: { covered: 0, total: 0 }, errors: { handled: 0, total: 0 }, fields: { implemented: 0, total: 0 } },
} as VerificationReport));

const mockCreateQuickAIReview = mock(() => ({
    passed: true,
    score: 80,
    tier: 'ai_review',
    issues: [],
    suggestions: ['Quick review suggestion'],
    meta: { specName: 'test', specVersion: '1.0.0', implementationPath: 'code.ts', verifiedAt: 'now', duration: 0 },
    coverage: { scenarios: { covered: 0, total: 0 }, errors: { handled: 0, total: 0 }, fields: { implemented: 0, total: 0 } },
  } as VerificationReport));

mock.module('./structure-verifier', () => ({
  verifyStructure: mockVerifyStructure,
}));

mock.module('./behavior-verifier', () => ({
  verifyBehavior: mockVerifyBehavior,
}));

mock.module('./ai-verifier', () => ({
  verifyWithAI: mockVerifyWithAI,
  createQuickAIReview: mockCreateQuickAIReview,
}));

describe('VerifyService', () => {
    let service: VerifyService;
    const mockSpec = { key: 'test.op', version: '1.0.0' } as unknown as AnyOperationSpec;
    const mockCode = 'function test() {}';

    beforeEach(() => {
        service = new VerifyService();
        mockVerifyStructure.mockClear();
        mockVerifyBehavior.mockClear();
        mockVerifyWithAI.mockClear();
        mockCreateQuickAIReview.mockClear();
    });

    it('should run default tiers (structure, behavior)', async () => {
        const result = await service.verify(mockSpec, mockCode);

        expect(result.passed).toBe(true);
        expect(result.reports.has('structure')).toBe(true);
        expect(result.reports.has('behavior')).toBe(true);
        expect(result.reports.has('ai_review')).toBe(false);
        expect(mockVerifyStructure).toHaveBeenCalled();
        expect(mockVerifyBehavior).toHaveBeenCalled();
    });

    it('should run specified tiers', async () => {
        const result = await service.verify(mockSpec, mockCode, { tiers: ['structure'] });

        expect(result.reports.has('structure')).toBe(true);
        expect(result.reports.has('behavior')).toBe(false);
        expect(mockVerifyStructure).toHaveBeenCalled();
        expect(mockVerifyBehavior).not.toHaveBeenCalled();
    });

    it('should run AI verification if configured with API key', async () => {
        service.configure({ aiApiKey: 'test-key' });
        const result = await service.verify(mockSpec, mockCode, { tiers: ['ai_review'] });

        expect(result.reports.has('ai_review')).toBe(true);
        expect(mockVerifyWithAI).toHaveBeenCalled();
        expect(mockCreateQuickAIReview).not.toHaveBeenCalled();
    });

     it('should run quick AI review if configured WITHOUT API key', async () => {
        const result = await service.verify(mockSpec, mockCode, { tiers: ['ai_review'] });

        expect(result.reports.has('ai_review')).toBe(true);
        expect(mockVerifyWithAI).not.toHaveBeenCalled();
        expect(mockCreateQuickAIReview).toHaveBeenCalled();
    });

    it('should fail fast if enabled', async () => {
        mockVerifyStructure.mockReturnValueOnce({
            passed: false,
            score: 0,
            tier: 'structure',
            issues: [],
            suggestions: [],
            meta: { specName: 'test', specVersion: '1.0.0', implementationPath: 'code.ts', verifiedAt: 'now', duration: 0 },
            coverage: { scenarios: { covered: 0, total: 0 }, errors: { handled: 0, total: 0 }, fields: { implemented: 0, total: 0 } },
        });

        const result = await service.verify(mockSpec, mockCode, { failFast: true, tiers: ['structure', 'behavior'] });

        expect(result.passed).toBe(false);
        expect(result.reports.has('structure')).toBe(true);
        expect(result.reports.has('behavior')).toBe(false); // Should have stopped
        expect(mockVerifyBehavior).not.toHaveBeenCalled();
    });

    it('should calculate combined score correctly', async () => {
         mockVerifyStructure.mockReturnValueOnce({
            passed: true,
            score: 100,
            tier: 'structure',
            issues: [],
            suggestions: [],
            meta: { specName: 'test', specVersion: '1.0.0', implementationPath: 'code.ts', verifiedAt: 'now', duration: 0 },
            coverage: { scenarios: { covered: 0, total: 0 }, errors: { handled: 0, total: 0 }, fields: { implemented: 0, total: 0 } },
        });
        mockVerifyBehavior.mockReturnValueOnce({
            passed: true,
            score: 50,
            tier: 'behavior',
            issues: [],
            suggestions: [],
            meta: { specName: 'test', specVersion: '1.0.0', implementationPath: 'code.ts', verifiedAt: 'now', duration: 0 },
            coverage: { scenarios: { covered: 0, total: 0 }, errors: { handled: 0, total: 0 }, fields: { implemented: 0, total: 0 } },
        });

        const result = await service.verify(mockSpec, mockCode, { tiers: ['structure', 'behavior'] });

        expect(result.score).toBe(75);
    });

    describe('formatAsMarkdown', () => {
        it('should format report correctly', async () => {
             const result = await service.verify(mockSpec, mockCode);
             const markdown = service.formatAsMarkdown(result);

             expect(markdown).toContain('# Verification Report');
             expect(markdown).toContain('**Status:** ✓ Passed');
             expect(markdown).toContain('## Tier 1: Structure');
             expect(markdown).toContain('## Tier 2: Behavior');
        });
    });
    
    describe('convenience methods', () => {
        it('verifyStructure should call verifier', () => {
            service.verifyStructure(mockSpec, mockCode);
            expect(mockVerifyStructure).toHaveBeenCalled();
        });

         it('verifyBehavior should call verifier', () => {
            service.verifyBehavior(mockSpec, mockCode);
            expect(mockVerifyBehavior).toHaveBeenCalled();
        });

         it('verifyAI should call verifier', async () => {
             service.configure({ aiApiKey: 'key' });
            await service.verifyAI(mockSpec, mockCode);
            expect(mockVerifyWithAI).toHaveBeenCalled();
        });
        
        it('quickVerify should call structure verifier', () => {
            service.quickVerify(mockSpec, mockCode);
            expect(mockVerifyStructure).toHaveBeenCalled();
        });
    });
    
    it('createVerifyService should return instance', () => {
        const instance = createVerifyService();
        expect(instance).toBeInstanceOf(VerifyService);
    });
});
