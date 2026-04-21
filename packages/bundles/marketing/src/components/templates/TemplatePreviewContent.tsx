'use client';

import type { TemplateId } from '@contractspec/lib.example-shared-ui';
import { ExampleWebPreview } from '@contractspec/module.examples/runtime';

export interface TemplatePreviewContentProps {
	templateId: TemplateId;
}

export function TemplatePreviewContent({
	templateId,
}: TemplatePreviewContentProps) {
	return <ExampleWebPreview exampleKey={templateId} />;
}
