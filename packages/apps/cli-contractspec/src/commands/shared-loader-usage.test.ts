import { describe, expect, it } from 'bun:test';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const commandsDir = resolve(import.meta.dir);

describe('shared authored-module loader adoption', () => {
	it('cli test command imports the shared loader via bundle.workspace', () => {
		const source = readFileSync(resolve(commandsDir, 'test/index.ts'), 'utf8');
		expect(source).toContain('loadAuthoredModuleExports');
		expect(source).toContain("from '@contractspec/bundle.workspace'");
		expect(source).not.toContain("from '../../utils/module-loader'");
	});

	it('openapi export resolves registries through the shared loader helper', () => {
		const source = readFileSync(
			resolve(commandsDir, 'openapi/export.ts'),
			'utf8'
		);
		expect(source).toContain('loadAuthoredModuleValue');
		expect(source).toContain("from '@contractspec/bundle.workspace'");
		expect(source).not.toContain("from '../../utils/module-loader'");
	});

	it('harness runtime uses the shared loader for harness registries', () => {
		const source = readFileSync(
			resolve(commandsDir, 'harness/runtime.ts'),
			'utf8'
		);
		expect(source).toContain('loadAuthoredModuleExports');
		expect(source).toContain("from '@contractspec/bundle.workspace'");
		expect(source).not.toContain("from '../../utils/module-loader'");
	});
});
