import { afterEach, beforeAll, describe, expect, test } from 'bun:test';
import type { TemplateDefinition } from '@contractspec/lib.example-shared-ui';
import {
	TemplateRuntimeContext,
	type TemplateRuntimeContextValue,
} from '@contractspec/lib.example-shared-ui';
import Window from 'happy-dom/lib/window/Window.js';
import type { ReactNode } from 'react';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import type {
	Integration,
	IntegrationHandlers,
} from '../handlers/integration.handlers';
import { IntegrationDashboard } from './IntegrationDashboard';

beforeAll(() => {
	const windowInstance = new Window({
		url: 'https://contractspec.local/templates',
	});
	Object.defineProperty(windowInstance, 'SyntaxError', {
		value: SyntaxError,
		configurable: true,
	});
	const encodeURIComponentFromGlobal =
		globalThis.encodeURIComponent.bind(globalThis);
	const decodeURIComponentFromGlobal =
		globalThis.decodeURIComponent.bind(globalThis);
	Object.assign(windowInstance, {
		encodeURIComponent: encodeURIComponentFromGlobal,
		decodeURIComponent: decodeURIComponentFromGlobal,
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

async function render(ui: ReactNode) {
	const container = document.createElement('div');
	document.body.append(container);
	const root: Root = createRoot(container);

	await act(async () => {
		root.render(ui);
	});

	return { container, root };
}

const SEEDED_INTEGRATION: Integration = {
	id: 'integration-salesforce',
	projectId: 'marketing-preview-integration-hub',
	organizationId: 'org-preview',
	name: 'Salesforce',
	type: 'CRM',
	status: 'ACTIVE',
	createdAt: new Date('2026-04-29T00:00:00.000Z'),
	updatedAt: new Date('2026-04-29T00:00:00.000Z'),
};

describe('IntegrationDashboard template preview runtime', () => {
	test('uses the runtime project id when loading seeded preview data', async () => {
		const queriedProjectIds: string[] = [];
		const handlers = {
			integration: {
				listIntegrations: async (input: { projectId: string }) => {
					queriedProjectIds.push(input.projectId);
					return {
						integrations:
							input.projectId === 'marketing-preview-integration-hub'
								? [SEEDED_INTEGRATION]
								: [],
						total:
							input.projectId === 'marketing-preview-integration-hub' ? 1 : 0,
					};
				},
				listConnections: async () => ({ connections: [], total: 0 }),
				listSyncConfigs: async () => ({ configs: [], total: 0 }),
			} as Partial<IntegrationHandlers> as IntegrationHandlers,
		};
		const context = {
			template: {
				id: 'integration-hub',
				name: 'Integration Hub',
			} as TemplateDefinition,
			runtime: {},
			installer: {},
			client: {},
			templateId: 'integration-hub',
			projectId: 'marketing-preview-integration-hub',
			engine: {},
			handlers,
			fetchData: async () => ({ data: null }),
		} as unknown as TemplateRuntimeContextValue<typeof handlers>;

		const { container } = await render(
			<TemplateRuntimeContext.Provider value={context}>
				<IntegrationDashboard />
			</TemplateRuntimeContext.Provider>
		);

		await act(async () => {
			await new Promise((resolve) => setTimeout(resolve, 0));
		});

		expect(queriedProjectIds).toEqual(['marketing-preview-integration-hub']);
		expect(container.textContent).toContain('Salesforce');
		expect(container.textContent).not.toContain('No integrations configured');
	});
});
