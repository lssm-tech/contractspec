'use client';

import type { TemplateId } from '@contractspec/lib.example-shared-ui';
import { Dialog, DialogContent } from '@contractspec/lib.ui-kit-web/ui/dialog';
import { ScrollArea } from '@contractspec/lib.ui-kit-web/ui/scroll-area';
import { TemplateRuntimeProvider } from '@contractspec/module.examples/runtime';
import { TemplatePreviewContent } from './TemplatePreviewContent';
import {
	supportsInlineTemplatePreview,
	supportsTemplatePreview,
} from './template-preview';

export interface TemplatePreviewModalProps {
	templateId: TemplateId;
	onClose: () => void;
}

export function TemplatePreviewModal({
	templateId,
	onClose,
}: TemplatePreviewModalProps) {
	if (!supportsTemplatePreview(templateId)) {
		return null;
	}

	const content = <TemplatePreviewContent templateId={templateId} />;

	return (
		<Dialog open onOpenChange={(open) => !open && onClose()}>
			<DialogContent className="mb-8 flex h-[calc(100vh-2rem)] min-w-[calc(100vw-2rem)] flex-col justify-between gap-0 p-0">
				<ScrollArea className="flex flex-col justify-between overflow-hidden">
					{supportsInlineTemplatePreview(templateId) ? (
						<TemplateRuntimeProvider
							key={templateId}
							templateId={templateId}
							projectId={`marketing-preview-${templateId}`}
						>
							{content}
						</TemplateRuntimeProvider>
					) : (
						content
					)}
				</ScrollArea>
			</DialogContent>
		</Dialog>
	);
}
