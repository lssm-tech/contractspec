import { afterEach, beforeAll, describe, expect, it } from 'bun:test';
import {
	createImportPlan,
	createRecordBatch,
	defineImportTemplate,
	type FieldMapping,
	previewImport,
} from '@contractspec/lib.data-exchange-core';
import { defineSchemaModel, ScalarTypeEnum } from '@contractspec/lib.schema';
import Window from 'happy-dom/lib/window/Window.js';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { useDataExchangeController } from './controllers';
import type { DataExchangeController } from './types';
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

	it('updates controller mappings without mutating the preview plan', () => {
		const schema = defineSchemaModel({
			name: 'AccountImport',
			fields: {
				id: { type: ScalarTypeEnum.ID(), isOptional: false },
				status: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
			},
		});
		const sourceBatch = createRecordBatch(
			[{ external_id: 'acc-1', status: 'active', extra: 'ignored' }],
			{ format: 'json' }
		);
		const template = defineImportTemplate({
			key: 'accounts.import',
			version: '1.0.0',
			columns: [
				{
					key: 'id',
					label: 'ID',
					targetField: 'id',
					required: true,
					sourceAliases: ['external_id'],
				},
				{
					key: 'status',
					label: 'Status',
					targetField: 'status',
					required: true,
				},
				{
					key: 'note',
					label: 'Note',
					targetField: 'note',
					required: true,
				},
			],
		});
		const preview = previewImport(
			createImportPlan({
				source: { kind: 'memory', batch: sourceBatch, format: 'json' },
				target: { kind: 'memory', format: 'json' },
				schema,
				sourceBatch,
				template,
			})
		);
		const originalMappings: FieldMapping[] = preview.plan.mappings.map(
			(mapping) => ({ ...mapping })
		);
		let controller: DataExchangeController | undefined;

		function Harness() {
			controller = useDataExchangeController({ preview });
			return <div>{controller.model.mappingRows.length}</div>;
		}

		const container = document.createElement('div');
		document.body.append(container);
		const root: Root = createRoot(container);

		act(() => {
			root.render(<Harness />);
		});
		expect(controller?.model.unmatchedRequiredRows[0]?.targetField).toBe(
			'note'
		);
		expect(controller?.model.ignoredSourceColumns).toContain('extra');

		act(() => {
			controller?.selectAlias('note', 'extra');
			controller?.selectAlias('id', 'external_id');
			controller?.updateFieldFormat('status', {
				kind: 'text',
				case: 'uppercase',
			});
			controller?.acceptInferredMappings();
		});

		expect(
			controller?.mappings.find((mapping) => mapping.targetField === 'id')
				?.sourceField
		).toBe('external_id');
		expect(
			controller?.mappings.find((mapping) => mapping.targetField === 'id')
				?.status
		).toBe('manual');
		expect(
			controller?.mappings.find((mapping) => mapping.targetField === 'note')
				?.sourceField
		).toBe('extra');
		expect(controller?.model.ignoredSourceColumns).not.toContain('extra');
		expect(
			controller?.mappings.find((mapping) => mapping.targetField === 'status')
				?.format?.case
		).toBe('uppercase');
		expect(
			controller?.mappings.every((mapping) => mapping.status === 'manual')
		).toBe(true);
		expect(preview.plan.mappings).toEqual(originalMappings);

		act(() => {
			controller?.resetMappings();
		});
		expect(controller?.mappings).toEqual(preview.plan.mappings);

		act(() => {
			controller?.updateFieldFormat('status', {
				kind: 'text',
				case: 'uppercase',
			});
			controller?.updateFieldFormat('status', undefined);
		});
		expect(
			controller?.mappings.find((mapping) => mapping.targetField === 'status')
				?.format
		).toBeUndefined();

		act(() => {
			controller?.resetToTemplate();
		});
		expect(controller?.mappings).toEqual(
			preview.plan.templateMapping?.mappings
		);

		act(() => {
			root.unmount();
		});
	});
});
