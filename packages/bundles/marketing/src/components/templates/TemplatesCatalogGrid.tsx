'use client';

import { Box } from '@contractspec/lib.design-system/layout';
import type { RegistryTemplate } from '@contractspec/lib.example-shared-ui';
import type { ReactNode } from 'react';
import { TemplateCard } from './TemplateCard';
import {
	TemplatePreviewActionButton,
	TemplateUseActionButton,
} from './TemplateCatalogActions';
import {
	formatExampleKindLabel,
	formatExampleVisibilityLabel,
	formatStabilityLabel,
	type LocalTemplateCatalogItem,
} from './template-catalog';
import {
	getLocalTemplatePreviewAction,
	getRegistryTemplatePreviewAction,
} from './template-preview';
import type { TemplateSource } from './template-source';

interface RegistryTemplateGridProps {
	registryTemplates: readonly RegistryTemplate[];
	localTemplateById: ReadonlyMap<string, LocalTemplateCatalogItem>;
	onPreview: (templateId: string) => void;
	onUseTemplate: (templateId: string, source: TemplateSource) => void;
}

export function RegistryTemplateGrid({
	registryTemplates,
	localTemplateById,
	onPreview,
	onUseTemplate,
}: RegistryTemplateGridProps) {
	return (
		<TemplateGrid>
			{registryTemplates.map((template) => {
				const previewAction = getRegistryTemplatePreviewAction(
					template,
					localTemplateById.get(template.id)
				);

				return (
					<TemplateCard
						key={template.id}
						title={template.name}
						description={template.description}
						metaBadges={['Community']}
						tags={template.tags}
						previewAction={
							<TemplatePreviewActionButton
								action={previewAction}
								templateId={template.id}
								onPreview={onPreview}
							/>
						}
						useAction={
							<TemplateUseActionButton
								source="registry"
								templateId={template.id}
								onUseTemplate={onUseTemplate}
							/>
						}
					/>
				);
			})}
		</TemplateGrid>
	);
}

interface LocalTemplateGridProps {
	localTemplates: readonly LocalTemplateCatalogItem[];
	onPreview: (templateId: string) => void;
	onUseTemplate: (templateId: string, source: TemplateSource) => void;
}

export function LocalTemplateGrid({
	localTemplates,
	onPreview,
	onUseTemplate,
}: LocalTemplateGridProps) {
	return (
		<TemplateGrid>
			{localTemplates.map((template) => {
				const previewAction = getLocalTemplatePreviewAction(template);

				return (
					<TemplateCard
						key={template.id}
						title={template.title}
						description={template.description}
						isNew={template.isNew}
						metaBadges={[
							formatExampleKindLabel(template.kind),
							formatStabilityLabel(template.stability),
							formatExampleVisibilityLabel(template.visibility),
						]}
						tags={template.tags}
						featureList={template.featureList}
						previewAction={
							<TemplatePreviewActionButton
								action={previewAction}
								templateId={template.id}
								onPreview={onPreview}
							/>
						}
						useAction={
							<TemplateUseActionButton
								source="local"
								templateId={template.id}
								onUseTemplate={onUseTemplate}
							/>
						}
					/>
				);
			})}
		</TemplateGrid>
	);
}

function TemplateGrid({ children }: { children: ReactNode }) {
	return (
		<Box
			align="stretch"
			justify="start"
			className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
		>
			{children}
		</Box>
	);
}
