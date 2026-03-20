import { describe, expect, it, mock } from 'bun:test';
import type { FsAdapter } from '../../../ports/fs';
import type { FixableIssue } from '../types';
import { removeReferenceStrategy } from './remove-reference';

describe('removeReferenceStrategy', () => {
	const mockFs = {
		readFile: mock(
			async () => `
export const feature = defineFeature({
  meta: { name: 'Test' },
  operations: [
    { key: 'op1', version: '1' },
    { key: 'op2', version: '1' }
  ]
});`
		),
		writeFile: mock(async () => {
			/* noop */
		}),
	};

	const adapters = { fs: mockFs as unknown as FsAdapter };

	it('should remove a reference from a feature file', async () => {
		const issue: FixableIssue = {
			issue: {
				file: '/test/feature.ts',
				type: 'unresolved-ref',
				message: 'Op not found',
				severity: 'error',
				featureKey: 'feature',
			},
			// Pointing to op2 to remove it
			ref: { key: 'op2', version: '1' } as unknown as FixableIssue['ref'],
			specType: 'operation',
			featureFile: '/test/feature.ts',
			featureKey: 'feature',
			availableStrategies: [],
			strategies: [],
		};

		const result = await removeReferenceStrategy(
			issue,
			{ strategy: 'remove-reference', workspaceRoot: '/test' },
			adapters
		);

		expect(result.success).toBe(true);
		expect(mockFs.readFile).toHaveBeenCalledWith('/test/feature.ts');
		expect(mockFs.writeFile).toHaveBeenCalled();

		const calls = mockFs.writeFile.mock.calls as unknown as unknown[][];
		const writtenContent = calls[0]?.[1] as string;
		expect(writtenContent).not.toContain("key: 'op2'");
		expect(writtenContent).toContain("key: 'op1'");
	});
});
