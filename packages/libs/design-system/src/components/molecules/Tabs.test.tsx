import { afterEach, beforeAll, describe, expect, test } from 'bun:test';
import Window from 'happy-dom/lib/window/Window.js';
import * as React from 'react';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './Tabs';

beforeAll(() => {
	const windowInstance = new Window({
		url: 'https://design-system-tabs.contractspec.local/tests',
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

function TabsHarness({
	defaultValue,
	onValueChange,
	value,
}: {
	defaultValue?: string;
	onValueChange?: (value: string) => void;
	value?: string;
}) {
	return (
		<Tabs
			defaultValue={defaultValue}
			value={value}
			onValueChange={onValueChange}
		>
			<TabsList>
				<TabsTrigger value="overview">Overview</TabsTrigger>
				<TabsTrigger value="details">Details</TabsTrigger>
			</TabsList>
			<TabsContent value="overview" forceMount>
				Overview content
			</TabsContent>
			<TabsContent value="details" forceMount>
				Details content
			</TabsContent>
		</Tabs>
	);
}

async function renderNode(node: React.ReactElement) {
	const container = document.createElement('div');
	document.body.append(container);
	const root: Root = createRoot(container);

	await act(async () => {
		root.render(node);
	});

	return { container, root };
}

async function click(element: Element | null) {
	if (!element) throw new Error('Expected element to exist.');
	await act(async () => {
		element.dispatchEvent(
			new window.MouseEvent('mousedown', { bubbles: true, cancelable: true })
		);
		element.dispatchEvent(
			new window.MouseEvent('mouseup', { bubbles: true, cancelable: true })
		);
		element.dispatchEvent(
			new window.MouseEvent('click', { bubbles: true, cancelable: true })
		);
	});
}

function tabButton(container: HTMLElement, label: string) {
	return Array.from(container.querySelectorAll('button')).find(
		(button) => button.textContent === label
	);
}

function activePanelText(container: HTMLElement) {
	return container.querySelector('[role="tabpanel"][data-state="active"]')
		?.textContent;
}

describe('Tabs', () => {
	test('renders uncontrolled tabs and emits selection changes', async () => {
		const selectedValues: string[] = [];
		const { container } = await renderNode(
			<TabsHarness
				defaultValue="overview"
				onValueChange={(nextValue) => selectedValues.push(nextValue)}
			/>
		);

		expect(activePanelText(container)).toBe('Overview content');

		await click(tabButton(container, 'Details') ?? null);

		expect(selectedValues).toEqual(['details']);
		expect(activePanelText(container)).toBe('Details content');
	});

	test('keeps controlled tabs tied to caller value', async () => {
		const selectedValues: string[] = [];
		const { container, root } = await renderNode(
			<TabsHarness
				value="overview"
				onValueChange={(nextValue) => selectedValues.push(nextValue)}
			/>
		);

		await click(tabButton(container, 'Details') ?? null);

		expect(selectedValues).toEqual(['details']);
		expect(activePanelText(container)).toBe('Overview content');

		await act(async () => {
			root.render(<TabsHarness value="details" />);
		});

		expect(activePanelText(container)).toBe('Details content');
	});
});
