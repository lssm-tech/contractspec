import { describe, expect, test } from 'bun:test';
import {
	getLearningAppType,
	getLearningTrack,
	getLearningTrackId,
	isLearningTemplate,
} from './template-config';

describe('learning journey template config', () => {
	test('recognizes mapped learning templates', () => {
		expect(isLearningTemplate('learning-journey-ambient-coach')).toBe(true);
		expect(isLearningTemplate('learning-journey-duo-drills')).toBe(true);
		expect(isLearningTemplate('learning-journey-platform-tour')).toBe(true);
	});

	test('resolves the corrected platform tour track id', () => {
		expect(getLearningTrackId('learning-journey-platform-tour')).toBe(
			'platform_primitives_tour'
		);
		expect(getLearningTrack('learning-journey-platform-tour')?.name).toContain(
			'Platform Primitives Tour'
		);
	});

	test('keeps the expected mini-app wiring for the supported learning templates', () => {
		expect(getLearningAppType('learning-journey-ambient-coach')).toBe(
			'coaching'
		);
		expect(getLearningAppType('learning-journey-duo-drills')).toBe('gamified');
		expect(getLearningAppType('learning-journey-platform-tour')).toBe(
			'onboarding'
		);
	});
});
