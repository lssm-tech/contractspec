import type {
	ObjectReferenceActionDescriptor,
	ObjectReferenceDescriptor,
} from './types';

export {
	createMapsProviderHref,
	createMapsReferenceActions,
	type ObjectReferenceMapsActionOptions,
	type ObjectReferenceMapsProvider,
} from './maps';

import { createMapsReferenceActions } from './maps';

function compact(value: string): string {
	return value.trim().replace(/\s+/g, ' ');
}

export function getObjectReferenceDisplayValue(
	reference: ObjectReferenceDescriptor
): string {
	return reference.value ?? reference.href ?? reference.label;
}

export function createCopyReferenceAction(
	reference: ObjectReferenceDescriptor,
	label = 'Copy'
): ObjectReferenceActionDescriptor {
	return {
		id: 'copy',
		label,
		description: 'Copy this reference',
		iconKey: 'copy',
		metadata: {
			copyText: getObjectReferenceDisplayValue(reference),
		},
	};
}

export function createOpenReferenceAction(
	reference: ObjectReferenceDescriptor,
	label = 'Open details'
): ObjectReferenceActionDescriptor | null {
	if (!reference.href) {
		return null;
	}

	return {
		id: 'open',
		label,
		description: 'Open the related page or resource',
		href: reference.href,
		iconKey: 'external-link',
	};
}

export function createPhoneReferenceAction(
	reference: ObjectReferenceDescriptor,
	label = 'Call'
): ObjectReferenceActionDescriptor | null {
	if (reference.kind !== 'phone') {
		return null;
	}

	const phone = compact(reference.value ?? reference.label);
	if (!phone) {
		return null;
	}

	return {
		id: 'call',
		label,
		description: 'Call this phone number',
		href: `tel:${phone.replace(/[^\d+]/g, '')}`,
		iconKey: 'phone',
	};
}

export function createDefaultObjectReferenceActions(
	reference: ObjectReferenceDescriptor
): ObjectReferenceActionDescriptor[] {
	return [
		createCopyReferenceAction(reference),
		createOpenReferenceAction(reference),
		createPhoneReferenceAction(reference),
		...createMapsReferenceActions(reference),
	].filter((action): action is ObjectReferenceActionDescriptor =>
		Boolean(action)
	);
}
