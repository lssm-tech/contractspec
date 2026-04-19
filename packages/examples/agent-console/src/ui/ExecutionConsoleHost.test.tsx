import { afterEach, beforeAll, describe, expect, it } from 'bun:test';
import {
	type TemplateDefinition,
	TemplateRuntimeContext,
	type TemplateRuntimeContextValue,
} from '@contractspec/lib.example-shared-ui';
import Window from 'happy-dom/lib/window/Window.js';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import type { AgentHandlers } from '../handlers/agent.handlers';
import {
	AGENT_CONSOLE_DEMO_ORGANIZATION_ID,
	createAgentConsoleDemoHandlers,
} from '../shared';
import { ExecutionConsoleHost } from './ExecutionConsoleHost';

const PROJECT_ID = 'agent-console-execution-host';
const TEMPLATE: TemplateDefinition = {
	id: 'agent-console',
	name: 'Agent Console',
	description: 'Deterministic execution console host smoke test.',
	category: 'ai',
	complexity: 'intermediate',
	icon: '🤖',
	features: ['agents', 'runs', 'tools', 'metrics'],
	tags: ['sandbox', 'smoke'],
	schema: { models: ['Agent', 'Run', 'Tool'], contracts: [] },
	components: {
		list: 'AgentListView',
		detail: 'RunListView',
		form: 'CreateAgentModal',
	},
};

beforeAll(() => {
	const windowInstance = new Window({
		url: 'https://sandbox.contractspec.local/sandbox?template=agent-console',
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
		HTMLInputElement: windowInstance.HTMLInputElement,
		HTMLTextAreaElement: windowInstance.HTMLTextAreaElement,
		Node: windowInstance.Node,
		Event: windowInstance.Event,
		MouseEvent: windowInstance.MouseEvent,
		KeyboardEvent: windowInstance.KeyboardEvent,
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

function createContextValue(
	handlers: AgentHandlers
): TemplateRuntimeContextValue<{ agent: AgentHandlers }> {
	return {
		template: TEMPLATE,
		runtime: {},
		installer: {
			install: async () => {},
			saveToStudio: async () => ({ projectId: PROJECT_ID, status: 'saved' }),
		},
		client: {} as never,
		templateId: TEMPLATE.id,
		projectId: PROJECT_ID,
		engine: {} as never,
		fetchData: async () => ({ data: null }),
		handlers: { agent: handlers },
	};
}

describe('ExecutionConsoleHost smoke', () => {
	it('renders the agent dashboard and execution lane console together', async () => {
		const container = document.createElement('div');
		document.body.append(container);
		const root: Root = createRoot(container);
		const handlers = createAgentConsoleDemoHandlers({
			projectId: PROJECT_ID,
			organizationId: AGENT_CONSOLE_DEMO_ORGANIZATION_ID,
		});

		await act(async () => {
			root.render(
				<TemplateRuntimeContext.Provider value={createContextValue(handlers)}>
					<ExecutionConsoleHost />
				</TemplateRuntimeContext.Provider>
			);
		});

		expect(document.body.textContent).toContain('AI Agent Console');
		expect(document.body.textContent).toContain('Timeline');
		expect(document.body.textContent).toContain('Completion Loop');
		expect(document.body.textContent).toContain('Export Evidence');
	});
});
