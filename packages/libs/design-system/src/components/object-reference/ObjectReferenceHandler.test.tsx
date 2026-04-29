import { afterEach, beforeAll, describe, expect, it } from 'bun:test';
import Window from 'happy-dom/lib/window/Window.js';
import * as React from 'react';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { AdaptivePanel, toAdaptivePanelBreakpointQuery } from '../overlays';
import {
	createDefaultObjectReferenceActions,
	createMapsProviderHref,
	createMapsReferenceActions,
} from './actions';
import { DefaultReferenceDetail } from './DefaultObjectReferenceDetail';
import { ObjectReferenceHandler } from './ObjectReferenceHandler';
import { executeObjectReferenceAction } from './runtime';
import type {
	ObjectReferenceActionEvent,
	ObjectReferenceDescriptor,
} from './types';
import { normalizeSafeObjectReferenceHref } from './url-safety';

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
		matchMedia: (query: string) => ({
			matches: query.includes('min-width'),
			media: query,
			addEventListener: () => undefined,
			removeEventListener: () => undefined,
		}),
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

describe('AdaptivePanel', () => {
	it('exposes reusable sheet and drawer modes from the same API', async () => {
		expect(toAdaptivePanelBreakpointQuery('md')).toBe('(min-width: 768px)');
		expect(toAdaptivePanelBreakpointQuery(900)).toBe('(min-width: 900px)');

		const sheet = await renderNode(
			<AdaptivePanel
				open
				onOpenChange={() => undefined}
				mode="sheet"
				trigger={<span>Open sheet</span>}
				title="Sheet title"
			>
				<div>Sheet body</div>
			</AdaptivePanel>
		);

		await act(async () => {
			await new Promise((resolve) => setTimeout(resolve, 0));
		});
		expect(document.body.textContent).toContain('Open sheet');

		await act(async () => {
			sheet.root.unmount();
		});
		document.body.innerHTML = '';

		const drawer = await renderNode(
			<AdaptivePanel
				open
				onOpenChange={() => undefined}
				mode="drawer"
				trigger={<span>Open drawer</span>}
				title="Drawer title"
			>
				<div>Drawer body</div>
			</AdaptivePanel>
		);

		await act(async () => {
			await new Promise((resolve) => setTimeout(resolve, 0));
		});
		expect(document.body.textContent).toContain('Open drawer');

		await act(async () => {
			drawer.root.unmount();
		});
	});
});

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
				id: 'email-1',
				kind: 'email',
				label: 'ada@example.com',
			}).map((item) => item.id)
		).toEqual(['copy', 'email']);

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
			<ObjectReferenceHandler panelMode="sheet" reference={addressReference} />
		);

		expect(container.textContent).toContain('10 Downing Street');

		await act(async () => {
			root.unmount();
		});
	});

	it('opens the same-page panel by default from the trigger', async () => {
		const changes: boolean[] = [];
		const { root } = await renderNode(
			<ObjectReferenceHandler
				reference={addressReference}
				onOpenChange={(open) => changes.push(open)}
			/>
		);

		await act(async () => {
			document
				.querySelector('button')
				?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
			await new Promise((resolve) => setTimeout(resolve, 0));
		});

		expect(changes).toEqual([true]);

		await act(async () => {
			root.unmount();
		});
	});

	it('can open trigger details in a new page when configured', async () => {
		const opened: Array<{ href: string; target: string }> = [];
		const changes: boolean[] = [];
		const { root } = await renderNode(
			<ObjectReferenceHandler
				reference={{
					...addressReference,
					href: '/customers/site-1',
				}}
				openTarget="new-page"
				onOpenChange={(open) => changes.push(open)}
				openHref={(href, _event, options) => {
					opened.push({ href, target: options.target });
				}}
			/>
		);

		await act(async () => {
			document
				.querySelector('button')
				?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
		});

		expect(opened).toEqual([{ href: '/customers/site-1', target: 'new-page' }]);
		expect(changes).toEqual([]);

		await act(async () => {
			root.unmount();
		});
	});

	it('renders rich nested properties and their interactions', async () => {
		const richReference: ObjectReferenceDescriptor = {
			id: 'user-1',
			kind: 'user',
			label: 'Ada Lovelace',
			properties: [
				{
					id: 'user-1-email',
					kind: 'email',
					label: 'Email',
					value: 'ada@example.com',
				},
				{
					id: 'user-1-phone',
					kind: 'phone',
					label: 'Phone',
					value: '+33 1 23 45 67 89',
				},
			],
			sections: [
				{
					id: 'location',
					title: 'Location',
					properties: [
						{
							id: 'user-1-address',
							kind: 'address',
							label: 'Address',
							value: '10 Downing Street, London',
						},
					],
				},
			],
		};

		const { root } = await renderNode(
			<DefaultReferenceDetail
				context={{
					reference: richReference,
					actions: [],
					open: true,
					setOpen: () => undefined,
				}}
				runReferenceAction={() => undefined}
			/>
		);

		await act(async () => {
			await new Promise((resolve) => setTimeout(resolve, 0));
		});

		expect(document.body.textContent).toContain('Ada Lovelace');
		expect(document.body.textContent).toContain('ada@example.com');
		expect(document.body.textContent).toContain('Email');
		expect(document.body.textContent).toContain('Call');
		expect(document.body.textContent).toContain('Location');
		expect(document.body.textContent).toContain('Open in Google Maps');

		await act(async () => {
			root.unmount();
		});
	});

	it('blocks unsafe object-reference href schemes before opening', async () => {
		expect(normalizeSafeObjectReferenceHref('/customers/1')).toBe(
			'/customers/1'
		);
		expect(normalizeSafeObjectReferenceHref('#details')).toBe('#details');
		expect(normalizeSafeObjectReferenceHref('https://example.com/a')).toBe(
			'https://example.com/a'
		);
		expect(normalizeSafeObjectReferenceHref('javascript:alert(1)')).toBeNull();
		expect(normalizeSafeObjectReferenceHref('data:text/html,boom')).toBeNull();
		expect(normalizeSafeObjectReferenceHref('file:///etc/passwd')).toBeNull();
		expect(normalizeSafeObjectReferenceHref('//evil.example/path')).toBeNull();

		const opened: string[] = [];
		const errors: unknown[] = [];
		await executeObjectReferenceAction(
			{
				reference: addressReference,
				action: {
					id: 'open',
					label: 'Open',
					href: 'javascript:alert(1)',
				},
				source: 'action',
			},
			{
				openHref: (href) => opened.push(href),
				onActionError: (error) => errors.push(error),
			}
		);

		expect(opened).toEqual([]);
		expect(errors).toHaveLength(1);
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
				openHref: (href, _event, options) => {
					calls.push(`open:${options.target}:${href}`);
				},
			}
		);

		expect(calls).toEqual([
			'handler:copy',
			'onAction:copy',
			'open:same-page:https://www.google.com/maps/search/?api=1&query=10%20Downing%20Street',
			'onAction:maps.google',
		]);
		expect(events.map((event) => event.reference.id)).toEqual([
			'site-1',
			'site-1',
		]);
	});
});
