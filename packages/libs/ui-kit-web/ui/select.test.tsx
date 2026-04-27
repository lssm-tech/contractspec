import { beforeAll, describe, expect, test } from 'bun:test';
import Window from 'happy-dom/lib/window/Window.js';
import * as React from 'react';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from './select';

beforeAll(() => {
	const windowInstance = new Window({
		url: 'https://ui-kit-web.contractspec.local/tests',
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
		FocusEvent: windowInstance.FocusEvent,
		MouseEvent: windowInstance.MouseEvent,
		PointerEvent: windowInstance.PointerEvent ?? windowInstance.MouseEvent,
		MutationObserver: windowInstance.MutationObserver,
		DocumentFragment: windowInstance.DocumentFragment,
		getComputedStyle: windowInstance.getComputedStyle.bind(windowInstance),
		requestAnimationFrame: (callback: FrameRequestCallback) =>
			setTimeout(() => callback(Date.now()), 0),
		cancelAnimationFrame: (id: number) => clearTimeout(id),
		IS_REACT_ACT_ENVIRONMENT: true,
	});
});

function groupedSelect(value: string) {
	return (
		<Select value={value}>
			<SelectTrigger>
				<SelectValue placeholder="Pick status" />
			</SelectTrigger>
			<SelectContent>
				<SelectGroup>
					<SelectLabel>Lifecycle</SelectLabel>
					<SelectItem value="draft">Draft</SelectItem>
				</SelectGroup>
				<SelectGroup>
					<SelectLabel>Release</SelectLabel>
					<SelectItem value="published">Published</SelectItem>
				</SelectGroup>
			</SelectContent>
		</Select>
	);
}

function renderSelect(node: React.ReactNode) {
	const container = document.createElement('div');
	document.body.append(container);
	const root: Root = createRoot(container);
	act(() => {
		root.render(node);
	});
	return { container, root };
}

describe('ui-kit-web Select', () => {
	test('mounts grouped Select items without recursive ref updates', () => {
		const { container, root } = renderSelect(groupedSelect('draft'));

		expect(
			container.querySelector('[data-slot="select-trigger"]')
		).toBeInstanceOf(HTMLButtonElement);

		act(() => {
			root.render(groupedSelect('published'));
		});

		act(() => {
			root.unmount();
		});
	});
});
