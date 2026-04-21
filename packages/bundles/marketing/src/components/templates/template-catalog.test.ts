import { describe, expect, test } from 'bun:test';
import {
	listExamples,
	listTemplateExamples,
	listTemplates,
} from '@contractspec/module.examples';
import {
	buildLocalTemplateCatalog,
	matchesTemplateFilters,
} from './template-catalog';
import { buildTemplateFilterState } from './template-filters';
import { NEW_TEMPLATE_IDS } from './template-new';
import {
	getAvailableTemplateSources,
	isRegistryConfigured,
} from './template-source';
import {
	DEFAULT_VISIBLE_TEMPLATE_TAGS,
	getVisibleTemplateTagFacets,
} from './template-tag-visibility';

describe('template catalog', () => {
	test('includes every non-internal example exposed as a template', () => {
		const catalog = buildLocalTemplateCatalog(
			listTemplateExamples(),
			listTemplates()
		);
		const actualIds = [...catalog].map((template) => template.id).sort();
		const expectedIds = listTemplateExamples()
			.map((example) => example.meta.key)
			.sort();

		expect(actualIds).toEqual(expectedIds);
		expect(actualIds.length).toBeGreaterThan(40);
		expect(actualIds).toContain('crm-pipeline');
		expect(actualIds).toContain('integration-stripe');
		expect(actualIds).not.toContain('data-grid-showcase');
	});

	test('keeps internal examples out of the local template catalog', () => {
		const [example] = listTemplateExamples();

		expect(example).toBeDefined();

		const catalog = buildLocalTemplateCatalog(
			[
				...listTemplateExamples(),
				{
					...example!,
					meta: {
						...example!.meta,
						key: 'internal-template',
						visibility: 'internal',
					},
				},
			],
			listTemplates()
		);
		const actualIds = new Set(catalog.map((template) => template.id));

		expect(actualIds.has('internal-template')).toBe(false);
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

	test('derives tag facets from the templates remaining after search', () => {
		const catalog = buildLocalTemplateCatalog(listExamples(), listTemplates());
		const state = buildTemplateFilterState(
			catalog,
			'agent',
			null,
			(template) => template
		);
		const tags = state.tagFacets.map((facet) => facet.tag);

		expect(state.searchScopedTemplates.length).toBeGreaterThan(0);
		expect(tags).toContain('agents');
		expect(tags).not.toContain('billing');
	});

	test('applies selected tags after search scoping', () => {
		const catalog = buildLocalTemplateCatalog(listExamples(), listTemplates());
		const state = buildTemplateFilterState(
			catalog,
			'agent',
			'telegram',
			(template) => template
		);

		expect(state.searchScopedTemplates.length).toBeGreaterThan(
			state.finalTemplates.length
		);
		expect(
			state.finalTemplates.every((template) =>
				template.tags.includes('telegram')
			)
		).toBe(true);
	});

	test('caps default tag visibility and keeps selected hidden tags visible', () => {
		const tagFacets = Array.from(
			{ length: DEFAULT_VISIBLE_TEMPLATE_TAGS + 2 },
			(_, index) => ({
				tag: `tag-${index}`,
				count: DEFAULT_VISIBLE_TEMPLATE_TAGS + 2 - index,
			})
		);
		const { visibleTagFacets, hiddenTagFacets } = getVisibleTemplateTagFacets(
			tagFacets,
			'tag-11',
			false
		);

		expect(visibleTagFacets).toHaveLength(DEFAULT_VISIBLE_TEMPLATE_TAGS + 1);
		expect(visibleTagFacets.some((facet) => facet.tag === 'tag-11')).toBe(true);
		expect(hiddenTagFacets.some((facet) => facet.tag === 'tag-11')).toBe(false);
	});

	test('recomputes source-specific tags from the active source only', () => {
		const localTemplates = [
			{
				title: 'Local agent console',
				description: 'Agent workflows',
				tags: ['agents', 'local'],
			},
		];
		const registryTemplates = [
			{
				title: 'Registry recipe app',
				description: 'Cooking workflows',
				tags: ['recipes', 'community'],
			},
		];
		const localState = buildTemplateFilterState(
			localTemplates,
			'',
			null,
			(template) => template
		);
		const registryState = buildTemplateFilterState(
			registryTemplates,
			'',
			null,
			(template) => template
		);

		expect(localState.tagFacets.map((facet) => facet.tag)).toEqual([
			'agents',
			'local',
		]);
		expect(registryState.tagFacets.map((facet) => facet.tag)).toEqual([
			'community',
			'recipes',
		]);
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
