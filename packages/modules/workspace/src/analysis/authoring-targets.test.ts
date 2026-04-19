import { describe, expect, it } from 'bun:test';
import {
	detectAuthoringTargetFromCodeBlock,
	getAuthoringTargetDefaultFileName,
	getAuthoringTargetDefaultSubdirectory,
	inferAuthoringTargetFromFilePath,
} from './authoring-targets';

describe('detectAuthoringTargetFromCodeBlock', () => {
	it('detects newly supported canonical contract helpers', () => {
		expect(
			detectAuthoringTargetFromCodeBlock(
				"export const PaymentsCapability = defineCapability({ meta: { key: 'payments.core', version: '1.0.0' } });"
			)
		).toBe('capability');
		expect(
			detectAuthoringTargetFromCodeBlock(
				"export const CorePolicy = definePolicy({ meta: { key: 'core.policy', version: '1.0.0' }, rules: [] });"
			)
		).toBe('policy');
		expect(
			detectAuthoringTargetFromCodeBlock(
				"export const SupportAgent = defineAgent({ meta: { key: 'support.agent', version: '1.0.0' }, instructions: 'Help', tools: [{ name: 'todo' }] });"
			)
		).toBe('agent');
		expect(
			detectAuthoringTargetFromCodeBlock(
				"export const LocaleBundle = defineTranslation({ meta: { key: 'app.messages', version: '1.0.0', domain: 'app', owners: [], tags: [] }, locale: 'en', messages: {} });"
			)
		).toBe('translation');
		expect(
			detectAuthoringTargetFromCodeBlock(
				"export const SyncJob = defineJob({ meta: { key: 'sync.dispatch', version: '1.0.0' }, payload: { schema: {} } });"
			)
		).toBe('job');
		expect(
			detectAuthoringTargetFromCodeBlock(
				"export const ActivationIntent = defineProductIntentSpec({ id: 'activation-run', meta: { key: 'product.activation', version: '1.0.0' }, question: 'What next?' });"
			)
		).toBe('product-intent');
		expect(
			detectAuthoringTargetFromCodeBlock(
				"export const SmokeSuite = defineHarnessSuite({ meta: { key: 'smoke.suite', version: '1.0.0' }, scenarios: [] });"
			)
		).toBe('harness-suite');
	});
});

describe('inferAuthoringTargetFromFilePath', () => {
	it('recognizes newly supported file conventions', () => {
		expect(
			inferAuthoringTargetFromFilePath(
				'src/capabilities/payments.capability.ts'
			)
		).toBe('capability');
		expect(
			inferAuthoringTargetFromFilePath('src/policies/access.policy.ts')
		).toBe('policy');
		expect(
			inferAuthoringTargetFromFilePath('src/tests/orders.test-spec.ts')
		).toBe('test-spec');
		expect(
			inferAuthoringTargetFromFilePath('src/i18n/app.en.translation.ts')
		).toBe('translation');
		expect(
			inferAuthoringTargetFromFilePath(
				'src/visualizations/revenue.visualization.ts'
			)
		).toBe('visualization');
		expect(
			inferAuthoringTargetFromFilePath('src/agents/support.agent.ts')
		).toBe('agent');
		expect(inferAuthoringTargetFromFilePath('src/jobs/sync.job.ts')).toBe(
			'job'
		);
		expect(
			inferAuthoringTargetFromFilePath(
				'src/product-intent/activation.product-intent.ts'
			)
		).toBe('product-intent');
		expect(
			inferAuthoringTargetFromFilePath('src/harness/smoke.harness-scenario.ts')
		).toBe('harness-scenario');
		expect(
			inferAuthoringTargetFromFilePath('src/harness/smoke.harness-suite.ts')
		).toBe('harness-suite');
		expect(inferAuthoringTargetFromFilePath('src/example.ts')).toBe('example');
	});
});

describe('authoring target defaults', () => {
	it('uses folder conventions for configurable new kinds', () => {
		expect(
			getAuthoringTargetDefaultSubdirectory('capability', {
				capabilities: 'platform-capabilities',
			})
		).toBe('platform-capabilities');
		expect(
			getAuthoringTargetDefaultSubdirectory('translation', {
				translations: 'i18n/catalogs',
			})
		).toBe('i18n/catalogs');
	});

	it('uses fixed defaults for non-configurable new kinds', () => {
		expect(getAuthoringTargetDefaultSubdirectory('job')).toBe('jobs');
		expect(getAuthoringTargetDefaultSubdirectory('product-intent')).toBe(
			'product-intent'
		);
		expect(getAuthoringTargetDefaultSubdirectory('harness-suite')).toBe(
			'harness/suites'
		);
	});

	it('builds canonical default filenames', () => {
		expect(
			getAuthoringTargetDefaultFileName('capability', 'payments.core')
		).toBe('payments-core.capability.ts');
		expect(
			getAuthoringTargetDefaultFileName('translation', 'app.messages', {
				translationLocale: 'en-US',
			})
		).toBe('app-messages.en-US.translation.ts');
		expect(getAuthoringTargetDefaultFileName('example', 'any.key')).toBe(
			'example.ts'
		);
	});
});
