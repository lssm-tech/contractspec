import { describe, expect, it } from 'bun:test';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const validateDir = resolve(import.meta.dir);

describe('validate services loader usage', () => {
	it('blueprint-validator imports and uses the shared authored-module loader', () => {
		const source = readFileSync(
			resolve(validateDir, 'blueprint-validator.ts'),
			'utf8'
		);
		expect(source).toContain("from '../module-loader'");
		expect(source).toContain('loadAuthoredModule(');
	});

	it('tenant-validator imports and uses the shared authored-module loader', () => {
		const source = readFileSync(
			resolve(validateDir, 'tenant-validator.ts'),
			'utf8'
		);
		expect(source).toContain("from '../module-loader'");
		expect(source).toContain('loadAuthoredModule(');
	});
});
