'use client';

import { Button, ButtonLink } from '@contractspec/lib.design-system';
import { Text } from '@contractspec/lib.design-system/typography';
import type { TemplatePreviewAction } from './template-preview';
import type { TemplateSource } from './template-source';

export interface TemplatePreviewActionButtonProps {
	action: TemplatePreviewAction;
	templateId: string;
	onPreview: (templateId: string) => void;
}

export function TemplatePreviewActionButton({
	action,
	templateId,
	onPreview,
}: TemplatePreviewActionButtonProps) {
	if (action.kind === 'modal') {
		return (
			<Button
				className="btn-ghost flex-1 text-center text-xs"
				onPress={() => onPreview(templateId)}
			>
				<Text>Preview</Text>
			</Button>
		);
	}

	if (action.kind === 'sandbox') {
		return (
			<ButtonLink
				href={action.href}
				className="btn-ghost flex-1 text-center text-xs"
			>
				<Text>Preview</Text>
			</ButtonLink>
		);
	}

	return (
		<Button
			className="btn-ghost flex-1 cursor-not-allowed text-center text-xs opacity-60"
			type="button"
			disabled
		>
			<Text>Preview Unavailable</Text>
		</Button>
	);
}

export interface TemplateUseActionButtonProps {
	source: TemplateSource;
	templateId: string;
	onUseTemplate: (templateId: string, source: TemplateSource) => void;
}

export function TemplateUseActionButton({
	source,
	templateId,
	onUseTemplate,
}: TemplateUseActionButtonProps) {
	return (
		<Button
			className="btn-primary flex-1 text-center text-xs"
			onPress={() => onUseTemplate(templateId, source)}
		>
			<Text>Use Template</Text>
		</Button>
	);
}
