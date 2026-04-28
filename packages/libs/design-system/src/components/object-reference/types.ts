import type * as React from 'react';

export type ObjectReferenceKind =
	| 'address'
	| 'phone'
	| 'user'
	| 'customer'
	| 'file'
	| 'url'
	| 'custom';

export type ObjectReferenceInteractivityVisibility =
	| 'none'
	| 'underline'
	| 'icon';

export type ObjectReferenceActionVariant =
	| 'default'
	| 'primary'
	| 'secondary'
	| 'danger';

export type JsonPrimitive = string | number | boolean | null;

export type JsonValue =
	| JsonPrimitive
	| JsonValue[]
	| { readonly [key: string]: JsonValue };

export type ObjectReferenceMetadata = Record<string, JsonValue>;

export interface ObjectReferenceDescriptor {
	id: string;
	kind: ObjectReferenceKind;
	label: string;
	description?: string;
	value?: string;
	href?: string;
	metadata?: ObjectReferenceMetadata;
	iconKey?: string;
	ariaLabel?: string;
}

export interface ObjectReferenceActionDescriptor {
	id: string;
	label: string;
	description?: string;
	href?: string;
	disabled?: boolean;
	variant?: ObjectReferenceActionVariant;
	iconKey?: string;
	metadata?: ObjectReferenceMetadata;
}

export interface ObjectReferenceActionEvent {
	reference: ObjectReferenceDescriptor;
	action: ObjectReferenceActionDescriptor;
	source: 'action';
}

export type ObjectReferenceActionHandler = (
	event: ObjectReferenceActionEvent
) => void | Promise<void>;

export type ObjectReferenceCopyHandler = (
	text: string,
	event: ObjectReferenceActionEvent
) => void | Promise<void>;

export type ObjectReferenceOpenHrefHandler = (
	href: string,
	event: ObjectReferenceActionEvent
) => void | Promise<void>;

export interface ObjectReferenceRenderContext {
	reference: ObjectReferenceDescriptor;
	actions: ObjectReferenceActionDescriptor[];
	open: boolean;
	setOpen: (open: boolean) => void;
}

export interface ObjectReferenceActionRenderContext
	extends ObjectReferenceRenderContext {
	action: ObjectReferenceActionDescriptor;
	runAction: (action: ObjectReferenceActionDescriptor) => void;
}

export interface ObjectReferenceIconRenderContext {
	iconKey: string;
	reference: ObjectReferenceDescriptor;
	action?: ObjectReferenceActionDescriptor;
}

export interface ObjectReferenceHandlerProps {
	reference: ObjectReferenceDescriptor;
	actions?: ObjectReferenceActionDescriptor[];
	interactivityVisibility?: ObjectReferenceInteractivityVisibility;
	defaultOpen?: boolean;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	actionHandlers?: Record<string, ObjectReferenceActionHandler>;
	onAction?: ObjectReferenceActionHandler;
	onActionError?: (error: unknown, event: ObjectReferenceActionEvent) => void;
	copyText?: string;
	copyHandler?: ObjectReferenceCopyHandler;
	openHref?: ObjectReferenceOpenHrefHandler;
	renderTrigger?: (context: ObjectReferenceRenderContext) => React.ReactNode;
	renderDetail?: (context: ObjectReferenceRenderContext) => React.ReactNode;
	renderAction?: (
		context: ObjectReferenceActionRenderContext
	) => React.ReactNode;
	iconRenderer?: (context: ObjectReferenceIconRenderContext) => React.ReactNode;
	className?: string;
	panelClassName?: string;
}
