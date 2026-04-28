import { Pressable, Text, View } from 'react-native';
import { getObjectReferenceDisplayValue } from './actions';
import type {
	ObjectReferenceActionDescriptor,
	ObjectReferenceHandlerProps,
	ObjectReferenceRenderContext,
} from './types';

export function NativeObjectReferenceTrigger({
	context,
	iconRenderer,
	interactivityVisibility,
}: {
	context: ObjectReferenceRenderContext;
	iconRenderer?: ObjectReferenceHandlerProps['iconRenderer'];
	interactivityVisibility: NonNullable<
		ObjectReferenceHandlerProps['interactivityVisibility']
	>;
}) {
	const { reference } = context;
	return (
		<View className="flex-row items-center gap-1.5">
			{iconRenderer?.({
				iconKey: reference.iconKey ?? reference.kind,
				reference,
			})}
			<Text
				className={
					interactivityVisibility === 'underline'
						? 'text-foreground underline'
						: 'text-foreground'
				}
			>
				{reference.label}
			</Text>
			{interactivityVisibility === 'icon' ? (
				<Text className="text-muted-foreground">...</Text>
			) : null}
		</View>
	);
}

export function NativeReferenceDetail({
	reference,
}: {
	reference: ObjectReferenceHandlerProps['reference'];
}) {
	return (
		<View className="gap-1">
			<Text className="font-medium text-foreground">
				{getObjectReferenceDisplayValue(reference)}
			</Text>
			{reference.description ? (
				<Text className="text-muted-foreground">{reference.description}</Text>
			) : null}
		</View>
	);
}

export function NativeActionButton({
	action,
	onPress,
}: {
	action: ObjectReferenceActionDescriptor;
	onPress: () => void;
}) {
	return (
		<Pressable
			accessibilityRole="button"
			accessibilityState={{ disabled: action.disabled }}
			disabled={action.disabled}
			className="rounded-md border px-3 py-2"
			onPress={onPress}
		>
			<Text className="font-medium text-foreground">{action.label}</Text>
			{action.description ? (
				<Text className="text-muted-foreground">{action.description}</Text>
			) : null}
		</Pressable>
	);
}
