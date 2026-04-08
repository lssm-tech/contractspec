import { describe, expect, it } from 'bun:test';
import { scoreBuilderEvidence } from './precedence';

describe('builder evidence precedence', () => {
	it('prefers approved studio snapshots over draft transcripts', () => {
		const studioScore = scoreBuilderEvidence({
			sourceType: 'studio_snapshot',
			approvalState: 'approved',
		});
		const transcriptScore = scoreBuilderEvidence({
			sourceType: 'transcript_segment',
			approvalState: 'draft',
		});

		expect(studioScore).toBeGreaterThan(transcriptScore);
	});
});
