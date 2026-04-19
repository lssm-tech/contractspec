import { describe, expect, test } from 'bun:test';
import { buildLearningPresentationData } from '@contractspec/example.learning-journey-registry';
import { createTemplateTransformEngine } from './engine';
import { resolveTemplatePresentation } from './presentations';
import { getTemplate } from './registry';

const LEARNING_PRESENTATION_KEYS = [
	'learning.journey.track_list',
	'learning.journey.track_detail',
	'learning.journey.progress_widget',
] as const;

describe('@contractspec/module.examples learning presentation runtime', () => {
	test('resolves shared learning presentation descriptors', () => {
		for (const key of LEARNING_PRESENTATION_KEYS) {
			expect(resolveTemplatePresentation(key)?.meta.key).toBe(key);
		}
	});

	test('maps learning templates to the shared learning presentation set', () => {
		for (const templateId of [
			'learning-journey-ambient-coach',
			'learning-journey-duo-drills',
			'learning-journey-platform-tour',
		]) {
			expect(getTemplate(templateId)?.presentations).toEqual([
				...LEARNING_PRESENTATION_KEYS,
			]);
		}
	});

	test('renders shared learning markdown without missing descriptor failures', async () => {
		const engine = createTemplateTransformEngine();
		const cases = [
			{
				templateId: 'learning-journey-ambient-coach',
				presentationId: 'learning.journey.track_list' as const,
				expected: 'Ambient Coach',
			},
			{
				templateId: 'learning-journey-duo-drills',
				presentationId: 'learning.journey.track_detail' as const,
				expected: 'Language Basics Drills',
			},
			{
				templateId: 'learning-journey-platform-tour',
				presentationId: 'learning.journey.progress_widget' as const,
				expected: 'Platform Primitives Tour',
			},
		];

		for (const { expected, presentationId, templateId } of cases) {
			const descriptor = resolveTemplatePresentation(presentationId);
			expect(descriptor).toBeDefined();
			const data = buildLearningPresentationData(templateId, presentationId);
			expect(data).toBeDefined();
			const result = await engine.render<{ body: string; mimeType: string }>(
				'markdown',
				descriptor!,
				{ data }
			);
			expect(result.body).toContain(expected);
		}
	});
});
