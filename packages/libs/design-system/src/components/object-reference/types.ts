import type * as React from 'react';

export type ObjectReferenceKind =
	| 'address'
	| 'email'
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

export type ObjectReferenceOpenTarget = 'same-page' | 'new-page';

export type ObjectReferencePanelMode = import('../overlays').AdaptivePanelMode;

export type ObjectReferencePanelBreakpoint =
	import('../overlays').AdaptivePanelBreakpoint;

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
	openTarget?: ObjectReferenceOpenTarget;
	actions?: ObjectReferenceActionDescriptor[];
	properties?: ObjectReferenceDescriptor[];
	sections?: ObjectReferenceSectionDescriptor[];
	metadata?: ObjectReferenceMetadata;
	iconKey?: string;
	ariaLabel?: string;
}

export interface ObjectReferenceSectionDescriptor {
	id: string;
	title?: string;
	description?: string;
	properties?: ObjectReferenceDescriptor[];
	actions?: ObjectReferenceActionDescriptor[];
	metadata?: ObjectReferenceMetadata;
}

export interface ObjectReferenceActionDescriptor {
	id: string;
	label: string;
	description?: string;
	href?: string;
	openTarget?: ObjectReferenceOpenTarget;
	disabled?: boolean;
	variant?: ObjectReferenceActionVariant;
	iconKey?: string;
	metadata?: ObjectReferenceMetadata;
}

export interface ObjectReferenceActionEvent {
	reference: ObjectReferenceDescriptor;
	action: ObjectReferenceActionDescriptor;
	source: 'action' | 'trigger';
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
	event: ObjectReferenceActionEvent,
	options: { target: ObjectReferenceOpenTarget }
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

export interface ObjectReferencePropertyRenderContext
	extends ObjectReferenceRenderContext {
	property: ObjectReferenceDescriptor;
	depth: number;
	runPropertyAction: (
		property: ObjectReferenceDescriptor,
		action: ObjectReferenceActionDescriptor
	) => void;
}

export interface ObjectReferenceSectionRenderContext
	extends ObjectReferenceRenderContext {
	section: ObjectReferenceSectionDescriptor;
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
	openTarget?: ObjectReferenceOpenTarget;
	panelMode?: ObjectReferencePanelMode;
	mobilePanelMode?: Exclude<ObjectReferencePanelMode, 'responsive'>;
	desktopPanelMode?: Exclude<ObjectReferencePanelMode, 'responsive'>;
	responsiveBreakpoint?: ObjectReferencePanelBreakpoint;
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
	renderProperty?: (
		context: ObjectReferencePropertyRenderContext
	) => React.ReactNode;
	renderSection?: (
		context: ObjectReferenceSectionRenderContext
	) => React.ReactNode;
	iconRenderer?: (context: ObjectReferenceIconRenderContext) => React.ReactNode;
	className?: string;
	panelClassName?: string;
}
