import * as React from 'react';
import { createDefaultObjectReferenceActions } from './actions';
import { executeObjectReferenceAction } from './runtime';
import type {
	ObjectReferenceActionDescriptor,
	ObjectReferenceActionEvent,
	ObjectReferenceHandlerProps,
	ObjectReferenceRenderContext,
} from './types';

interface ControllerOptions extends ObjectReferenceHandlerProps {
	defaultCopy?: ObjectReferenceHandlerProps['copyHandler'];
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
	defaultCopy,
	defaultOpenHref,
}: ControllerOptions) {
	const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
	const isControlled = open !== undefined;
	const resolvedOpen = open ?? uncontrolledOpen;
	const resolvedActions = React.useMemo(
		() => actions ?? createDefaultObjectReferenceActions(reference),
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

	const runAction = React.useCallback(
		(action: ObjectReferenceActionDescriptor) => {
			if (action.disabled) {
				return;
			}

			const event: ObjectReferenceActionEvent = {
				reference,
				action,
				source: 'action',
			};

			void executeObjectReferenceAction(event, {
				actionHandlers,
				copyText,
				copyHandler,
				openHref,
				onAction,
				onActionError,
				defaultCopy,
				defaultOpenHref,
			});
		},
		[
			actionHandlers,
			copyHandler,
			copyText,
			defaultCopy,
			defaultOpenHref,
			onAction,
			onActionError,
			openHref,
			reference,
		]
	);

	return { context, resolvedActions, resolvedOpen, runAction, setOpen };
}
