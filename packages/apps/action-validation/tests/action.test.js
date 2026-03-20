import { describe, expect, it } from 'bun:test';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const actionPath = join(import.meta.dir, '..', 'action.yml');
const actionYaml = readFileSync(actionPath, 'utf8');

describe('action.validation metadata', () => {
	it('declares the composite action entrypoint and outputs', () => {
		expect(actionYaml).toContain("name: 'ContractSpec CI'");
		expect(actionYaml).toContain("using: 'composite'");
		expect(actionYaml).toContain('success:');
		expect(actionYaml).toContain('errors:');
		expect(actionYaml).toContain('warnings:');
	});

	it('runs machine-readable CI output and uploads artifacts', () => {
		expect(actionYaml).toContain('bunx contractspec ci --format json');
		expect(actionYaml).toContain('results.json');
		expect(actionYaml).toContain('results.sarif');
	});
});
