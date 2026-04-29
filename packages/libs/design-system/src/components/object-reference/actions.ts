import type {
	ObjectReferenceActionDescriptor,
	ObjectReferenceDescriptor,
	ObjectReferenceOpenTarget,
} from './types';

export {
	createMapsProviderHref,
	createMapsReferenceActions,
	type ObjectReferenceMapsActionOptions,
	type ObjectReferenceMapsProvider,
} from './maps';

import { createMapsReferenceActions } from './maps';

export interface ObjectReferenceOpenActionOptions {
	label?: string;
	openTarget?: ObjectReferenceOpenTarget;
}

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
	options: string | ObjectReferenceOpenActionOptions = {}
): ObjectReferenceActionDescriptor | null {
	if (!reference.href) {
		return null;
	}

	const resolvedOptions =
		typeof options === 'string' ? { label: options } : options;

	return {
		id: 'open',
		label: resolvedOptions.label ?? 'Open details',
		description: 'Open the related page or resource',
		href: reference.href,
		openTarget: resolvedOptions.openTarget ?? reference.openTarget,
		iconKey: 'external-link',
	};
}

export function createEmailReferenceAction(
	reference: ObjectReferenceDescriptor,
	label = 'Email'
): ObjectReferenceActionDescriptor | null {
	if (reference.kind !== 'email') {
		return null;
	}

	const email = compact(reference.value ?? reference.label);
	if (!email) {
		return null;
	}

	return {
		id: 'email',
		label,
		description: 'Send an email',
		href: `mailto:${email}`,
		iconKey: 'email',
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
		createEmailReferenceAction(reference),
		createPhoneReferenceAction(reference),
		...createMapsReferenceActions(reference),
	].filter((action): action is ObjectReferenceActionDescriptor =>
		Boolean(action)
	);
}
