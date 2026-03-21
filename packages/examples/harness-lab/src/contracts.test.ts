import { describe, expect, test } from 'bun:test';
import {
	HarnessLabBrowserScenario,
	HarnessLabDualModeSuite,
	HarnessLabFeature,
	HarnessLabSandboxScenario,
} from './index';

describe('@contractspec/example.harness-lab contracts', () => {
	test('exports stable scenario, suite, and feature metadata', () => {
		expect(HarnessLabSandboxScenario.meta.key).toBe(
			'harness-lab.sandbox.scenario'
		);
		expect(HarnessLabBrowserScenario.meta.key).toBe(
			'harness-lab.browser.scenario'
		);
		expect(HarnessLabSandboxScenario.meta.version).toBe('1.0.0');
		expect(HarnessLabBrowserScenario.meta.version).toBe('1.0.0');
		expect(HarnessLabDualModeSuite.meta.key).toBe(
			'harness-lab.dual-mode.suite'
		);
		expect(
			HarnessLabDualModeSuite.scenarios.map((entry) => entry.scenario.key)
		).toEqual([
			HarnessLabSandboxScenario.meta.key,
			HarnessLabBrowserScenario.meta.key,
		]);
		expect(
			HarnessLabDualModeSuite.scenarios.every((entry) => entry.required)
		).toBe(true);
		expect(HarnessLabFeature.meta.key).toBe('harness-lab');
	});
});
