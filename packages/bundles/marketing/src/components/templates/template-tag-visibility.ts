export const DEFAULT_VISIBLE_TEMPLATE_TAGS = 10;

export interface TemplateTagFacet {
	tag: string;
	count: number;
}

export interface VisibleTemplateTagFacets {
	visibleTagFacets: TemplateTagFacet[];
	hiddenTagFacets: TemplateTagFacet[];
}

export function getVisibleTemplateTagFacets(
	tagFacets: readonly TemplateTagFacet[],
	selectedTag: string | null,
	expanded: boolean,
	visibleCount = DEFAULT_VISIBLE_TEMPLATE_TAGS
): VisibleTemplateTagFacets {
	if (expanded) {
		return {
			visibleTagFacets: pinSelectedTagFacet(tagFacets, selectedTag),
			hiddenTagFacets: [],
		};
	}

	const visibleTagFacets = pinSelectedTagFacet(
		tagFacets.slice(0, visibleCount),
		selectedTag,
		tagFacets
	);
	const visibleTags = new Set(visibleTagFacets.map((facet) => facet.tag));

	return {
		visibleTagFacets,
		hiddenTagFacets: tagFacets.filter((facet) => !visibleTags.has(facet.tag)),
	};
}

function pinSelectedTagFacet(
	tagFacets: readonly TemplateTagFacet[],
	selectedTag: string | null,
	fallbackTagFacets: readonly TemplateTagFacet[] = tagFacets
): TemplateTagFacet[] {
	if (
		selectedTag === null ||
		tagFacets.some((facet) => facet.tag === selectedTag)
	) {
		return [...tagFacets];
	}

	return [
		...tagFacets,
		fallbackTagFacets.find((facet) => facet.tag === selectedTag) ?? {
			tag: selectedTag,
			count: 0,
		},
	];
}
