'use client';

import { getExamplePreviewSurface } from '@contractspec/module.examples/catalog';
import {
	ExampleWebPreview,
	TemplateRuntimeProvider,
} from '@contractspec/module.examples/runtime';

export interface ExampleInlinePreviewSectionProps {
	exampleKey: string;
	kicker?: string;
	title?: string;
	description?: string;
}

export function ExampleInlinePreviewSection({
	exampleKey,
	kicker = 'Live example',
	title,
	description,
}: ExampleInlinePreviewSectionProps) {
	const surface = getExamplePreviewSurface(exampleKey);

	if (!surface) {
		return null;
	}

	const resolvedTitle = title ?? `${surface.title} preview`;
	const resolvedDescription =
		description ??
		`This page uses the same shared preview surface as the template modal and sandbox. UI-backed examples render inline; the rest keep docs, sandbox, LLMS, and source links in one place.`;
	const preview = <ExampleWebPreview exampleKey={exampleKey} />;

	return (
		<section className="space-y-5">
			<p className="editorial-kicker">{kicker}</p>
			<h2 className="editorial-panel-title">{resolvedTitle}</h2>
			<p className="editorial-copy max-w-4xl text-sm">{resolvedDescription}</p>
			{surface.supportsInlinePreview ? (
				<TemplateRuntimeProvider
					key={surface.key}
					templateId={surface.key}
					projectId={`docs-preview-${surface.key}`}
				>
					{preview}
				</TemplateRuntimeProvider>
			) : (
				preview
			)}
		</section>
	);
}
