import { describe, expect, it } from 'bun:test';
import {
	inferSpecTypeFromFilePath,
	scanAllSpecsFromSource,
	scanSpecSource,
} from './spec-scan';

describe('inferSpecTypeFromFilePath', () => {
	it('identifies operation specs', () => {
		expect(inferSpecTypeFromFilePath('src/domain/my-op.contracts.ts')).toBe(
			'operation'
		);
		expect(inferSpecTypeFromFilePath('src/domain/operations/my-op.ts')).toBe(
			'operation'
		);
	});

	it('identifies event specs', () => {
		expect(inferSpecTypeFromFilePath('src/domain/my-event.event.ts')).toBe(
			'event'
		);
		expect(inferSpecTypeFromFilePath('src/domain/events/my-event.ts')).toBe(
			'event'
		);
	});

	it('identifies presentation specs', () => {
		expect(
			inferSpecTypeFromFilePath('src/domain/my-pres.presentation.ts')
		).toBe('presentation');
		expect(
			inferSpecTypeFromFilePath('src/domain/presentations/my-pres.ts')
		).toBe('presentation');
	});

	it('identifies feature specs', () => {
		expect(inferSpecTypeFromFilePath('src/domain/my-feature.feature.ts')).toBe(
			'feature'
		);
	});

	it('identifies theme specs', () => {
		expect(inferSpecTypeFromFilePath('src/domain/design.theme.ts')).toBe(
			'theme'
		);
		expect(inferSpecTypeFromFilePath('src/domain/themes/design.ts')).toBe(
			'theme'
		);
	});

	it('identifies package-oriented authoring targets', () => {
		expect(
			inferSpecTypeFromFilePath('packages/bundles/workspace/src/demo.bundle.ts')
		).toBe('module-bundle');
		expect(
			inferSpecTypeFromFilePath('packages/libs/foo/src/foo.builder-spec.ts')
		).toBe('builder-spec');
		expect(
			inferSpecTypeFromFilePath('packages/libs/foo/src/foo.provider-spec.ts')
		).toBe('provider-spec');
	});

	it('identifies expanded canonical contract file conventions', () => {
		expect(
			inferSpecTypeFromFilePath('src/capabilities/payments.capability.ts')
		).toBe('capability');
		expect(inferSpecTypeFromFilePath('src/policies/access.policy.ts')).toBe(
			'policy'
		);
		expect(inferSpecTypeFromFilePath('src/tests/operations.test-spec.ts')).toBe(
			'test-spec'
		);
		expect(inferSpecTypeFromFilePath('src/agents/support.agent.ts')).toBe(
			'agent'
		);
		expect(inferSpecTypeFromFilePath('src/jobs/sync.job.ts')).toBe('job');
		expect(inferSpecTypeFromFilePath('src/i18n/app.en.translation.ts')).toBe(
			'translation'
		);
		expect(
			inferSpecTypeFromFilePath('src/visualizations/revenue.visualization.ts')
		).toBe('visualization');
		expect(
			inferSpecTypeFromFilePath(
				'src/product-intent/activation.product-intent.ts'
			)
		).toBe('product-intent');
		expect(inferSpecTypeFromFilePath('src/pwa/portal.pwa-app.ts')).toBe(
			'pwa-app'
		);
		expect(
			inferSpecTypeFromFilePath('src/harness/smoke.harness-scenario.ts')
		).toBe('harness-scenario');
		expect(
			inferSpecTypeFromFilePath('src/harness/smoke.harness-suite.ts')
		).toBe('harness-suite');
		expect(inferSpecTypeFromFilePath('src/example.ts')).toBe('example');
	});
});

