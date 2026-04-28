import { afterEach, beforeAll, describe, expect, it } from 'bun:test';
import Window from 'happy-dom/lib/window/Window.js';
import * as React from 'react';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import {
	createDefaultObjectReferenceActions,
	createMapsProviderHref,
	createMapsReferenceActions,
} from './actions';
import { ObjectReferenceHandler } from './ObjectReferenceHandler';
import { executeObjectReferenceAction } from './runtime';
import type {
	ObjectReferenceActionEvent,
	ObjectReferenceDescriptor,
} from './types';

beforeAll(() => {
	const windowInstance = new Window({
		url: 'https://design-system-object-reference.contractspec.local/tests',
	});
	Object.defineProperty(windowInstance, 'SyntaxError', {
		value: SyntaxError,
		configurable: true,
	});
	Object.assign(globalThis, {
		window: windowInstance,
		document: windowInstance.document,
		navigator: windowInstance.navigator,
		location: windowInstance.location,
		HTMLElement: windowInstance.HTMLElement,
		HTMLButtonElement: windowInstance.HTMLButtonElement,
		Node: windowInstance.Node,
		Event: windowInstance.Event,
		MouseEvent: windowInstance.MouseEvent,
		MutationObserver: windowInstance.MutationObserver,
		DocumentFragment: windowInstance.DocumentFragment,
		getComputedStyle: windowInstance.getComputedStyle.bind(windowInstance),
		requestAnimationFrame: (callback: FrameRequestCallback) =>
			setTimeout(() => callback(Date.now()), 0),
		cancelAnimationFrame: (id: number) => clearTimeout(id),
		IS_REACT_ACT_ENVIRONMENT: true,
	});
});

afterEach(() => {
	document.body.innerHTML = '';
});

async function renderNode(node: React.ReactElement) {
	const container = document.createElement('div');
	document.body.append(container);
	const root: Root = createRoot(container);

	await act(async () => {
		root.render(node);
	});

	return { container, root };
}

const addressReference: ObjectReferenceDescriptor = {
	id: 'site-1',
	kind: 'address',
	label: '10 Downing Street',
	value: '10 Downing Street, London',
	metadata: {
		country: 'GB',
	},
};

describe('ObjectReferenceHandler actions', () => {
	it('builds schema-friendly default address, phone, and file actions', () => {
		expect(createMapsProviderHref('google', '10 Downing Street')).toContain(
			'query=10%20Downing%20Street'
		);
		expect(
			createMapsReferenceActions(addressReference).map((item) => item.id)
		).toEqual(['maps.google', 'maps.apple', 'maps.waze']);

		expect(
			createDefaultObjectReferenceActions({
				id: 'phone-1',
				kind: 'phone',
				label: '+33 1 23 45 67 89',
			}).map((item) => item.id)
		).toEqual(['copy', 'call']);

		expect(
			createDefaultObjectReferenceActions({
				id: 'file-1',
				kind: 'file',
				label: 'Invoice.pdf',
				href: '/files/invoice.pdf',
			}).map((item) => item.id)
		).toEqual(['copy', 'open']);
	});
});

describe('ObjectReferenceHandler', () => {
	it('renders a trigger for the reference label', async () => {
		const { container, root } = await renderNode(
			<ObjectReferenceHandler reference={addressReference} />
		);

		expect(container.textContent).toContain('10 Downing Street');

		await act(async () => {
			root.unmount();
		});
	});

	it('runs actions in deterministic order', async () => {
		const calls: string[] = [];
		const events: ObjectReferenceActionEvent[] = [];
		const copyAction = {
			id: 'copy',
			label: 'Copy',
			metadata: { copyText: '10 Downing Street, London' },
		};
		const mapsAction = {
			id: 'maps.google',
			label: 'Open in Google Maps',
			href: 'https://www.google.com/maps/search/?api=1&query=10%20Downing%20Street',
		};

		await executeObjectReferenceAction(
			{ reference: addressReference, action: copyAction, source: 'action' },
			{
				actionHandlers: {
					copy: (event) => {
						calls.push(`handler:${event.action.id}`);
					},
				},
				onAction: (event) => {
					calls.push(`onAction:${event.action.id}`);
					events.push(event);
				},
				openHref: (href) => {
					calls.push(`open:${href}`);
				},
			}
		);

		await executeObjectReferenceAction(
			{ reference: addressReference, action: mapsAction, source: 'action' },
			{
				onAction: (event) => {
					calls.push(`onAction:${event.action.id}`);
					events.push(event);
				},
				openHref: (href) => {
					calls.push(`open:${href}`);
				},
			}
		);

		expect(calls).toEqual([
			'handler:copy',
			'onAction:copy',
			'open:https://www.google.com/maps/search/?api=1&query=10%20Downing%20Street',
			'onAction:maps.google',
		]);
		expect(events.map((event) => event.reference.id)).toEqual([
			'site-1',
			'site-1',
		]);
	});
});
