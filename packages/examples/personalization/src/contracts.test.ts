import { describe, expect, test } from 'bun:test';
import {
	PersonalizationExperiment,
	PersonalizationFeature,
	PersonalizationTheme,
} from './index';

describe('@contractspec/example.personalization', () => {
	test('exports the canonical experiment and theme', () => {
		expect(PersonalizationExperiment.meta.key).toBe(
			'personalization.experiment.overlay-copy'
		);
		expect(PersonalizationExperiment.variants).toHaveLength(2);
		expect(PersonalizationTheme.meta.key).toBe(
			'personalization.theme.guided-onboarding'
		);
		expect(PersonalizationTheme.overrides).toHaveLength(1);
		expect(PersonalizationFeature.meta.key).toBe('personalization');
	});
});
