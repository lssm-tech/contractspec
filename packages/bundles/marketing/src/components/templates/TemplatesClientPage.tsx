'use client';

import {
	analyticsEventNames,
	captureAnalyticsEvent,
} from '@contractspec/bundle.library/libs/posthog/client';
import { useRegistryTemplates } from '@contractspec/lib.example-shared-ui';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@contractspec/lib.ui-kit-web/ui/dialog';
import { useMemo, useState } from 'react';
import { StudioSignupSection } from '../marketing';
import { TemplateCommandDialog } from './TemplateCommandDialog';
import { TemplatesBrowseControls } from './TemplatesBrowseControls';
import { TemplatesCatalogSection } from './TemplatesCatalogSection';
import { TemplatesHeroSection } from './TemplatesHeroSection';
import { TemplatesNextStepsSection } from './TemplatesNextStepsSection';
import { TemplatePreviewModal } from './TemplatesPreviewModal';
import {
	buildLocalTemplateCatalog,
	matchesTemplateFilters,
} from './template-catalog';
import {
	getAvailableTemplateSources,
	isRegistryConfigured,
	type TemplateSource,
} from './template-source';

const REGISTRY_URL = process.env.NEXT_PUBLIC_CONTRACTSPEC_REGISTRY_URL;

export const TemplatesPage = () => {
	const [selectedTag, setSelectedTag] = useState<string | null>(null);
	const [search, setSearch] = useState('');
	const [previewTemplateId, setPreviewTemplateId] = useState<string | null>(
		null
	);
	const [studioSignupModalOpen, setStudioSignupModalOpen] = useState(false);
	const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(
		null
	);
	const [source, setSource] = useState<TemplateSource>('local');

	const registryConfigured = isRegistryConfigured(REGISTRY_URL);
	const availableSources = getAvailableTemplateSources(REGISTRY_URL);
	const localTemplates = useMemo(() => buildLocalTemplateCatalog(), []);
	const localTemplateById = useMemo(
		() => new Map(localTemplates.map((template) => [template.id, template])),
		[localTemplates]
	);
	const availableTags = useMemo(
		() =>
			Array.from(
				new Set(localTemplates.flatMap((template) => template.tags))
			).sort((left, right) => left.localeCompare(right)),
		[localTemplates]
	);

	const { data: registryTemplates = [], isLoading: registryLoading } =
		useRegistryTemplates();

	const filteredLocalTemplates = useMemo(
		() =>
			localTemplates.filter((template) =>
				matchesTemplateFilters(template, search, selectedTag)
			),
		[localTemplates, search, selectedTag]
	);

	const filteredRegistryTemplates = useMemo(
		() =>
			registryTemplates.filter((template) =>
				matchesTemplateFilters(
					{
						title: template.name,
						description: template.description,
						tags: template.tags,
					},
					search,
					selectedTag
				)
			),
		[registryTemplates, search, selectedTag]
	);

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
					availableTags={availableTags}
				/>
				<TemplatesCatalogSection
					source={source}
					registryConfigured={registryConfigured}
					registryLoading={registryLoading}
					localTemplates={filteredLocalTemplates}
					registryTemplates={filteredRegistryTemplates}
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
				/>
				<TemplatesNextStepsSection />
			</main>

			{previewTemplateId ? (
				<TemplatePreviewModal
					templateId={previewTemplateId}
					onClose={() => setPreviewTemplateId(null)}
				/>
			) : null}

			<Dialog
				open={studioSignupModalOpen}
				onOpenChange={setStudioSignupModalOpen}
			>
				<DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
					<DialogHeader>
						<DialogTitle>Deploy in Studio</DialogTitle>
						<DialogDescription>
							Deploy templates in ContractSpec Studio and run the full
							evidence-to-spec loop with your team.
						</DialogDescription>
					</DialogHeader>
					<StudioSignupSection variant="compact" />
				</DialogContent>
			</Dialog>

			<TemplateCommandDialog
				templateId={selectedTemplateId}
				onClose={() => setSelectedTemplateId(null)}
				onDeployStudio={() => {
					setSelectedTemplateId(null);
					setStudioSignupModalOpen(true);
				}}
			/>
		</>
	);
};
