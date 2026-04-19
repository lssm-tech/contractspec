'use client';

import {
	type TemplateId,
	TemplateShell,
} from '@contractspec/lib.example-shared-ui';
import { LoadingSpinner } from '@contractspec/lib.ui-kit-web/ui/atoms/LoadingSpinner';
import {
	getExample,
	getInlineExamplePreview,
	listInlineExamplePreviews,
} from '@contractspec/module.examples';
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

export interface TemplatePreviewContentProps {
	templateId: TemplateId;
}

export function TemplatePreviewContent({
	templateId,
}: TemplatePreviewContentProps) {
	const preview = getInlineExamplePreview(templateId);
	const example = getExample(templateId);
	const PreviewComponent = PREVIEW_COMPONENTS[templateId];

	if (!preview || !example || !PreviewComponent) {
		return null;
	}

	return (
		<TemplateShell
			title={preview.title}
			description={preview.description}
			showSaveAction={false}
		>
			<PreviewComponent />
		</TemplateShell>
	);
}
