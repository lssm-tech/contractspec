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

	it('accepts the widened canonical contract kinds', () => {
		const result = TestingConfigSchema.safeParse({
			integrity: {
				requireTestsFor: ['agent', 'test-spec', 'product-intent'],
			},
		});

		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.integrity?.requireTestsFor).toEqual([
				'agent',
				'test-spec',
				'product-intent',
			]);
		}
	});
});

describe('ContractsrcSchema with testing', () => {
	it('should allow a local or remote $schema reference', () => {
		const result = ContractsrcSchema.safeParse({
			$schema: './node_modules/contractspec/contractsrc.schema.json',
		});

		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.$schema).toBe(
				'./node_modules/contractspec/contractsrc.schema.json'
			);
		}
	});

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

	it('should accept the expanded folder convention keys', () => {
		const result = ContractsrcSchema.safeParse({
			conventions: {
				capabilities: 'platform-capabilities',
				policies: 'access-policies',
				tests: 'quality/tests',
				translations: 'i18n/catalogs',
			},
		});

		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.conventions?.capabilities).toBe(
				'platform-capabilities'
			);
			expect(result.data.conventions?.policies).toBe('access-policies');
			expect(result.data.conventions?.tests).toBe('quality/tests');
			expect(result.data.conventions?.translations).toBe('i18n/catalogs');
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
					queue: 'connect-review',
				},
				adoption: {
					enabled: true,
					catalog: {
						indexPath: '.contractspec/adoption/catalog.json',
						overrideManifestPath: '.contractspec/adoption/overrides.json',
					},
					workspaceScan: {
						include: ['src/**/*.{ts,tsx}'],
						exclude: ['**/dist/**'],
					},
					families: {
						ui: true,
						contracts: true,
						integrations: true,
						runtime: true,
						sharedLibs: true,
						solutions: false,
					},
					thresholds: {
						workspaceReuse: 'rewrite',
						newImplementation: 'require_review',
					},
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
			expect(result.data.connect?.canonPacks?.[0]?.ref).toBe(
				'team/platform@1.2.0'
			);
			expect(
				result.data.connect?.policy?.reviewThresholds?.destructiveCommand
			).toBe('deny');
			expect(result.data.connect?.studio?.queue).toBe('connect-review');
			expect(result.data.connect?.adoption?.enabled).toBe(true);
			expect(result.data.connect?.adoption?.catalog?.indexPath).toBe(
				'.contractspec/adoption/catalog.json'
			);
			expect(result.data.connect?.adoption?.families?.solutions).toBe(false);
			expect(result.data.connect?.adoption?.thresholds?.newImplementation).toBe(
				'require_review'
			);
		}
	});

	it('should allow harness testing config without embedded secrets', () => {
		const result = ContractsrcSchema.safeParse({
			testing: {
				runner: 'bun',
				harness: {
					artifactRoot: '.contractspec/harness',
					browserEngine: 'both',
					targetBaseUrls: {
						preview: 'http://127.0.0.1:3000',
						sandbox: 'https://sandbox.contractspec.local',
					},
					allowlistedDomains: ['127.0.0.1', 'sandbox.contractspec.local'],
					visual: {
						maxDiffBytes: 0,
						maxDiffRatio: 0,
						updateBaselines: false,
					},
					authProfiles: {
						operator: {
							kind: 'storage-state',
							ref: '.contractspec/auth/operator.json',
						},
						headers: {
							kind: 'headers-env',
							ref: 'CONTRACTSPEC_HARNESS_HEADERS',
						},
					},
				},
			},
		});

		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.testing?.harness?.browserEngine).toBe('both');
			expect(result.data.testing?.harness?.authProfiles?.operator?.kind).toBe(
				'storage-state'
			);
		}
	});

	it('should reject invalid harness auth profile refs', () => {
		const result = ContractsrcSchema.safeParse({
			testing: {
				harness: {
					authProfiles: {
						unsafe: {
							kind: 'password',
							ref: 'secret',
						},
					},
				},
			},
		});

		expect(result.success).toBe(false);
	});

	it('should allow staged package declaration policy config', () => {
		const result = ContractsrcSchema.safeParse({
			ci: {
				packageDeclarations: {
					severity: 'warning',
					requiredByKind: {
						libs: 'feature',
						bundles: 'module-bundle',
						appsRegistry: 'app-config',
					},
					allowMissing: ['packages/apps/cli-database'],
				},
			},
		});

		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.ci?.packageDeclarations?.severity).toBe('warning');
			expect(result.data.ci?.packageDeclarations?.requiredByKind?.bundles).toBe(
				'module-bundle'
			);
			expect(result.data.ci?.packageDeclarations?.allowMissing).toEqual([
				'packages/apps/cli-database',
			]);
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

	it('should allow a builder section in full config', () => {
		const result = ContractsrcSchema.safeParse({
			builder: {
				enabled: true,
				runtimeMode: 'hybrid',
				bootstrapPreset: 'hybrid_mvp',
				api: {
					baseUrl: 'https://api.contractspec.io',
					controlPlaneTokenEnvVar: 'CONTROL_PLANE_API_TOKEN',
				},
				localRuntime: {
					runtimeId: 'rt_local_demo',
					grantedTo: 'operator:demo',
					providerIds: ['provider.codex', 'provider.local.model'],
				},
			},
		});

		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.builder?.enabled).toBe(true);
			expect(result.data.builder?.runtimeMode).toBe('hybrid');
			expect(result.data.builder?.bootstrapPreset).toBe('hybrid_mvp');
			expect(result.data.builder?.api?.baseUrl).toBe(
				'https://api.contractspec.io'
			);
			expect(result.data.builder?.localRuntime?.runtimeId).toBe(
				'rt_local_demo'
			);
		}
	});

	it('should reject invalid builder runtime modes', () => {
		const result = ContractsrcSchema.safeParse({
			builder: {
				runtimeMode: 'self-hosted',
			},
		});

		expect(result.success).toBe(false);
	});
});
