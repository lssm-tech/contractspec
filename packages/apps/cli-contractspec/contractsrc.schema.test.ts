import { describe, expect, it } from 'bun:test';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { buildContractsrcJsonSchema } from '../../../scripts/generate-contractsrc-schema';

const REPO_ROOT = join(import.meta.dir, '..', '..', '..');

function readJson(relativePath: string): unknown {
	return JSON.parse(readFileSync(join(REPO_ROOT, relativePath), 'utf8'));
}

describe('contractsrc.schema.json', () => {
	it('stays in sync across published and hosted schema copies', () => {
		const expected = buildContractsrcJsonSchema();

		expect(
			readJson('packages/apps/cli-contractspec/contractsrc.schema.json')
		).toEqual(expected);
		expect(
			readJson('packages/apps-registry/contractspec/contractsrc.schema.json')
		).toEqual(expected);
		expect(
			readJson('packages/apps/api-library/src/schemas/contractsrc.json')
		).toEqual(expected);
	});
});
