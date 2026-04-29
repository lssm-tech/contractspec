import { getObjectReferenceDisplayValue } from './actions';
import type {
	ObjectReferenceActionEvent,
	ObjectReferenceHandlerProps,
	ObjectReferenceOpenTarget,
} from './types';
import { normalizeSafeObjectReferenceHref } from './url-safety';

export interface ExecuteObjectReferenceActionOptions {
	actionHandlers?: ObjectReferenceHandlerProps['actionHandlers'];
	copyText?: string;
	copyHandler?: ObjectReferenceHandlerProps['copyHandler'];
	openHref?: ObjectReferenceHandlerProps['openHref'];
	onAction?: ObjectReferenceHandlerProps['onAction'];
	onActionError?: ObjectReferenceHandlerProps['onActionError'];
	defaultOpenTarget?: ObjectReferenceOpenTarget;
	defaultCopy?: ObjectReferenceHandlerProps['copyHandler'];
	defaultOpenHref?: ObjectReferenceHandlerProps['openHref'];
}

export async function executeObjectReferenceAction(
	event: ObjectReferenceActionEvent,
	options: ExecuteObjectReferenceActionOptions
): Promise<void> {
	try {
		const actionHandler = options.actionHandlers?.[event.action.id];
		if (actionHandler) {
			await actionHandler(event);
		} else if (event.action.id === 'copy') {
			await copyReferenceText(event, options);
		} else if (event.action.href) {
			const safeHref = normalizeSafeObjectReferenceHref(event.action.href);
			if (!safeHref) {
				throw new Error('Unsafe object reference href.');
			}
			await openReferenceHref(
				safeHref,
				event,
				resolveOpenTarget(event, options),
				options
			);
		}

		await options.onAction?.(event);
	} catch (error) {
		options.onActionError?.(error, event);
	}
}

function copyReferenceText(
	event: ObjectReferenceActionEvent,
	options: ExecuteObjectReferenceActionOptions
): Promise<void> | void {
	const text =
		options.copyText ??
		getMetadataString(event.action.metadata?.copyText) ??
		getObjectReferenceDisplayValue(event.reference);

	if (options.copyHandler) {
		return options.copyHandler(text, event);
	}

	if (options.defaultCopy) {
		return options.defaultCopy(text, event);
	}

	throw new Error('Clipboard is not available.');
}

function openReferenceHref(
	href: string,
	event: ObjectReferenceActionEvent,
	target: ObjectReferenceOpenTarget,
	options: ExecuteObjectReferenceActionOptions
): Promise<void> | void {
	if (options.openHref) {
		return options.openHref(href, event, { target });
	}

	return options.defaultOpenHref?.(href, event, { target });
}

function resolveOpenTarget(
	event: ObjectReferenceActionEvent,
	options: ExecuteObjectReferenceActionOptions
): ObjectReferenceOpenTarget {
	return (
		event.action.openTarget ??
		getMetadataOpenTarget(event.action.metadata?.openTarget) ??
		event.reference.openTarget ??
		options.defaultOpenTarget ??
		'same-page'
	);
}

function getMetadataString(value: unknown): string | undefined {
	return typeof value === 'string' ? value : undefined;
}

function getMetadataOpenTarget(
	value: unknown
): ObjectReferenceOpenTarget | undefined {
	return value === 'same-page' || value === 'new-page' ? value : undefined;
}
