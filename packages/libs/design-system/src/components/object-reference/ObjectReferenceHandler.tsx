'use client';

import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from '@contractspec/lib.ui-kit-web/ui/sheet';
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@contractspec/lib.ui-kit-web/ui/tooltip';
import * as React from 'react';
import { cn } from '../../lib/utils';
import {
	DefaultActionButton,
	DefaultObjectReferenceTrigger,
	DefaultReferenceDetail,
} from './DefaultObjectReferenceParts';
import type {
	ObjectReferenceActionEvent,
	ObjectReferenceHandlerProps,
} from './types';
import { useObjectReferenceController } from './useObjectReferenceController';

export function ObjectReferenceHandler({
	reference,
	actions,
	interactivityVisibility = 'underline',
	defaultOpen = false,
	open,
	onOpenChange,
	actionHandlers,
	onAction,
	onActionError,
	copyText,
	copyHandler,
	openHref,
	renderTrigger,
	renderDetail,
	renderAction,
	iconRenderer,
	className,
	panelClassName,
}: ObjectReferenceHandlerProps) {
	const { context, resolvedActions, resolvedOpen, runAction, setOpen } =
		useObjectReferenceController({
			reference,
			actions,
			defaultOpen,
			open,
			onOpenChange,
			actionHandlers,
			copyText,
			copyHandler,
			openHref,
			onAction,
			onActionError,
			defaultCopy: copyReferenceText,
			defaultOpenHref: openReferenceHref,
		});

	const trigger = renderTrigger ? (
		renderTrigger(context)
	) : (
		<DefaultObjectReferenceTrigger
			context={context}
			iconRenderer={iconRenderer}
			interactivityVisibility={interactivityVisibility}
			className={className}
		/>
	);

	return (
		<Sheet open={resolvedOpen} onOpenChange={setOpen}>
			<Tooltip>
				<TooltipTrigger asChild>
					<button
						type="button"
						className="contents"
						aria-label={reference.ariaLabel ?? `Open ${reference.label}`}
						onClick={() => setOpen(true)}
					>
						{trigger}
					</button>
				</TooltipTrigger>
				<TooltipContent>
					{reference.ariaLabel ?? reference.label}
				</TooltipContent>
			</Tooltip>
			<SheetContent className={cn('sm:max-w-md', panelClassName)}>
				<SheetHeader>
					<SheetTitle>{reference.label}</SheetTitle>
					{reference.description ? (
						<SheetDescription>{reference.description}</SheetDescription>
					) : null}
				</SheetHeader>
				<div className="flex flex-col gap-4 px-4 pb-4">
					{renderDetail ? (
						renderDetail(context)
					) : (
						<DefaultReferenceDetail reference={reference} />
					)}
					<div className="flex flex-col gap-2">
						{resolvedActions.map((action) =>
							renderAction ? (
								<React.Fragment key={action.id}>
									{renderAction({ ...context, action, runAction })}
								</React.Fragment>
							) : (
								<DefaultActionButton
									key={action.id}
									action={action}
									reference={reference}
									iconRenderer={iconRenderer}
									onClick={() => runAction(action)}
								/>
							)
						)}
					</div>
				</div>
			</SheetContent>
		</Sheet>
	);
}

async function copyReferenceText(
	text: string,
	_event: ObjectReferenceActionEvent
) {
	if (typeof navigator !== 'undefined' && navigator.clipboard) {
		await navigator.clipboard.writeText(text);
		return;
	}

	throw new Error('Clipboard is not available.');
}

async function openReferenceHref(
	href: string,
	_event: ObjectReferenceActionEvent
) {
	if (typeof window !== 'undefined') {
		window.open(href, '_blank', 'noopener,noreferrer');
	}
}
