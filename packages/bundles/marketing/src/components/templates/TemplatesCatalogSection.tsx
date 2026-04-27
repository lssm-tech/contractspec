'use client';

import { VStack } from '@contractspec/lib.design-system/layout';
import { Text } from '@contractspec/lib.design-system/typography';
import type { RegistryTemplate } from '@contractspec/lib.example-shared-ui';
import {
	LocalTemplateGrid,
	RegistryTemplateGrid,
} from './TemplatesCatalogGrid';
import type { LocalTemplateCatalogItem } from './template-catalog';
import type { TemplateSource } from './template-source';

export interface TemplatesCatalogSectionProps {
	source: TemplateSource;
	registryConfigured: boolean;
	registryLoading: boolean;
	registryHasTemplates: boolean;
	localTemplates: readonly LocalTemplateCatalogItem[];
	registryTemplates: readonly RegistryTemplate[];
	localTemplateById: ReadonlyMap<string, LocalTemplateCatalogItem>;
	onPreview: (templateId: string) => void;
	onUseTemplate: (templateId: string, source: TemplateSource) => void;
	hasSearch: boolean;
	selectedTag: string | null;
}

export function TemplatesCatalogSection({
	source,
	registryConfigured,
	registryLoading,
	registryHasTemplates,
	localTemplates,
	registryTemplates,
	localTemplateById,
	onPreview,
	onUseTemplate,
	hasSearch,
	selectedTag,
}: TemplatesCatalogSectionProps) {
	const showRegistry = source === 'registry' && registryConfigured;
	const emptyStateMessage = getEmptyStateMessage(hasSearch, selectedTag);

	return (
		<VStack as="section" className="section-padding">
			<VStack className="editorial-shell">
				{showRegistry ? (
					registryLoading ? (
						<VStack className="py-12 text-center">
							<Text className="text-muted-foreground">
								Loading community templates…
							</Text>
						</VStack>
					) : !registryHasTemplates ? (
						<VStack className="py-12 text-center">
							<Text className="text-muted-foreground">
								No community templates found.
							</Text>
						</VStack>
					) : registryTemplates.length === 0 ? (
						<VStack className="py-12 text-center">
							<Text className="text-muted-foreground">{emptyStateMessage}</Text>
						</VStack>
					) : (
						<RegistryTemplateGrid
							registryTemplates={registryTemplates}
							localTemplateById={localTemplateById}
							onPreview={onPreview}
							onUseTemplate={onUseTemplate}
						/>
					)
				) : localTemplates.length === 0 ? (
					<VStack className="py-12 text-center">
						<Text className="text-muted-foreground">{emptyStateMessage}</Text>
					</VStack>
				) : (
					<LocalTemplateGrid
						localTemplates={localTemplates}
						onPreview={onPreview}
						onUseTemplate={onUseTemplate}
					/>
				)}
			</VStack>
		</VStack>
	);
}

function getEmptyStateMessage(
	hasSearch: boolean,
	selectedTag: string | null
): string {
	if (selectedTag !== null && hasSearch) {
		return 'No templates match this tag for the current search.';
	}
	if (selectedTag !== null) {
		return 'No templates match this tag. Try another tag or reset filters.';
	}
	if (hasSearch) {
		return 'No templates match your search. Try a different keyword.';
	}
	return 'No templates match your filters. Try a different search.';
}