describe('scanSpecSource', () => {
	it('extracts metadata from operation spec', () => {
		const code = `
      export const op = defineCommand({
        meta: { key: 'my-op', version: '1.0.0' },
        description: 'Does something',
        owners: ['team-a'],
        stability: 'stable',
      });
    `;
		const result = scanSpecSource(code, 'src/test.contracts.ts');
		expect(result.specType).toBe('operation');
		expect(result.kind).toBe('command');
		expect(result.key).toBe('my-op');
		expect(result.version).toBe('1.0.0');
		expect(result.description).toBe('Does something');
		expect(result.owners).toEqual(['team-a']);
		expect(result.stability).toBe('stable');
	});

	it('identifies example spec', () => {
		const code =
			'export const example = defineExample({ meta: { key: "ex" } });';
		const result = scanSpecSource(code, 'src/test.example.ts');
		expect(result.specType).toBe('example');
		expect(result.kind).toBe('example');
	});

	it('identifies app-config spec', () => {
		const code =
			'export const app = defineAppConfig({ meta: { key: "app" } });';
		const result = scanSpecSource(code, 'src/test.app-config.ts');
		expect(result.specType).toBe('app-config');
		expect(result.kind).toBe('app-config');
	});

	it('identifies workflow spec', () => {
		const code = 'export const wf = defineWorkflow({ meta: { key: "wf" } });';
		const result = scanSpecSource(code, 'src/test.workflow.ts');
		expect(result.specType).toBe('workflow');
		expect(result.kind).toBe('workflow');
	});

	it('identifies theme spec', () => {
		const code =
			'export const theme = defineTheme({ meta: { key: "design.console", version: "1.0.0" }, tokens: {} });';
		const result = scanSpecSource(code, 'src/design.theme.ts');
		expect(result.specType).toBe('theme');
		expect(result.kind).toBe('theme');
	});

	it('identifies form and data view specs', () => {
		expect(
			scanSpecSource(
				'export const form = defineForm({ meta: { key: "signup.form" } });',
				'src/signup.form.ts'
			).specType
		).toBe('form');
		expect(
			scanSpecSource(
				'export const view = defineDataView({ meta: { key: "users.list" } });',
				'src/users.data-view.ts'
			).specType
		).toBe('data-view');
	});

	it('identifies integration spec', () => {
		const code =
			'export const integration = defineIntegration({ meta: { key: "int" } });';
		const result = scanSpecSource(code, 'src/test.integration.ts');
		expect(result.specType).toBe('integration');
		expect(result.kind).toBe('integration');
	});

	it('identifies expanded canonical contract helpers', () => {
		expect(
			scanSpecSource(
				"export const capability = defineCapability({ meta: { key: 'payments.core', version: '1.0.0' } });",
				'src/payments.capability.ts'
			)
		).toMatchObject({ specType: 'capability', kind: 'capability' });
		expect(
			scanSpecSource(
				"export const policy = definePolicy({ meta: { key: 'core.policy', version: '1.0.0' }, rules: [] });",
				'src/core.policy.ts'
			)
		).toMatchObject({ specType: 'policy', kind: 'policy' });
		expect(
			scanSpecSource(
				"export const translation = defineTranslation({ meta: { key: 'app.messages', version: '1.0.0', domain: 'app', owners: [], tags: [] }, locale: 'en', messages: {} });",
				'src/app.en.translation.ts'
			)
		).toMatchObject({ specType: 'translation', kind: 'translation' });
		expect(
			scanSpecSource(
				"export const job = defineJob({ meta: { key: 'sync.dispatch', version: '1.0.0' }, payload: { schema: {} } });",
				'src/sync.job.ts'
			)
		).toMatchObject({ specType: 'job', kind: 'job' });
		expect(
			scanSpecSource(
				"export const visualization = defineVisualization({ meta: { key: 'analytics.metric', version: '1.0.0', goal: 'Track', context: 'Dashboard', owners: [], tags: [] }, source: { primary: { key: 'analytics.query.list', version: '1.0.0' } }, visualization: { kind: 'metric', measures: [{ key: 'value', label: 'Value', dataPath: 'value' }], measure: 'value' } });",
				'src/metric.visualization.ts'
			)
		).toMatchObject({ specType: 'visualization', kind: 'visualization' });
		expect(
			scanSpecSource(
				"export const agent = defineAgent({ meta: { key: 'support.agent', version: '1.0.0', description: 'Support', owners: [], tags: [], stability: 'experimental' }, instructions: 'Help', tools: [{ name: 'todo' }] });",
				'src/support.agent.ts'
			)
		).toMatchObject({ specType: 'agent', kind: 'agent' });
		expect(
			scanSpecSource(
				"export const intent = defineProductIntentSpec({ id: 'activation-run', meta: { key: 'product.activation', version: '1.0.0' }, question: 'What next?' });",
				'src/activation.product-intent.ts'
			)
		).toMatchObject({ specType: 'product-intent', kind: 'product-intent' });
		expect(
			scanSpecSource(
				"export const manifest = definePwaAppManifest({ meta: { key: 'portal.pwa', version: '1.0.0' }, defaultUpdatePolicy: { mode: 'optional', minimumVersion: '1.0.0' }, releases: [] });",
				'src/portal.pwa-app.ts'
			)
		).toMatchObject({ specType: 'pwa-app', kind: 'pwa-app' });
		expect(
			scanSpecSource(
				"export const scenario = defineHarnessScenario({ meta: { key: 'smoke.scenario', version: '1.0.0' }, target: {}, allowedModes: ['deterministic-browser'], steps: [], assertions: [] });",
				'src/smoke.harness-scenario.ts'
			)
		).toMatchObject({
			specType: 'harness-scenario',
			kind: 'harness-scenario',
		});
		expect(
			scanSpecSource(
				"export const suite = defineHarnessSuite({ meta: { key: 'smoke.suite', version: '1.0.0' }, scenarios: [] });",
				'src/smoke.harness-suite.ts'
			)
		).toMatchObject({
			specType: 'harness-suite',
			kind: 'harness-suite',
		});
	});

	it('identifies newer package targets from source markers', () => {
		expect(
			scanSpecSource(
				"import { defineModuleBundle } from '@contractspec/lib.surface-runtime/spec';\nexport const DemoBundle = defineModuleBundle({ meta: { key: 'demo.bundle', version: '1.0.0', title: 'Demo' }, routes: [{ routeId: 'home', path: '/', defaultSurface: 'main' }], surfaces: { main: { surfaceId: 'main', kind: 'overview', title: 'Main', slots: [], layouts: [], data: [], verification: { level: 'basic' } } } });",
				'src/demo.bundle.ts'
			).specType
		).toBe('module-bundle');
		expect(
			scanSpecSource(
				"import type { BuilderWorkspace } from '@contractspec/lib.builder-spec';\nexport const workspace: BuilderWorkspace = {} as BuilderWorkspace;",
				'src/workspace.builder-spec.ts'
			).specType
		).toBe('builder-spec');
		expect(
			scanSpecSource(
				"import type { ProviderCapabilityProfile } from '@contractspec/lib.provider-spec';\nexport const provider: ProviderCapabilityProfile = {} as ProviderCapabilityProfile;",
				'src/provider.provider-spec.ts'
			).specType
		).toBe('provider-spec');
	});
	it('extracts emitted events', () => {
		const code = `
      export const op = defineCommand({
        // ...
        sideEffects: {
          emits: [
            { key: 'event.a', version: '1' },
            { key: 'event.b', version: '2.0' }
          ]
        }
      });
    `;
		const result = scanSpecSource(code, 'src/test.contracts.ts');
		expect(result.emittedEvents).toHaveLength(2);
		expect(result.emittedEvents?.[0]).toEqual({ key: 'event.a', version: '1' });
		expect(result.emittedEvents?.[1]).toEqual({
			key: 'event.b',
			version: '2.0',
		});
	});
	it('extracts test coverage info', () => {
		const code = `
      defineTestSpec({
        meta: { key: 'my-test', version: '1.0.0' },
        scenarios: [
          {
            when: { ... },
            then: [
              { type: 'expectOutput', match: {} }
            ]
          },
          {
            when: { ... },
            then: [
              { type: 'expectError' }
            ]
          }
        ]
      });
    `;
		const result = scanSpecSource(code, 'src/my.test-spec.ts');
		expect(result.testCoverage).toEqual({
			hasSuccess: true,
			hasError: true,
		});
	});

	it('detects missing test coverage scenarios', () => {
		const code = `
      defineTestSpec({
        meta: { key: 'my-test', version: '1.0.0' },
        scenarios: [
          {
            when: { ... },
            then: [
              { type: 'expectOutput', match: {} }
            ]
          }
        ]
      });
    `;
		const result = scanSpecSource(code, 'src/my.test-spec.ts');
		expect(result.testCoverage).toEqual({
			hasSuccess: true,
			hasError: false,
		});
	});
});

