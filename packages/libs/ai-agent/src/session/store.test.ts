import { describe, expect, it } from 'bun:test';
import { generateSessionId } from './store';

describe('generateSessionId', () => {
	it('uses a secure UUID-shaped suffix', () => {
		const sessionId = generateSessionId();

		expect(sessionId).toMatch(
			/^sess_[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
		);
	});

	it('returns unique values across repeated calls', () => {
		const ids = Array.from({ length: 32 }, () => generateSessionId());
		expect(new Set(ids).size).toBe(ids.length);
	});
});
