import { afterEach, beforeAll, describe, expect, test } from 'bun:test';
import Window from 'happy-dom/lib/window/Window.js';
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { InputPassword } from './input-password';

beforeAll(() => {
	const windowInstance = new Window({
		url: 'https://web-input-password.contractspec.local/tests',
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
		IS_REACT_ACT_ENVIRONMENT: true,
	});
});

afterEach(() => {
	document.body.innerHTML = '';
});

function renderPasswordInput(props = {}) {
	const container = document.createElement('div');
	document.body.append(container);
	const root = createRoot(container);

	act(() => {
		root.render(
			<InputPassword
				{...props}
				name="password"
				passwordPurpose="new"
				showLabel="Show secret"
				hideLabel="Hide secret"
			/>
		);
	});

	return { container, root };
}

function click(element: Element | null) {
	if (!element) throw new Error('Expected element to exist.');
	act(() => {
		element.dispatchEvent(
			new window.MouseEvent('click', { bubbles: true, cancelable: true })
		);
	});
}

describe('ui-kit-web InputPassword', () => {
	test('renders masked by default and toggles visibility accessibly', () => {
		const { container, root } = renderPasswordInput();
		const input = container.querySelector('input');
		const button = container.querySelector('button');

		expect(input?.getAttribute('type')).toBe('password');
		expect(input?.getAttribute('autocomplete')).toBe('new-password');
		expect(button?.getAttribute('aria-label')).toBe('Show secret');
		expect(button?.getAttribute('aria-pressed')).toBe('false');

		click(button);

		expect(input?.getAttribute('type')).toBe('text');
		expect(button?.getAttribute('aria-label')).toBe('Hide secret');
		expect(button?.getAttribute('aria-pressed')).toBe('true');

		click(button);

		expect(input?.getAttribute('type')).toBe('password');
		expect(button?.getAttribute('aria-label')).toBe('Show secret');
		expect(button?.getAttribute('aria-pressed')).toBe('false');

		act(() => {
			root.unmount();
		});
	});

	test('keeps the visibility state authoritative over caller type props', () => {
		const propsWithForcedType = {
			type: 'password',
		};
		const { container, root } = renderPasswordInput(propsWithForcedType);
		const input = container.querySelector('input');
		const button = container.querySelector('button');

		expect(input?.getAttribute('type')).toBe('password');

		click(button);

		expect(input?.getAttribute('type')).toBe('text');
		expect(button?.getAttribute('aria-label')).toBe('Hide secret');
		expect(button?.getAttribute('aria-pressed')).toBe('true');

		click(button);

		expect(input?.getAttribute('type')).toBe('password');

		act(() => {
			root.unmount();
		});
	});
});
