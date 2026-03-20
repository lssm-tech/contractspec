import { describe, expect, test } from 'bun:test';
import { OpenbankingPowensFeature, PowensSyncDispatchJob } from './index';

describe('@contractspec/example.openbanking-powens', () => {
	test('exports the canonical job spec', () => {
		expect(PowensSyncDispatchJob.meta.key).toBe(
			'openbanking-powens.job.sync-dispatch'
		);
		expect(PowensSyncDispatchJob.timeoutMs).toBe(60_000);
		expect(OpenbankingPowensFeature.meta.key).toBe('openbanking-powens');
	});
});
