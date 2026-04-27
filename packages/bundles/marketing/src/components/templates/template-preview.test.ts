import { describe, expect, test } from 'bun:test';
import { buildLocalTemplateCatalog } from './template-catalog';
import {
	getLocalTemplatePreviewAction,
	requiresTemplateRuntimePreview,
} from './template-preview';

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

	test('uses sandbox previews for non-inline template examples', () => {
		const template = buildLocalTemplateCatalog().find(
			(candidate) => candidate.id === 'calendar-google'
		);

		expect(template).toBeDefined();
		expect(getLocalTemplatePreviewAction(template!)).toEqual({
			kind: 'sandbox',
			href: '/sandbox?template=calendar-google',
		});
	});

	test('uses inline modal previews for the form-only showcase', () => {
		const template = buildLocalTemplateCatalog().find(
			(candidate) => candidate.id === 'form-showcase'
		);

		expect(template).toBeDefined();
		expect(getLocalTemplatePreviewAction(template!)).toEqual({
			kind: 'modal',
			templateId: 'form-showcase',
		});
	});

	test('keeps form-only previews outside the heavy template runtime', () => {
		expect(requiresTemplateRuntimePreview('agent-console')).toBe(true);
		expect(requiresTemplateRuntimePreview('form-showcase')).toBe(false);
	});

	test('keeps non-template discoverable examples out of the templates catalog', () => {
		const templateIds = new Set(
			buildLocalTemplateCatalog().map((template) => template.id)
		);

		expect(templateIds.has('data-grid-showcase')).toBe(false);
	});
});
