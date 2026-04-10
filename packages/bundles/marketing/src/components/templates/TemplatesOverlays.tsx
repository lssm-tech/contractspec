'use client';

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@contractspec/lib.ui-kit-web/ui/dialog';
import { StudioSignupSection } from '../marketing';
import { TemplateCommandDialog } from './TemplateCommandDialog';
import { TemplatePreviewModal } from './TemplatesPreviewModal';

export interface TemplatesOverlaysProps {
	previewTemplateId: string | null;
	onPreviewClose: () => void;
	studioSignupModalOpen: boolean;
	onStudioSignupModalOpenChange: (open: boolean) => void;
	selectedTemplateId: string | null;
	onTemplateCommandClose: () => void;
	onDeployStudio: () => void;
}

export function TemplatesOverlays({
	previewTemplateId,
	onPreviewClose,
	studioSignupModalOpen,
	onStudioSignupModalOpenChange,
	selectedTemplateId,
	onTemplateCommandClose,
	onDeployStudio,
}: TemplatesOverlaysProps) {
	return (
		<>
			{previewTemplateId ? (
				<TemplatePreviewModal
					templateId={previewTemplateId}
					onClose={onPreviewClose}
				/>
			) : null}

			<Dialog
				open={studioSignupModalOpen}
				onOpenChange={onStudioSignupModalOpenChange}
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
				onClose={onTemplateCommandClose}
				onDeployStudio={onDeployStudio}
			/>
		</>
	);
}
