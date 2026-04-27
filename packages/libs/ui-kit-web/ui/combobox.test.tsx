import { afterEach, beforeAll, describe, expect, test } from 'bun:test';
import Window from 'happy-dom/lib/window/Window.js';
import * as React from 'react';
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { Button } from './button';
import { Combobox } from './combobox';

beforeAll(() => {
	const windowInstance = new Window({
		url: 'https://web-combobox.contractspec.local/tests',
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
		HTMLInputElement: windowInstance.HTMLInputElement,
		HTMLButtonElement: windowInstance.HTMLButtonElement,
		Node: windowInstance.Node,
		Event: windowInstance.Event,
		FocusEvent: windowInstance.FocusEvent,
		KeyboardEvent: windowInstance.KeyboardEvent,
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

function focus(element: HTMLElement) {
	act(() => {
		element.focus();
	});
}

function keyDown(element: HTMLElement, key: string) {
	act(() => {
		element.dispatchEvent(
			new window.KeyboardEvent('keydown', {
				key,
				bubbles: true,
				cancelable: true,
			})
		);
	});
}

function click(element: Element | null) {
	if (!element) throw new Error('Expected element to exist.');
	act(() => {
		element.dispatchEvent(
			new window.MouseEvent('click', { bubbles: true, cancelable: true })
		);
	});
}

function renderCombobox(node: React.ReactNode) {
	const container = document.createElement('div');
	document.body.append(container);
	const root = createRoot(container);
	act(() => {
		root.render(node);
	});
	return { container, root };
}

describe('ui-kit-web Combobox', () => {
	test('forwards Button refs through slotted rendering', () => {
		const forwardedElements: (HTMLElement | null)[] = [];
		const { root } = renderCombobox(
			<Button
				asChild
				ref={(node) => {
					forwardedElements.push(node);
				}}
			>
				<a href="#details">Details</a>
			</Button>
		);
		const forwardedElement =
			forwardedElements.find((node): node is HTMLElement => node !== null) ??
			null;

		expect(forwardedElement).toBeInstanceOf(HTMLElement);
		expect(forwardedElement?.tagName).toBe('A');

		act(() => {
			root.unmount();
		});
	});

	test('renders editable autocomplete semantics and supports keyboard selection', () => {
		let selectedValue: string | undefined;
		const { container, root } = renderCombobox(
			<Combobox
				id="reviewer"
				query=""
				onQueryChange={() => undefined}
				options={[
					{ value: 'usr_1', label: 'Alice Martin' },
					{ value: 'usr_2', label: 'Bob Chen', description: 'Reviewer' },
				]}
				onValueChange={(value) => {
					selectedValue = value;
				}}
				placeholder="Search reviewers"
			/>
		);
		const input = container.querySelector('input[role="combobox"]');
		if (!(input instanceof HTMLInputElement)) {
			throw new Error('Expected combobox input.');
		}

		expect(input.getAttribute('aria-expanded')).toBe('false');
		expect(input.getAttribute('aria-controls')).toBe('reviewer-listbox');

		focus(input);

		expect(input.getAttribute('aria-expanded')).toBe('true');
		expect(
			document.getElementById('reviewer-listbox')?.getAttribute('role')
		).toBe('listbox');

		keyDown(input, 'ArrowDown');
		expect(input.getAttribute('aria-activedescendant')).toBe(
			'reviewer-listbox-usr_2'
		);

		keyDown(input, 'Enter');
		expect(selectedValue).toBe('usr_2');
		expect(input.getAttribute('aria-expanded')).toBe('false');

		act(() => {
			root.unmount();
		});
	});

	test('renders loading, error, empty, and multi-select chip states', () => {
		let removedValue: string | undefined;
		const { container, root } = renderCombobox(
			<Combobox
				id="assignees"
				query=""
				multiple
				selectedValues={['usr_1']}
				onRemoveValue={(value) => {
					removedValue = value;
				}}
				options={[{ value: 'usr_1', label: 'Alice Martin' }]}
				loading
				loadingText="Loading reviewers"
				emptyText="No reviewers"
				errorText="Reviewer search failed"
			/>
		);
		const input = container.querySelector('input[role="combobox"]');
		if (!(input instanceof HTMLInputElement)) {
			throw new Error('Expected combobox input.');
		}

		focus(input);
		expect(document.body.textContent).toContain('Loading reviewers');
		expect(document.body.textContent).toContain('Alice Martin');
		expect(container.querySelector('button')?.getAttribute('aria-label')).toBe(
			'Remove Alice Martin'
		);

		click(container.querySelector('button'));
		expect(removedValue).toBe('usr_1');

		act(() => {
			root.render(
				<Combobox
					id="assignees"
					query=""
					options={[]}
					error="Resolver failed"
					errorText="Reviewer search failed"
				/>
			);
		});
		const errorInput = container.querySelector('input[role="combobox"]');
		if (!(errorInput instanceof HTMLInputElement)) {
			throw new Error('Expected error combobox input.');
		}
		focus(errorInput);
		expect(document.body.textContent).toContain('Resolver failed');

		act(() => {
			root.render(
				<Combobox
					id="assignees"
					query=""
					options={[]}
					emptyText="No reviewers"
				/>
			);
		});
		const emptyInput = container.querySelector('input[role="combobox"]');
		if (!(emptyInput instanceof HTMLInputElement)) {
			throw new Error('Expected empty combobox input.');
		}
		focus(emptyInput);
		expect(document.body.textContent).toContain('No reviewers');

		act(() => {
			root.unmount();
		});
	});
});
