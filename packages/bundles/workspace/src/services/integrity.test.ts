import { describe, expect, it, mock } from 'bun:test';
import type { FsAdapter } from '../ports/fs';
import type { LoggerAdapter } from '../ports/logger';
import { analyzeIntegrity } from './integrity';

describe('IntegrityService', () => {
	const logger = {
		info: mock(),
		warn: mock(),
		error: mock(),
	} as unknown as LoggerAdapter;

	function createAdapters(includeTestSpec: boolean): {
		fs: FsAdapter;
		logger: LoggerAdapter;
	} {
		const files = includeTestSpec
			? ['spec.ts', 'test.test-spec.ts']
			: ['spec.ts'];

		const fs = {
			glob: mock(async () => files),
			stat: mock(async () => ({ isDirectory: false })),
			readFile: mock(async (path: string) => {
				if (path === 'spec.ts') {
					return `
            export const op = defineCommand({
              meta: { key: 'test.op', version: '1.0.0' },
            });
          `;
				}

				return `
          defineTestSpec({
            meta: { key: 'test.op.test', version: '1.0.0' },
            target: {
              type: 'operation',
              operation: { key: 'test.op', version: '1.0.0' },
            },
            scenarios: [
              {
                when: {},
                then: [{ type: 'expectOutput', match: {} }],
              },
              {
                when: {},
                then: [{ type: 'expectError' }],
              },
            ],
          });
        `;
			}),
		} as unknown as FsAdapter;

		return { fs, logger };
	}

	it('should flag missing tests when no matching test spec exists', async () => {
		const result = await analyzeIntegrity(createAdapters(false), {
			requireTestsFor: ['operation'],
		});

		expect(result.coverage.missingTest).toBe(1);
	});
});
