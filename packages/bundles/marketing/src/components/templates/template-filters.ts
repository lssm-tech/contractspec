import { matchesTemplateSearch } from './template-catalog';
import type { TemplateTagFacet } from './template-tag-visibility';

export interface TemplateFilterCandidate {
	title: string;
	description: string;
	tags: readonly string[];
}

export interface TemplateFilterState<TTemplate> {
	searchScopedTemplates: TTemplate[];
	finalTemplates: TTemplate[];
	tagFacets: TemplateTagFacet[];
}

export function buildTemplateFilterState<TTemplate>(
	templates: readonly TTemplate[],
	search: string,
	selectedTag: string | null,
	getCandidate: (template: TTemplate) => TemplateFilterCandidate
): TemplateFilterState<TTemplate> {
	const searchScopedTemplates = templates.filter((template) =>
		matchesTemplateSearch(getCandidate(template), search)
	);
	const finalTemplates =
		selectedTag === null
			? searchScopedTemplates
			: searchScopedTemplates.filter((template) =>
					getCandidate(template).tags.includes(selectedTag)
				);

	return {
		searchScopedTemplates,
		finalTemplates,
		tagFacets: buildTemplateTagFacets(searchScopedTemplates, getCandidate),
	};
}

function buildTemplateTagFacets<TTemplate>(
	templates: readonly TTemplate[],
	getCandidate: (template: TTemplate) => TemplateFilterCandidate
): TemplateTagFacet[] {
	const counts = new Map<string, number>();

	for (const template of templates) {
		for (const tag of new Set(getCandidate(template).tags)) {
			counts.set(tag, (counts.get(tag) ?? 0) + 1);
		}
	}

	return [...counts.entries()]
		.map(([tag, count]) => ({ tag, count }))
		.sort(
			(left, right) =>
				right.count - left.count || left.tag.localeCompare(right.tag)
		);
}
