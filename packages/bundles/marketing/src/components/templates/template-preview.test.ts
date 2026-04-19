import { describe, expect, test } from 'bun:test';
import { buildLocalTemplateCatalog } from './template-catalog';
import { getLocalTemplatePreviewAction } from './template-preview';

describe('template preview actions', () => {
	test('uses inline modal previews for ui-backed template examples', () => {
		const template = buildLocalTemplateCatalog().find(
			(candidate) => candidate.id === 'analytics-dashboard'
		);

		expect(template).toBeDefined();
		expect(getLocalTemplatePreviewAction(template!)).toEqual({
			kind: 'modal',
			templateId: 'analytics-dashboard',
		});
	});

	test('falls back to sandbox previews for non-inline template examples', () => {
		const template = buildLocalTemplateCatalog().find(
			(candidate) => candidate.id === 'calendar-google'
		);

		expect(template).toBeDefined();
		expect(getLocalTemplatePreviewAction(template!)).toEqual({
			kind: 'sandbox',
			href: '/sandbox?template=calendar-google',
		});
	});

	test('keeps non-template public examples out of the templates catalog', () => {
		const templateIds = new Set(
			buildLocalTemplateCatalog().map((template) => template.id)
		);

		expect(templateIds.has('data-grid-showcase')).toBe(false);
	});
});
