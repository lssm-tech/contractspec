import { Pressable, Text, View } from 'react-native';
import {
	createDefaultObjectReferenceActions,
	getObjectReferenceDisplayValue,
} from './actions';
import type {
	ObjectReferenceActionDescriptor,
	ObjectReferenceDescriptor,
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
	context,
	renderProperty,
	renderSection,
	runReferenceAction,
}: {
	context: ObjectReferenceRenderContext;
	renderProperty?: ObjectReferenceHandlerProps['renderProperty'];
	renderSection?: ObjectReferenceHandlerProps['renderSection'];
	runReferenceAction: (
		reference: ObjectReferenceDescriptor,
		action: ObjectReferenceActionDescriptor
	) => void;
}) {
	const { reference } = context;
	return (
		<View className="gap-3">
			<View className="gap-1">
				<Text className="font-medium text-foreground">
					{getObjectReferenceDisplayValue(reference)}
				</Text>
				{reference.description ? (
					<Text className="text-muted-foreground">{reference.description}</Text>
				) : null}
			</View>
			{reference.sections?.map((section) =>
				renderSection ? (
					<View key={section.id}>{renderSection({ ...context, section })}</View>
				) : (
					<View className="gap-2" key={section.id}>
						{section.title ? (
							<Text className="font-medium text-foreground">
								{section.title}
							</Text>
						) : null}
						{section.properties?.map((property) => (
							<NativeReferenceProperty
								key={property.id}
								property={property}
								runReferenceAction={runReferenceAction}
							/>
						))}
					</View>
				)
			)}
			{reference.properties?.map((property) =>
				renderProperty ? (
					<View key={property.id}>
						{renderProperty({
							...context,
							property,
							depth: 0,
							runPropertyAction: runReferenceAction,
						})}
					</View>
				) : (
					<NativeReferenceProperty
						key={property.id}
						property={property}
						runReferenceAction={runReferenceAction}
					/>
				)
			)}
		</View>
	);
}

function NativeReferenceProperty({
	property,
	runReferenceAction,
}: {
	property: ObjectReferenceDescriptor;
	runReferenceAction: (
		reference: ObjectReferenceDescriptor,
		action: ObjectReferenceActionDescriptor
	) => void;
}) {
	const actions =
		property.actions ?? createDefaultObjectReferenceActions(property);

	return (
		<View className="gap-2 rounded-md border p-3">
			<View>
				<Text className="font-medium text-foreground">{property.label}</Text>
				<Text className="text-muted-foreground">
					{getObjectReferenceDisplayValue(property)}
				</Text>
			</View>
			{actions.length > 0 ? (
				<View className="gap-2">
					{actions.map((action) => (
						<NativeActionButton
							key={action.id}
							action={action}
							onPress={() => runReferenceAction(property, action)}
						/>
					))}
				</View>
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
