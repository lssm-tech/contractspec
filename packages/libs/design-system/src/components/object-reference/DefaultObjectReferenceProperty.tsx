import {
	createDefaultObjectReferenceActions,
	getObjectReferenceDisplayValue,
} from './actions';
import { DefaultActionButton } from './DefaultObjectReferenceParts';
import { ReferenceIcon } from './ReferenceIcon';
import type {
	ObjectReferenceActionDescriptor,
	ObjectReferenceDescriptor,
	ObjectReferenceHandlerProps,
	ObjectReferenceRenderContext,
} from './types';

type IconRenderer = ObjectReferenceHandlerProps['iconRenderer'];

export function DefaultReferenceProperty({
	context,
	depth,
	iconRenderer,
	property,
	runReferenceAction,
}: {
	context: ObjectReferenceRenderContext;
	depth: number;
	iconRenderer?: IconRenderer;
	property: ObjectReferenceDescriptor;
	runReferenceAction: (
		reference: ObjectReferenceDescriptor,
		action: ObjectReferenceActionDescriptor
	) => void;
}) {
	const propertyActions =
		property.actions ?? createDefaultObjectReferenceActions(property);
	const childProperties = depth < 3 ? property.properties : undefined;

	return (
		<div className="rounded-md border border-border p-3 text-sm">
			<div className="flex items-start gap-2">
				<ReferenceIcon
					context={{
						iconKey: property.iconKey ?? property.kind,
						reference: property,
					}}
					iconRenderer={iconRenderer}
				/>
				<div className="min-w-0 flex-1">
					<div className="font-medium text-foreground">{property.label}</div>
					<div className="break-words text-muted-foreground">
						{getObjectReferenceDisplayValue(property)}
					</div>
					{property.description ? (
						<div className="mt-1 text-muted-foreground text-xs">
							{property.description}
						</div>
					) : null}
				</div>
			</div>
			{propertyActions.length > 0 ? (
				<div className="mt-3 grid gap-2">
					{propertyActions.map((action) => (
						<DefaultActionButton
							key={action.id}
							action={action}
							reference={property}
							iconRenderer={iconRenderer}
							onClick={() => runReferenceAction(property, action)}
						/>
					))}
				</div>
			) : null}
			{childProperties && childProperties.length > 0 ? (
				<div className="mt-3 grid gap-2">
					{childProperties.map((child) => (
						<DefaultReferenceProperty
							key={child.id}
							context={context}
							depth={depth + 1}
							iconRenderer={iconRenderer}
							property={child}
							runReferenceAction={runReferenceAction}
						/>
					))}
				</div>
			) : null}
		</div>
	);
}

export function MetadataList({
	entries,
}: {
	entries: Array<[string, unknown]>;
}) {
	if (entries.length === 0) {
		return null;
	}

	return (
		<dl className="mt-3 grid gap-2">
			{entries.map(([key, value]) => (
				<div className="grid gap-0.5" key={key}>
					<dt className="font-medium text-muted-foreground text-xs uppercase">
						{key}
					</dt>
					<dd className="break-words text-foreground">
						{formatMetadataValue(value)}
					</dd>
				</div>
			))}
		</dl>
	);
}

function formatMetadataValue(value: unknown): string {
	return typeof value === 'object' && value !== null
		? JSON.stringify(value)
		: String(value);
}
