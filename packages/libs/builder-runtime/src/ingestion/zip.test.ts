import { describe, expect, it } from 'bun:test';
import { zipSync } from 'fflate';
import { expandSafeZipEntries } from './zip';

describe('safe zip expansion', () => {
	it('rejects blocked entry types', () => {
		const archive = zipSync({
			'payload.sh': new Uint8Array([1, 2, 3]),
		});

		expect(() => expandSafeZipEntries({ content: archive })).toThrow();
	});
});
