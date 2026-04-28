import { getObjectReferenceDisplayValue } from './actions';
import type {
	ObjectReferenceActionEvent,
	ObjectReferenceHandlerProps,
} from './types';

export interface ExecuteObjectReferenceActionOptions {
	actionHandlers?: ObjectReferenceHandlerProps['actionHandlers'];
	copyText?: string;
	copyHandler?: ObjectReferenceHandlerProps['copyHandler'];
	openHref?: ObjectReferenceHandlerProps['openHref'];
	onAction?: ObjectReferenceHandlerProps['onAction'];
	onActionError?: ObjectReferenceHandlerProps['onActionError'];
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
			await openReferenceHref(event.action.href, event, options);
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
	options: ExecuteObjectReferenceActionOptions
): Promise<void> | void {
	if (options.openHref) {
		return options.openHref(href, event);
	}

	return options.defaultOpenHref?.(href, event);
}

function getMetadataString(value: unknown): string | undefined {
	return typeof value === 'string' ? value : undefined;
}
