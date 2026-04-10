'use client';

import {
	analyticsEventNames,
	captureAnalyticsEvent,
} from '@contractspec/bundle.library/libs/posthog/client';
import { useState } from 'react';
import { TemplatesBrowseControls } from './TemplatesBrowseControls';
import { TemplatesCatalogSection } from './TemplatesCatalogSection';
import { TemplatesHeroSection } from './TemplatesHeroSection';
import { TemplatesNextStepsSection } from './TemplatesNextStepsSection';
import { TemplatesOverlays } from './TemplatesOverlays';
import { useTemplateBrowseState } from './useTemplateBrowseState';

export const TemplatesPage = () => {
	const [previewTemplateId, setPreviewTemplateId] = useState<string | null>(
		null
	);
	const [studioSignupModalOpen, setStudioSignupModalOpen] = useState(false);
	const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(
		null
	);
	const {
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
	} = useTemplateBrowseState();

	return (
		<>
			<main>
				<TemplatesHeroSection
					localTemplateCount={localTemplates.length}
					sourceCount={availableSources.length}
				/>
				<TemplatesBrowseControls
					registryConfigured={registryConfigured}
					availableSources={availableSources}
					source={source}
					onSourceChange={setSource}
					search={search}
					onSearchChange={setSearch}
					selectedTag={selectedTag}
					onTagChange={setSelectedTag}
					showTagFilters={showTagFilters}
					visibleTagFacets={visibleTagFacets}
					hiddenTagFacets={hiddenTagFacets}
					showAllTags={showAllTags}
					onShowAllTagsChange={setShowAllTags}
				/>
				<TemplatesCatalogSection
					source={source}
					registryConfigured={registryConfigured}
					registryLoading={registryLoading}
					registryHasTemplates={registryTemplates.length > 0}
					localTemplates={localFilterState.finalTemplates}
					registryTemplates={registryFilterState.finalTemplates}
					localTemplateById={localTemplateById}
					onPreview={setPreviewTemplateId}
					onUseTemplate={(templateId, templateSource) => {
						captureAnalyticsEvent(analyticsEventNames.EXAMPLE_REPO_OPEN, {
							surface: 'templates',
							templateId,
							source: templateSource,
						});
						setSelectedTemplateId(templateId);
					}}
					hasSearch={search.trim().length > 0}
					selectedTag={selectedTag}
				/>
				<TemplatesNextStepsSection />
			</main>

			<TemplatesOverlays
				previewTemplateId={previewTemplateId}
				onPreviewClose={() => setPreviewTemplateId(null)}
				studioSignupModalOpen={studioSignupModalOpen}
				onStudioSignupModalOpenChange={setStudioSignupModalOpen}
				selectedTemplateId={selectedTemplateId}
				onTemplateCommandClose={() => setSelectedTemplateId(null)}
				onDeployStudio={() => {
					setSelectedTemplateId(null);
					setStudioSignupModalOpen(true);
				}}
			/>
		</>
	);
};
