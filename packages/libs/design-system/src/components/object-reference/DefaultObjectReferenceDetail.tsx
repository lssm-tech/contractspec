import { Fragment } from 'react';
import { getObjectReferenceDisplayValue } from './actions';
import { DefaultActionButton } from './DefaultObjectReferenceParts';
import {
	DefaultReferenceProperty,
	MetadataList,
} from './DefaultObjectReferenceProperty';
import type {
	ObjectReferenceActionDescriptor,
	ObjectReferenceDescriptor,
	ObjectReferenceHandlerProps,
	ObjectReferenceRenderContext,
	ObjectReferenceSectionDescriptor,
} from './types';

type IconRenderer = ObjectReferenceHandlerProps['iconRenderer'];

export function DefaultReferenceDetail({
	context,
	iconRenderer,
	renderProperty,
	renderSection,
	runReferenceAction,
}: {
	context: ObjectReferenceRenderContext;
	iconRenderer?: IconRenderer;
	renderProperty?: ObjectReferenceHandlerProps['renderProperty'];
	renderSection?: ObjectReferenceHandlerProps['renderSection'];
	runReferenceAction: (
		reference: ObjectReferenceDescriptor,
		action: ObjectReferenceActionDescriptor
	) => void;
}) {
	const { reference } = context;
	return (
		<div className="flex flex-col gap-3">
			<ReferenceSummary reference={reference} />
			{reference.sections?.map((section) =>
				renderSection ? (
					<Fragment key={section.id}>
						{renderSection({ ...context, section })}
					</Fragment>
				) : (
					<DefaultReferenceSection
						key={section.id}
						context={context}
						iconRenderer={iconRenderer}
						renderProperty={renderProperty}
						runReferenceAction={runReferenceAction}
						section={section}
					/>
				)
			)}
			{reference.properties && reference.properties.length > 0 ? (
				<div className="grid gap-2">
					{reference.properties.map((property) => (
						<RenderReferenceProperty
							key={property.id}
							context={context}
							iconRenderer={iconRenderer}
							property={property}
							renderProperty={renderProperty}
							runReferenceAction={runReferenceAction}
						/>
					))}
				</div>
			) : null}
		</div>
	);
}

function ReferenceSummary({
	reference,
}: {
	reference: ObjectReferenceDescriptor;
}) {
	return (
		<div className="rounded-md border border-border bg-muted/30 p-3 text-sm">
			<div className="font-medium text-foreground">
				{getObjectReferenceDisplayValue(reference)}
			</div>
			{reference.href ? (
				<div className="mt-1 break-all text-muted-foreground">
					{reference.href}
				</div>
			) : null}
			<MetadataList entries={Object.entries(reference.metadata ?? {})} />
		</div>
	);
}

function DefaultReferenceSection({
	context,
	iconRenderer,
	renderProperty,
	runReferenceAction,
	section,
}: {
	context: ObjectReferenceRenderContext;
	iconRenderer?: IconRenderer;
	renderProperty?: ObjectReferenceHandlerProps['renderProperty'];
	runReferenceAction: (
		reference: ObjectReferenceDescriptor,
		action: ObjectReferenceActionDescriptor
	) => void;
	section: ObjectReferenceSectionDescriptor;
}) {
	return (
		<section className="grid gap-2">
			<div>
				{section.title ? (
					<h3 className="font-medium text-foreground text-sm">
						{section.title}
					</h3>
				) : null}
				{section.description ? (
					<p className="text-muted-foreground text-xs">{section.description}</p>
				) : null}
			</div>
			{section.properties?.map((property) => (
				<RenderReferenceProperty
					key={property.id}
					context={context}
					iconRenderer={iconRenderer}
					property={property}
					renderProperty={renderProperty}
					runReferenceAction={runReferenceAction}
				/>
			))}
			{section.actions && section.actions.length > 0 ? (
				<div className="grid gap-2">
					{section.actions.map((action) => (
						<DefaultActionButton
							key={action.id}
							action={action}
							reference={context.reference}
							iconRenderer={iconRenderer}
							onClick={() => runReferenceAction(context.reference, action)}
						/>
					))}
				</div>
			) : null}
			<MetadataList entries={Object.entries(section.metadata ?? {})} />
		</section>
	);
}

function RenderReferenceProperty({
	context,
	iconRenderer,
	property,
	renderProperty,
	runReferenceAction,
}: {
	context: ObjectReferenceRenderContext;
	iconRenderer?: IconRenderer;
	property: ObjectReferenceDescriptor;
	renderProperty?: ObjectReferenceHandlerProps['renderProperty'];
	runReferenceAction: (
		reference: ObjectReferenceDescriptor,
		action: ObjectReferenceActionDescriptor
	) => void;
}) {
	if (renderProperty) {
		return (
			<Fragment>
				{renderProperty({
					...context,
					property,
					depth: 0,
					runPropertyAction: runReferenceAction,
				})}
			</Fragment>
		);
	}

	return (
		<DefaultReferenceProperty
			context={context}
			depth={0}
			iconRenderer={iconRenderer}
			property={property}
			runReferenceAction={runReferenceAction}
		/>
	);
}
