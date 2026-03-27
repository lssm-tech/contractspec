'use client';

import {
	analyticsEventNames,
	captureAnalyticsEvent,
} from '@contractspec/bundle.library/libs/posthog/client';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@contractspec/lib.ui-kit-web/ui/dialog';

export interface TemplateCommandDialogProps {
	templateId: string | null;
	onClose: () => void;
	onDeployStudio: () => void;
}

export function TemplateCommandDialog({
	templateId,
	onClose,
	onDeployStudio,
}: TemplateCommandDialogProps) {
	const command = templateId
		? `npx contractspec init --template ${templateId}`
		: '';

	return (
		<Dialog open={!!templateId} onOpenChange={(open) => !open && onClose()}>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle>Use this template</DialogTitle>
					<DialogDescription>
						Initialize a new project with this template using the CLI.
					</DialogDescription>
				</DialogHeader>
				<div className="space-y-4 pt-4">
					<div className="rounded-md border border-zinc-800 bg-zinc-950 p-4 font-mono text-sm text-zinc-50">
						{command}
					</div>
					<div className="flex gap-2">
						<button
							className="btn-secondary w-full"
							onClick={() => {
								if (!templateId) {
									return;
								}

								void navigator.clipboard.writeText(command);
								captureAnalyticsEvent(analyticsEventNames.COPY_COMMAND_CLICK, {
									surface: 'templates',
									templateId,
									filename: 'templates-cli',
								});
							}}
						>
							Copy Command
						</button>
					</div>
					<div className="relative">
						<div className="absolute inset-0 flex items-center">
							<span className="w-full border-border border-t" />
						</div>
						<div className="relative flex justify-center text-xs uppercase">
							<span className="bg-background px-2 text-muted-foreground">
								Or
							</span>
						</div>
					</div>
					<button
						className="btn-ghost w-full text-sm"
						onClick={() => {
							if (!templateId) {
								return;
							}

							captureAnalyticsEvent(analyticsEventNames.CTA_STUDIO_CLICK, {
								surface: 'templates',
								templateId,
							});
							onDeployStudio();
						}}
					>
						Deploy to Studio
					</button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
