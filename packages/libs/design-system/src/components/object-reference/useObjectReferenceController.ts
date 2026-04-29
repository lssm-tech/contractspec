import * as React from 'react';
import { createDefaultObjectReferenceActions } from './actions';
import { executeObjectReferenceAction } from './runtime';
import type {
	ObjectReferenceActionDescriptor,
	ObjectReferenceActionEvent,
	ObjectReferenceDescriptor,
	ObjectReferenceHandlerProps,
	ObjectReferenceOpenTarget,
	ObjectReferenceRenderContext,
} from './types';

interface ControllerOptions extends ObjectReferenceHandlerProps {
	defaultCopy?: ObjectReferenceHandlerProps['copyHandler'];
	defaultOpenTarget?: ObjectReferenceOpenTarget;
	defaultOpenHref?: ObjectReferenceHandlerProps['openHref'];
}

export function useObjectReferenceController({
	reference,
	actions,
	defaultOpen = false,
	open,
	onOpenChange,
	actionHandlers,
	onAction,
	onActionError,
	copyText,
	copyHandler,
	openHref,
	openTarget,
	defaultCopy,
	defaultOpenTarget,
	defaultOpenHref,
}: ControllerOptions) {
	const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
	const isControlled = open !== undefined;
	const resolvedOpen = open ?? uncontrolledOpen;
	const resolvedActions = React.useMemo(
		() =>
			actions ??
			reference.actions ??
			createDefaultObjectReferenceActions(reference),
		[actions, reference]
	);

	const setOpen = React.useCallback(
		(nextOpen: boolean) => {
			if (!isControlled) {
				setUncontrolledOpen(nextOpen);
			}
			onOpenChange?.(nextOpen);
		},
		[isControlled, onOpenChange]
	);

	const context = React.useMemo<ObjectReferenceRenderContext>(
		() => ({
			reference,
			actions: resolvedActions,
			open: resolvedOpen,
			setOpen,
		}),
		[reference, resolvedActions, resolvedOpen, setOpen]
	);

	const runReferenceAction = React.useCallback(
		(
			actionReference: ObjectReferenceDescriptor,
			action: ObjectReferenceActionDescriptor,
			source: ObjectReferenceActionEvent['source'] = 'action'
		) => {
			if (action.disabled) {
				return;
			}

			const event: ObjectReferenceActionEvent = {
				reference: actionReference,
				action,
				source,
			};

			void executeObjectReferenceAction(event, {
				actionHandlers,
				copyText,
				copyHandler,
				openHref,
				onAction,
				onActionError,
				defaultOpenTarget: resolveOpenTarget(
					openTarget,
					actionReference.openTarget,
					defaultOpenTarget
				),
				defaultCopy,
				defaultOpenHref,
			});
		},
		[
			actionHandlers,
			copyHandler,
			copyText,
			defaultCopy,
			defaultOpenTarget,
			defaultOpenHref,
			onAction,
			onActionError,
			openTarget,
			openHref,
		]
	);

	const runAction = React.useCallback(
		(action: ObjectReferenceActionDescriptor) => {
			runReferenceAction(reference, action);
		},
		[reference, runReferenceAction]
	);

	const openDetail = React.useCallback(() => {
		const target = resolveOpenTarget(openTarget, reference.openTarget);
		if (target === 'new-page' && reference.href) {
			runReferenceAction(
				reference,
				{
					id: 'open-detail',
					label: 'Open details',
					href: reference.href,
					openTarget: target,
					iconKey: 'external-link',
				},
				'trigger'
			);
			return;
		}

		setOpen(true);
	}, [openTarget, reference, runReferenceAction, setOpen]);

	return {
		context,
		openDetail,
		resolvedActions,
		resolvedOpen,
		runAction,
		runReferenceAction,
		setOpen,
	};
}

function resolveOpenTarget(
	...targets: Array<ObjectReferenceOpenTarget | undefined>
): ObjectReferenceOpenTarget {
	return targets.find(Boolean) ?? 'same-page';
}
