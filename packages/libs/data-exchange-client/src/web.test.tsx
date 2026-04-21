import { afterEach, beforeAll, describe, expect, it } from 'bun:test';
import {
	createImportPlan,
	previewImport,
} from '@contractspec/lib.data-exchange-core';
import { defineSchemaModel, ScalarTypeEnum } from '@contractspec/lib.schema';
import Window from 'happy-dom/lib/window/Window.js';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { WebMappingStudio } from './web';

beforeAll(() => {
	const windowInstance = new Window({
		url: 'https://data-exchange.contractspec.local/tests',
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

describe('data-exchange-client web', () => {
	it('renders the mapping studio with preview content', () => {
		const schema = defineSchemaModel({
			name: 'AccountImport',
			fields: {
				id: { type: ScalarTypeEnum.ID(), isOptional: false },
				status: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
			},
		});
		const sourceBatch = {
			format: 'json' as const,
			columns: [],
			records: [{ identifier: 'acc-1', status: 'active' }],
		};
		const preview = previewImport(
			createImportPlan({
				source: { kind: 'memory', batch: sourceBatch, format: 'json' },
				target: { kind: 'memory', format: 'json' },
				schema,
				sourceBatch,
				mappings: [
					{ sourceField: 'identifier', targetField: 'id' },
					{ sourceField: 'status', targetField: 'status' },
				],
			})
		);

		const container = document.createElement('div');
		document.body.append(container);
		const root: Root = createRoot(container);

		act(() => {
			root.render(<WebMappingStudio preview={preview} />);
		});

		expect(container.textContent).toContain('Data Exchange Studio');
		expect(container.textContent).toContain('Source Preview');
		expect(container.textContent).toContain('Normalized Preview');

		act(() => {
			root.unmount();
		});
	});
});
