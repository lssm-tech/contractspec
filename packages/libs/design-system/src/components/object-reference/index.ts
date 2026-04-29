export {
	createCopyReferenceAction,
	createDefaultObjectReferenceActions,
	createEmailReferenceAction,
	createMapsProviderHref,
	createMapsReferenceActions,
	createOpenReferenceAction,
	createPhoneReferenceAction,
	getObjectReferenceDisplayValue,
	type ObjectReferenceMapsActionOptions,
	type ObjectReferenceMapsProvider,
} from './actions';
export { ObjectReferenceHandler } from './ObjectReferenceHandler';
export {
	ObjectReferencePanel,
	type ObjectReferencePanelProps,
} from './ObjectReferencePanel';
export {
	type ExecuteObjectReferenceActionOptions,
	executeObjectReferenceAction,
} from './runtime';
export type {
	JsonPrimitive,
	JsonValue,
	ObjectReferenceActionDescriptor,
	ObjectReferenceActionEvent,
	ObjectReferenceActionHandler,
	ObjectReferenceActionRenderContext,
	ObjectReferenceActionVariant,
	ObjectReferenceCopyHandler,
	ObjectReferenceDescriptor,
	ObjectReferenceHandlerProps,
	ObjectReferenceIconRenderContext,
	ObjectReferenceInteractivityVisibility,
	ObjectReferenceKind,
	ObjectReferenceMetadata,
	ObjectReferenceOpenHrefHandler,
	ObjectReferenceOpenTarget,
	ObjectReferencePanelBreakpoint,
	ObjectReferencePanelMode,
	ObjectReferencePropertyRenderContext,
	ObjectReferenceRenderContext,
	ObjectReferenceSectionDescriptor,
	ObjectReferenceSectionRenderContext,
} from './types';
export {
	normalizeSafeObjectReferenceHref,
	SAFE_OBJECT_REFERENCE_PROTOCOLS,
} from './url-safety';
