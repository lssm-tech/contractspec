'use client';

import { LoadingSpinner } from '@contractspec/lib.ui-kit-web/ui/atoms/LoadingSpinner';
import { getExample } from '@contractspec/module.examples/catalog';
import {
	getInlineExamplePreview,
	listInlineExamplePreviews,
} from '@contractspec/module.examples/runtime';
import dynamic from 'next/dynamic';
import type { ComponentType } from 'react';

const PREVIEW_COMPONENTS: Readonly<Record<string, ComponentType>> =
	Object.fromEntries(
		listInlineExamplePreviews().map((preview) => [
			preview.key,
			dynamic(
				async () => {
					const module = await preview.loadModule();
					return module[preview.exportName] as ComponentType;
				},
				{ ssr: false, loading: () => <LoadingSpinner /> }
			),
		])
	);

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
	const example = getExample(exampleKey);
	const preview = getInlineExamplePreview(exampleKey);
	const PreviewComponent = PREVIEW_COMPONENTS[exampleKey];

	if (!example || !preview || !PreviewComponent) {
		return null;
	}

	const resolvedTitle = title ?? `Embedded ${preview.title} preview`;
	const resolvedDescription =
		description ??
		`This page embeds the reusable ${preview.title} UI exported by the example package, so the docs lane and the live surface stay together.`;

	return (
		<section className="space-y-5">
			<p className="editorial-kicker">{kicker}</p>
			<h2 className="editorial-panel-title">{resolvedTitle}</h2>
			<p className="editorial-copy max-w-4xl text-sm">{resolvedDescription}</p>
			<div className="editorial-panel">
				<PreviewComponent />
			</div>
		</section>
	);
}
