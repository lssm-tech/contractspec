import { afterEach, beforeAll, describe, expect, test } from 'bun:test';
import Window from 'happy-dom/lib/window/Window.js';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { DataGridShowcaseDataView } from '../contracts/data-grid-showcase.data-view';
import example from '../example';
import { DataGridShowcase } from './DataGridShowcase';

beforeAll(() => {
	const windowInstance = new Window({
		url: 'https://sandbox.contractspec.local/sandbox?template=data-grid-showcase',
	});
	Object.defineProperty(windowInstance, 'SyntaxError', {
		value: SyntaxError,
		configurable: true,
	});
	Object.assign(globalThis, {
		window: windowInstance,
		document: windowInstance.document,
		navigator: windowInstance.navigator,
		HTMLElement: windowInstance.HTMLElement,
		HTMLButtonElement: windowInstance.HTMLButtonElement,
		Node: windowInstance.Node,
		Event: windowInstance.Event,
		MouseEvent: windowInstance.MouseEvent,
		MutationObserver: windowInstance.MutationObserver,
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

async function renderShowcase() {
	const container = document.createElement('div');
	document.body.append(container);
	const root: Root = createRoot(container);

	await act(async () => {
		root.render(<DataGridShowcase />);
	});

	return { container, root };
}

function click(element: Element | null) {
	if (!element) {
		throw new Error('Expected element to exist before clicking.');
	}

	act(() => {
		element.dispatchEvent(
			new window.MouseEvent('click', { bubbles: true, cancelable: true })
		);
	});
}

describe('@contractspec/example.data-grid-showcase smoke', () => {
	test('publishes the focused table example metadata', () => {
		expect(example.meta.kind).toBe('ui');
		expect(example.entrypoints.packageName).toBe(
			'@contractspec/example.data-grid-showcase'
		);
		expect(example.surfaces.templates).toBe(false);
		expect(DataGridShowcaseDataView.view.kind).toBe('table');
	});

	test('renders the showcase table surfaces', async () => {
		const { container, root } = await renderShowcase();

		expect(container.textContent).toContain('Canonical example');
		expect(container.textContent).toContain('ContractSpec Data Table Showcase');
		expect(container.textContent).toContain('@contractspec/lib.contracts-spec');
		expect(container.textContent).toContain('@contractspec/lib.ui-kit');
		expect(container.textContent).toContain('@contractspec/lib.ui-kit-web');
		expect(container.textContent).toContain('@contractspec/lib.design-system');
		expect(container.textContent).toContain('Client');
		expect(container.textContent).toContain('Server');
		expect(container.textContent).toContain('DataView');
		expect(container.textContent).toContain('Web Primitive');
		expect(container.textContent).toContain('Native Primitive');
		expect(container.textContent).toContain('Pin Owner Right');
		expect(container.textContent).toContain('Unpin Owner');
		expect(container.textContent).toContain('Toggle ARR Sort');
		expect(container.textContent).toContain('Simulate Loading');
		expect(container.textContent).toContain('Show Empty State');
		expect(container.textContent).toContain('Interaction Log');
		expect(
			container.querySelector('th[aria-sort="descending"]')
		).not.toBeNull();

		click(container.querySelector('[aria-label="Expand row acct-1"]'));
		expect(container.textContent).not.toContain('Client: pressed row');

		const firstRow = Array.from(container.querySelectorAll('tr')).find((row) =>
			row.textContent?.includes('Northwind Cloud')
		);
		click(firstRow ?? null);
		expect(container.textContent).toContain(
			'Client: pressed row "Northwind Cloud" (healthy)'
		);

		await act(async () => {
			root.unmount();
		});
	}, 10000);
});
