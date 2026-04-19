import { describe, expect, it } from 'bun:test';
import { resolveOutputPath } from './fs';

describe('resolveOutputPath', () => {
	it('uses configurable folder conventions for new configurable kinds', () => {
		expect(
			resolveOutputPath(
				'/workspace/src',
				'capability',
				{ capabilities: 'platform-capabilities' },
				'payments-core.capability.ts'
			)
		).toBe('/workspace/src/platform-capabilities/payments-core.capability.ts');
	});

	it('uses fixed default folders for new fixed-layout kinds', () => {
		expect(
			resolveOutputPath('/workspace/src', 'job', {}, 'sync-dispatch.job.ts')
		).toBe('/workspace/src/jobs/sync-dispatch.job.ts');
	});
});
