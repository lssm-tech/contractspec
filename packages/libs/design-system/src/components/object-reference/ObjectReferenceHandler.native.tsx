import * as React from 'react';
import { Linking, Pressable, View } from 'react-native';
import {
	NativeActionButton,
	NativeObjectReferenceTrigger,
	NativeReferenceDetail,
} from './DefaultObjectReferenceParts.native';
import type { ObjectReferenceHandlerProps } from './types';
import { normalizeSafeObjectReferenceHref } from './url-safety';
import { useObjectReferenceController } from './useObjectReferenceController';

export function ObjectReferenceHandler({
	reference,
	actions,
	interactivityVisibility = 'underline',
	openTarget,
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
		defaultOpenHref: (href) => {
			const safeHref = normalizeSafeObjectReferenceHref(href);
			return safeHref ? Linking.openURL(safeHref) : undefined;
		},
	});

	return (
		<View className={className}>
			<Pressable
				accessibilityRole="button"
				accessibilityLabel={reference.ariaLabel ?? `Open ${reference.label}`}
				onPress={() => (resolvedOpen ? context.setOpen(false) : openDetail())}
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
						<NativeReferenceDetail
							context={context}
							renderProperty={renderProperty}
							renderSection={renderSection}
							runReferenceAction={runReferenceAction}
						/>
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
