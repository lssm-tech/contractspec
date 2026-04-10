'use client';

import { useRegistryTemplates } from '@contractspec/lib.example-shared-ui';
import { useEffect, useMemo, useState } from 'react';
import { buildLocalTemplateCatalog } from './template-catalog';
import { buildTemplateFilterState } from './template-filters';
import {
	getAvailableTemplateSources,
	isRegistryConfigured,
	type TemplateSource,
} from './template-source';
import { getVisibleTemplateTagFacets } from './template-tag-visibility';

const REGISTRY_URL = process.env.NEXT_PUBLIC_CONTRACTSPEC_REGISTRY_URL;

export function useTemplateBrowseState() {
	const [selectedTag, setSelectedTag] = useState<string | null>(null);
	const [search, setSearch] = useState('');
	const [source, setSource] = useState<TemplateSource>('local');
	const [showAllTags, setShowAllTags] = useState(false);
	const registryConfigured = isRegistryConfigured(REGISTRY_URL);
	const availableSources = getAvailableTemplateSources(REGISTRY_URL);
	const localTemplates = useMemo(() => buildLocalTemplateCatalog(), []);
	const localTemplateById = useMemo(
		() => new Map(localTemplates.map((template) => [template.id, template])),
		[localTemplates]
	);
	const { data: registryTemplates = [], isLoading: registryLoading } =
		useRegistryTemplates();
	const localFilterState = useMemo(
		() =>
			buildTemplateFilterState(
				localTemplates,
				search,
				selectedTag,
				(template) => ({
					title: template.title,
					description: template.description,
					tags: template.tags,
				})
			),
		[localTemplates, search, selectedTag]
	);
	const registryFilterState = useMemo(
		() =>
			buildTemplateFilterState(
				registryTemplates,
				search,
				selectedTag,
				(template) => ({
					title: template.name,
					description: template.description,
					tags: template.tags,
				})
			),
		[registryTemplates, search, selectedTag]
	);
	const activeFilterState =
		source === 'registry' ? registryFilterState : localFilterState;
	const suppressTagRail =
		source === 'registry' &&
		(registryLoading || registryTemplates.length === 0);
	const { visibleTagFacets, hiddenTagFacets } = useMemo(
		() =>
			getVisibleTemplateTagFacets(
				activeFilterState.tagFacets,
				selectedTag,
				showAllTags
			),
		[activeFilterState.tagFacets, selectedTag, showAllTags]
	);
	const showTagFilters =
		!suppressTagRail &&
		(visibleTagFacets.length > 0 || hiddenTagFacets.length > 0);

	useEffect(() => {
		setShowAllTags(false);
	}, [search, showTagFilters, source]);

	return {
		selectedTag,
		setSelectedTag,
		search,
		setSearch,
		source,
		setSource,
		showAllTags,
		setShowAllTags,
		registryConfigured,
		availableSources,
		localTemplates,
		localTemplateById,
		registryTemplates,
		registryLoading,
		localFilterState,
		registryFilterState,
		visibleTagFacets,
		hiddenTagFacets,
		showTagFilters,
	};
}
