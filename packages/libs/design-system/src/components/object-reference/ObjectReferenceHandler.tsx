'use client';

import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@contractspec/lib.ui-kit-web/ui/tooltip';
import * as React from 'react';
import { DefaultReferenceDetail } from './DefaultObjectReferenceDetail';
import {
	DefaultActionButton,
	DefaultObjectReferenceTrigger,
} from './DefaultObjectReferenceParts';
import { ObjectReferencePanel } from './ObjectReferencePanel';
import type {
	ObjectReferenceActionEvent,
	ObjectReferenceHandlerProps,
	ObjectReferenceOpenTarget,
} from './types';
import { normalizeSafeObjectReferenceHref } from './url-safety';
import { useObjectReferenceController } from './useObjectReferenceController';

export function ObjectReferenceHandler({
	reference,
	actions,
	interactivityVisibility = 'underline',
	openTarget,
	panelMode,
	mobilePanelMode,
	desktopPanelMode,
	responsiveBreakpoint,
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
	renderProperty,
	renderSection,
	iconRenderer,
	className,
	panelClassName,
}: ObjectReferenceHandlerProps) {
	const {
		context,
		openDetail,
		resolvedActions,
		resolvedOpen,
		runAction,
		runReferenceAction,
		setOpen,
	} = useObjectReferenceController({
		reference,
		actions,
		defaultOpen,
		open,
		onOpenChange,
		actionHandlers,
		copyText,
		copyHandler,
		openHref,
		openTarget,
		onAction,
		onActionError,
		defaultOpenTarget: openTarget,
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
		<ObjectReferencePanel
			open={resolvedOpen}
			onOpenChange={setOpen}
			mode={panelMode}
			mobileMode={mobilePanelMode}
			desktopMode={desktopPanelMode}
			breakpoint={responsiveBreakpoint}
			title={reference.label}
			description={reference.description}
			className={panelClassName}
			trigger={
				<Tooltip>
					<TooltipTrigger asChild>
						<button
							type="button"
							className="contents"
							aria-label={reference.ariaLabel ?? `Open ${reference.label}`}
							onClick={(event) => {
								if (shouldOpenTriggerInNewPage(openTarget, reference)) {
									event.preventDefault();
								}
								openDetail();
							}}
						>
							{trigger}
						</button>
					</TooltipTrigger>
					<TooltipContent>
						{reference.ariaLabel ?? reference.label}
					</TooltipContent>
				</Tooltip>
			}
		>
			<div className="flex flex-col gap-4 px-4 pb-4">
				{renderDetail ? (
					renderDetail(context)
				) : (
					<DefaultReferenceDetail
						context={context}
						iconRenderer={iconRenderer}
						renderProperty={renderProperty}
						renderSection={renderSection}
						runReferenceAction={runReferenceAction}
					/>
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
		</ObjectReferencePanel>
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
	_event: ObjectReferenceActionEvent,
	{ target }: { target: ObjectReferenceOpenTarget }
) {
	const safeHref = normalizeSafeObjectReferenceHref(href);
	if (!safeHref || typeof window === 'undefined') return;
	if (target === 'new-page') {
		const opened = window.open(safeHref, '_blank', 'noopener,noreferrer');
		if (opened) opened.opener = null;
		return;
	}

	window.location.assign(safeHref);
}

function shouldOpenTriggerInNewPage(
	openTarget: ObjectReferenceHandlerProps['openTarget'],
	reference: ObjectReferenceHandlerProps['reference']
): boolean {
	return (
		(openTarget ?? reference.openTarget) === 'new-page' &&
		Boolean(reference.href)
	);
}
