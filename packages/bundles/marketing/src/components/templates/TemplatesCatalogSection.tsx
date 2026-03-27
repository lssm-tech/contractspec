'use client';

import type { RegistryTemplate } from '@contractspec/lib.example-shared-ui';
import Link from 'next/link';
import { TemplateCard } from './TemplateCard';
import {
	formatExampleKindLabel,
	formatStabilityLabel,
	type LocalTemplateCatalogItem,
} from './template-catalog';
import {
	getLocalTemplatePreviewAction,
	getRegistryTemplatePreviewAction,
} from './template-preview';
import type { TemplateSource } from './template-source';

export interface TemplatesCatalogSectionProps {
	source: TemplateSource;
	registryConfigured: boolean;
	registryLoading: boolean;
	localTemplates: readonly LocalTemplateCatalogItem[];
	registryTemplates: readonly RegistryTemplate[];
	localTemplateById: ReadonlyMap<string, LocalTemplateCatalogItem>;
	onPreview: (templateId: string) => void;
	onUseTemplate: (templateId: string, source: TemplateSource) => void;
}

export function TemplatesCatalogSection({
	source,
	registryConfigured,
	registryLoading,
	localTemplates,
	registryTemplates,
	localTemplateById,
	onPreview,
	onUseTemplate,
}: TemplatesCatalogSectionProps) {
	const showRegistry = source === 'registry' && registryConfigured;

	return (
		<section className="section-padding">
			<div className="editorial-shell">
				{showRegistry ? (
					registryLoading ? (
						<div className="py-12 text-center">
							<p className="text-muted-foreground">
								Loading community templates…
							</p>
						</div>
					) : registryTemplates.length === 0 ? (
						<div className="py-12 text-center">
							<p className="text-muted-foreground">
								No community templates found.
							</p>
						</div>
					) : (
						<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
							{registryTemplates.map((template) => {
								const localTemplate = localTemplateById.get(template.id);
								const previewAction = getRegistryTemplatePreviewAction(
									template,
									localTemplate
								);

								return (
									<TemplateCard
										key={template.id}
										title={template.name}
										description={template.description}
										metaBadges={['Community']}
										tags={template.tags}
										previewAction={
											previewAction.kind === 'modal' ? (
												<button
													className="btn-ghost flex-1 text-center text-xs"
													onClick={() => onPreview(template.id)}
												>
													Preview
												</button>
											) : previewAction.kind === 'sandbox' ? (
												<Link
													href={previewAction.href}
													className="btn-ghost flex-1 text-center text-xs"
												>
													Open Sandbox
												</Link>
											) : (
												<button
													className="btn-ghost flex-1 cursor-not-allowed text-center text-xs opacity-60"
													type="button"
													disabled
												>
													Preview Unavailable
												</button>
											)
										}
										useAction={
											<button
												className="btn-primary flex-1 text-center text-xs"
												onClick={() => onUseTemplate(template.id, 'registry')}
											>
												Use Template
											</button>
										}
									/>
								);
							})}
						</div>
					)
				) : localTemplates.length === 0 ? (
					<div className="py-12 text-center">
						<p className="text-muted-foreground">
							No templates match your filters. Try a different search.
						</p>
					</div>
				) : (
					<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
									]}
									tags={template.tags}
									featureList={template.featureList}
									previewAction={
										previewAction.kind === 'modal' ? (
											<button
												className="btn-ghost flex-1 text-center text-xs"
												onClick={() => onPreview(template.id)}
											>
												Preview
											</button>
										) : (
											<Link
												href={previewAction.href}
												className="btn-ghost flex-1 text-center text-xs"
											>
												Open Sandbox
											</Link>
										)
									}
									useAction={
										<button
											className="btn-primary flex-1 text-center text-xs"
											onClick={() => onUseTemplate(template.id, 'local')}
										>
											Use Template
										</button>
									}
								/>
							);
						})}
					</div>
				)}
			</div>
		</section>
	);
}