describe('scanAllSpecsFromSource', () => {
	it('extracts multiple specs from a single file', () => {
		const code = `
      export const op1 = defineCommand({
        meta: { key: 'op-1', version: '1' }
      });

      export const op2 = defineQuery({
        meta: { key: 'op-2', version: '1' }
      });
    `;
		const results = scanAllSpecsFromSource(code, 'src/multi.contracts.ts');
		expect(results).toHaveLength(2);

		// Sort by key to be deterministic
		results.sort((a, b) => (a.key || '').localeCompare(b.key || ''));

		expect(results[0]?.key).toBe('op-1');
		expect(results[0]?.kind).toBe('command');
		expect(results[0]?.exportName).toBe('op1');
		expect(results[0]?.declarationLine).toBe(2);
		expect(results[0]?.discoveryId).toBe('src/multi.contracts.ts#op1');
		expect(results[1]?.key).toBe('op-2');
		expect(results[1]?.kind).toBe('query');
		expect(results[1]?.exportName).toBe('op2');
		expect(results[1]?.declarationLine).toBe(6);
		expect(results[1]?.discoveryId).toBe('src/multi.contracts.ts#op2');
	});

	it('captured sourceBlock includes closing parenthesis', () => {
		const code = `export const op = defineCommand({
  meta: { key: 'op-1', version: '1' }
});`;
		const results = scanAllSpecsFromSource(code, 'src/test.contracts.ts');
		expect(results).toHaveLength(1);
		// Should include the closing );
		expect(results[0]?.sourceBlock).toBe(code);
	});

	it('extracts PWA app manifests from exported definitions', () => {
		const code = `export const manifest = definePwaAppManifest({
  meta: { key: 'portal.pwa', version: '1.0.0' },
  defaultUpdatePolicy: { mode: 'optional', minimumVersion: '1.0.0' },
  releases: []
});`;
		const results = scanAllSpecsFromSource(code, 'src/portal.pwa-app.ts');
		expect(results).toHaveLength(1);
		expect(results[0]).toMatchObject({
			exportName: 'manifest',
			specType: 'pwa-app',
			kind: 'pwa-app',
			key: 'portal.pwa',
		});
	});

	it('resolves spread variables in source block', () => {
		const code = `
const OWNERS = ['alice', 'bob'];
export const op = defineCommand({
  meta: { key: 'op-1', version: '1', owners: [...OWNERS] }
});`;
		const results = scanAllSpecsFromSource(code, 'src/test.contracts.ts');
		expect(results).toHaveLength(1);
		const block = results[0]?.sourceBlock;
		expect(block).toContain("owners: ['alice', 'bob']");
		expect(block).not.toContain('...OWNERS');
		expect(results[0]?.owners).toEqual(['alice', 'bob']);
	});

	it('classifies each exported spec from its own source block', () => {
		const code = `
export const auditRecorded = defineEvent({
  meta: { key: 'audit.recorded', version: '1.0.0' }
});

export const runAudit = defineCommand({
  meta: { key: 'audit.run', version: '1.0.0' }
});`;
		const results = scanAllSpecsFromSource(code, 'src/ai-contracts.ts');

		expect(results).toHaveLength(2);
		expect(results[0]).toMatchObject({
			exportName: 'auditRecorded',
			specType: 'event',
			kind: 'event',
			key: 'audit.recorded',
		});
		expect(results[1]).toMatchObject({
			exportName: 'runAudit',
			specType: 'operation',
			kind: 'command',
			key: 'audit.run',
		});
	});
});
