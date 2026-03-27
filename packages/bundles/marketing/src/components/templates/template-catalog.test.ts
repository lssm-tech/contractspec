import { describe, expect, test } from 'bun:test';
import { listExamples, listTemplates } from '@contractspec/module.examples';
import {
	buildLocalTemplateCatalog,
	matchesTemplateFilters,
} from './template-catalog';
import { NEW_TEMPLATE_IDS } from './template-new';
import {
	getAvailableTemplateSources,
	isRegistryConfigured,
} from './template-source';

describe('template catalog', () => {
	test('includes every public example exposed as a template', () => {
		const catalog = buildLocalTemplateCatalog(listExamples(), listTemplates());
		const actualIds = [...catalog].map((template) => template.id).sort();
		const expectedIds = listExamples()
			.filter(
				(example) =>
					example.meta.visibility === 'public' && example.surfaces.templates
			)
			.map((example) => example.meta.key)
			.sort();

		expect(actualIds).toEqual(expectedIds);
	});

	test('drops legacy conceptual cards and applies curated new badges', () => {
		const catalog = buildLocalTemplateCatalog(listExamples(), listTemplates());
		const ids = new Set(catalog.map((template) => template.id));
		const newIds = catalog
			.filter((template) => template.isNew)
			.map((template) => template.id)
			.sort();

		expect(ids.has('plumber-ops')).toBe(false);
		expect(ids.has('coliving-management')).toBe(false);
		expect(ids.has('content-review')).toBe(false);
		expect(newIds).toEqual([...NEW_TEMPLATE_IDS].sort());
	});

	test('derives searchable tags from real example metadata', () => {
		const catalog = buildLocalTemplateCatalog(listExamples(), listTemplates());
		const tags = new Set(catalog.flatMap((template) => template.tags));

		expect(tags.has('quickstart')).toBe(true);
		expect(tags.has('gradium')).toBe(true);
		expect(
			catalog.some((template) =>
				matchesTemplateFilters(template, 'voice gradium', null)
			)
		).toBe(true);
	});
});

describe('template source configuration', () => {
	test('only exposes community source when a registry url is configured', () => {
		expect(isRegistryConfigured(undefined)).toBe(false);
		expect(isRegistryConfigured('   ')).toBe(false);
		expect(isRegistryConfigured('https://registry.contractspec.io')).toBe(true);
		expect(getAvailableTemplateSources(undefined)).toEqual(['local']);
		expect(
			getAvailableTemplateSources('https://registry.contractspec.io')
		).toEqual(['local', 'registry']);
	});
});
