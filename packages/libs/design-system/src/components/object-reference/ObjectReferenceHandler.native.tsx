import * as React from 'react';
import { Linking, Pressable, View } from 'react-native';
import { createDefaultObjectReferenceActions } from './actions';
import {
	NativeActionButton,
	NativeObjectReferenceTrigger,
	NativeReferenceDetail,
} from './DefaultObjectReferenceParts.native';
import { executeObjectReferenceAction } from './runtime';
import type {
	ObjectReferenceActionDescriptor,
	ObjectReferenceActionEvent,
	ObjectReferenceHandlerProps,
	ObjectReferenceRenderContext,
} from './types';

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
				defaultOpenHref: (href) => Linking.openURL(href),
			});
		},
		[
			actionHandlers,
			copyHandler,
			copyText,
			onAction,
			onActionError,
			openHref,
			reference,
		]
	);

	return (
		<View className={className}>
			<Pressable
				accessibilityRole="button"
				accessibilityLabel={reference.ariaLabel ?? `Open ${reference.label}`}
				onPress={() => setOpen(!resolvedOpen)}
			>
				{renderTrigger ? (
					renderTrigger(context)
				) : (
					<NativeObjectReferenceTrigger
						context={context}
						iconRenderer={iconRenderer}
						interactivityVisibility={interactivityVisibility}
					/>
				)}
			</Pressable>
			{resolvedOpen ? (
				<View className={panelClassName ?? 'mt-2 gap-2 rounded-md border p-3'}>
					{renderDetail ? (
						renderDetail(context)
					) : (
						<NativeReferenceDetail reference={reference} />
					)}
					<View className="gap-2">
						{resolvedActions.map((action) =>
							renderAction ? (
								<React.Fragment key={action.id}>
									{renderAction({ ...context, action, runAction })}
								</React.Fragment>
							) : (
								<NativeActionButton
									key={action.id}
									action={action}
									onPress={() => runAction(action)}
								/>
							)
						)}
					</View>
				</View>
			) : null}
		</View>
	);
}
