import { describe, expect, it } from 'bun:test';
import { ContractsrcSchema, TestingConfigSchema } from './contractsrc-schema';

describe('TestingConfigSchema', () => {
	it('should parse valid testing config', () => {
		const valid = {
			runner: 'vitest',
			testMatch: ['**/tests/*.ts'],
			autoGenerate: true,
			integrity: {
				requireTestsFor: ['operation', 'presentation'],
				minCoverage: 80,
			},
		};
		const result = TestingConfigSchema.safeParse(valid);
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.runner).toBe('vitest');
			expect(result.data.autoGenerate).toBe(true);
			expect(result.data.integrity?.requireTestsFor).toEqual([
				'operation',
				'presentation',
			]);
		}
	});

	it('should accept defaults', () => {
		const result = TestingConfigSchema.safeParse({});
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.runner).toBe('internal');
			expect(result.data.testMatch).toEqual(['**/*.{test,spec}.{ts,js}']);
			expect(result.data.autoGenerate).toBe(false);
		}
	});

	it('should reject invalid runner', () => {
		const invalid = {
			runner: 'invalid-runner',
		};
		const result = TestingConfigSchema.safeParse(invalid);
		expect(result.success).toBe(false);
	});
});

describe('ContractsrcSchema with testing', () => {
	it('should allow testing section in full config', () => {
		const config = {
			testing: {
				runner: 'bun',
				autoGenerate: true,
			},
			conventions: {
				models: 'models',
				operations: 'operations',
				events: 'events',
				presentations: 'presentations',
				forms: 'forms',
				groupByFeature: true,
			},
		};
		const result = ContractsrcSchema.safeParse(config);
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.testing?.runner).toBe('bun');
		}
	});

	it('should allow mistral as aiProvider', () => {
		const result = ContractsrcSchema.safeParse({
			aiProvider: 'mistral',
		});

		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.aiProvider).toBe('mistral');
		}
	});

	it('should allow a connect section in full config', () => {
		const result = ContractsrcSchema.safeParse({
			connect: {
				enabled: true,
				adapters: {
					cursor: {
						enabled: true,
						mode: 'plugin',
					},
					codex: {
						enabled: true,
						mode: 'wrapper',
						packageRef: '@contractspec/plugin.codex-connect',
					},
					'claude-code': {
						enabled: true,
						mode: 'rule',
					},
				},
				commands: {
					allow: ['bun run typecheck'],
					review: ['git push'],
					deny: ['git push --force'],
				},
				canonPacks: [
					{
						ref: 'team/platform@1.2.0',
						readOnly: true,
					},
				],
				storage: {
					root: '.contractspec/connect',
					contextPack: '.contractspec/connect/context-pack.json',
					planPacket: '.contractspec/connect/plan-packet.json',
					patchVerdict: '.contractspec/connect/patch-verdict.json',
					auditFile: '.contractspec/connect/audit.ndjson',
					reviewPacketsDir: '.contractspec/connect/review-packets',
				},
				policy: {
					protectedPaths: ['packages/libs/contracts-spec/**'],
					immutablePaths: ['.changeset/**'],
					generatedPaths: ['generated/**'],
					smokeChecks: ['bun run typecheck'],
					reviewThresholds: {
						contractDrift: 'require_review',
						destructiveCommand: 'deny',
					},
				},
				studio: {
					enabled: false,
					mode: 'off',
				},
			},
		});

		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.connect?.enabled).toBe(true);
			expect(result.data.connect?.adapters?.codex?.mode).toBe('wrapper');
			expect(result.data.connect?.storage?.planPacket).toBe(
				'.contractspec/connect/plan-packet.json'
			);
			expect(result.data.connect?.commands?.review).toEqual(['git push']);
			expect(result.data.connect?.canonPacks?.[0]?.ref).toBe('team/platform@1.2.0');
			expect(
				result.data.connect?.policy?.reviewThresholds?.destructiveCommand
			).toBe('deny');
		}
	});

	it('should reject invalid connect adapter modes', () => {
		const result = ContractsrcSchema.safeParse({
			connect: {
				adapters: {
					cursor: {
						mode: 'native-hook',
					},
				},
			},
		});

		expect(result.success).toBe(false);
	});
});
