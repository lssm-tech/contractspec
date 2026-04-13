import { describe, expect, it, mock } from 'bun:test';
import type { FsAdapter } from '../ports/fs';
import { discoverSpecFiles, discoverSpecs } from './discover';
import { validateDiscoveredSpecs } from './validate/spec-validator';

describe('discoverSpecs', () => {
	it('flattens multiple exported specs from a single source file', async () => {
		const fs = {
			glob: mock(() =>
				Promise.resolve([
					'/repo/packages/modules/audit/src/contracts/ai-contracts.ts',
				])
			),
			readFile: mock(() =>
				Promise.resolve(`
export const auditRecorded = defineEvent({
  meta: { key: 'audit.recorded', version: '1.0.0' }
});

export const runAudit = defineCommand({
  meta: { key: 'audit.run', version: '1.0.0' }
});`)
			),
		} as unknown as FsAdapter;

		const results = await discoverSpecs({ fs });

		expect(results).toHaveLength(2);
		expect(
			results.map((result) => ({
				exportName: result.exportName,
				key: result.key,
				specType: result.specType,
				kind: result.kind,
			}))
		).toEqual([
			{
				exportName: 'auditRecorded',
				key: 'audit.recorded',
				specType: 'event',
				kind: 'event',
			},
			{
				exportName: 'runAudit',
				key: 'audit.run',
				specType: 'operation',
				kind: 'command',
			},
		]);
	});

	it('builds package-scoped discovery patterns from workspace config', async () => {
		const glob = mock(() => Promise.resolve([]));
		const fs = { glob } as unknown as FsAdapter;

		await discoverSpecFiles(fs, {
			config: {
				aiProvider: 'claude',
				agentMode: 'simple',
				outputDir: './src',
				conventions: {
					models: 'src/contracts/models',
					operations: 'src/contracts/commands|src/contracts/queries',
					events: 'src/contracts/events',
					presentations: 'src/contracts/presentations',
					forms: 'src/contracts/forms',
					groupByFeature: true,
				},
				defaultOwners: [],
				defaultTags: [],
				packages: ['packages/modules/*'],
				schemaFormat: 'contractspec',
			},
		});

		const typedArgs = (
			glob.mock.calls as unknown as Array<[{ patterns?: string[] }]>
		)[0]?.[0];
		expect(typedArgs).toBeDefined();
		expect(typedArgs!.patterns).toContain(
			'packages/modules/*/**/contracts/*.ts'
		);
		expect(typedArgs!.patterns).toContain(
			'packages/modules/*/src/contracts/commands/**/*.ts'
		);
		expect(typedArgs!.patterns).toContain(
			'packages/modules/*/src/contracts/queries/**/*.ts'
		);
	});
});

describe('validateDiscoveredSpecs', () => {
	it('returns one validation result per exported spec in the same file', async () => {
		const specs = await discoverSpecs({
			fs: {
				glob: mock(() =>
					Promise.resolve(['/repo/src/contracts/ai-contracts.ts'])
				),
				readFile: mock(() =>
					Promise.resolve(`
import { defineCommand, defineEvent } from '@contractspec/lib.contracts-spec';

export const createUser = defineCommand({
  meta: { key: 'users.create', version: '1.0.0' },
  io: {},
  policy: {}
});

export const userCreated = defineEvent({
  meta: { key: 'users.created', version: '1.0.0' },
  payload: {}
});`)
				),
			} as unknown as FsAdapter,
		});

		const results = await validateDiscoveredSpecs(specs);

		expect(results).toHaveLength(2);
		expect(results.map((result) => result.spec.exportName)).toEqual([
			'createUser',
			'userCreated',
		]);
		expect(results.map((result) => result.valid)).toEqual([true, true]);
	});
});
