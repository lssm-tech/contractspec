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
import { AgentDashboard } from './AgentDashboard';

const PROJECT_ID = 'agent-console-sandbox-smoke';
const TEMPLATE: TemplateDefinition = {
	id: 'agent-console',
	name: 'Agent Console',
	description: 'Deterministic sandbox smoke test template.',
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
		url: 'https://sandbox.contractspec.local/sandbox',
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
		HTMLInputElement: windowInstance.HTMLInputElement,
		HTMLTextAreaElement: windowInstance.HTMLTextAreaElement,
		Node: windowInstance.Node,
		Event: windowInstance.Event,
		MouseEvent: windowInstance.MouseEvent,
		KeyboardEvent: windowInstance.KeyboardEvent,
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

async function renderDashboard() {
	const container = document.createElement('div');
	document.body.append(container);
	const root: Root = createRoot(container);
	const handlers = createAgentConsoleDemoHandlers({
		projectId: PROJECT_ID,
		organizationId: AGENT_CONSOLE_DEMO_ORGANIZATION_ID,
		idFactory: (() => {
			const counters = { agent: 0, run: 0 };
			return (kind: 'agent' | 'run') => `${kind}-sandbox-${++counters[kind]}`;
		})(),
	});

	await act(async () => {
		root.render(
			<TemplateRuntimeContext.Provider value={createContextValue(handlers)}>
				<AgentDashboard />
			</TemplateRuntimeContext.Provider>
		);
	});

	return { container, root };
}

async function waitFor(assertion: () => boolean, timeoutMs = 3000) {
	const startedAt = Date.now();
	while (Date.now() - startedAt < timeoutMs) {
		if (assertion()) {
			return;
		}
		await act(async () => {
			await new Promise((resolve) => setTimeout(resolve, 25));
		});
	}
	throw new Error('Timed out waiting for dashboard state.');
}

function findButton(container: HTMLElement, label: string) {
	return [...container.getElementsByTagName('button')].find((element) =>
		element.textContent?.includes(label)
	);
}

function findExactButton(container: HTMLElement, label: string) {
	return [...container.getElementsByTagName('button')].find(
		(element) => element.textContent?.trim() === label
	);
}

function findAgentCard(container: HTMLElement, name: string) {
	return [...container.getElementsByTagName('*')].find(
		(element) =>
			element.getAttribute('role') === 'button' &&
			element.textContent?.includes(name)
	);
}

function getReactProp<T>(element: Element, propName: string): T | undefined {
	const record = element as unknown as Record<string, unknown>;
	const reactPropsKey = Object.keys(record).find((key) =>
		key.startsWith('__reactProps$')
	);
	if (!reactPropsKey) {
		return undefined;
	}
	const props = record[reactPropsKey];
	if (typeof props !== 'object' || props === null || !(propName in props)) {
		return undefined;
	}
	const value = (props as Record<string, unknown>)[propName];
	return value as T | undefined;
}

async function click(element: Element | null | undefined) {
	if (!element) {
		throw new Error('Expected clickable element.');
	}
	const onPress = getReactProp<(() => void) | undefined>(element, 'onPress');
	const onClick = getReactProp<
		((event: MouseEvent) => void) | undefined
	>(element, 'onClick');
	await act(async () => {
		if (typeof onPress === 'function') {
			onPress();
			return;
		}
		if (typeof onClick === 'function') {
			onClick(new MouseEvent('click', { bubbles: true }));
			return;
		}
		if ('click' in element && typeof element.click === 'function') {
			element.click();
			return;
		}
		element.dispatchEvent(new MouseEvent('click', { bubbles: true }));
	});
}

async function fill(selector: string, value: string) {
	const element = document.querySelector<
		HTMLInputElement | HTMLTextAreaElement
	>(selector);
	if (!element) {
		throw new Error(`Missing form field ${selector}.`);
	}
	const valueSetter = Object.getOwnPropertyDescriptor(
		Object.getPrototypeOf(element),
		'value'
	)?.set;
	if (!valueSetter) {
		throw new Error(`Missing value setter for ${selector}.`);
	}
	const onChange = getReactProp<
		(event: {
			target: { value: string };
			currentTarget: { value: string };
		}) => void
	>(element, 'onChange');
	await act(async () => {
		valueSetter.call(element, value);
		onChange?.({
			target: { value },
			currentTarget: { value },
		});
		if (!onChange) {
			element.dispatchEvent(new Event('input', { bubbles: true }));
			element.dispatchEvent(new Event('change', { bubbles: true }));
		}
	});
}

describe('AgentDashboard sandbox smoke', () => {
	it('loads seeded state, renders tabs, creates an agent, and executes a run', async () => {
		const { container, root } = await renderDashboard();
		await waitFor(
			() => container.textContent?.includes('AI Agent Console') === true
		);
		await waitFor(
			() =>
				container.textContent?.includes('Affichage de 1 à 3 sur 5 résultats') ===
				true
		);

		expect(container.textContent).toContain('Runs');
		expect(container.textContent).toContain('Agents');
		expect(container.textContent).toContain('Tools');
		expect(container.textContent).toContain('Metrics');
		expect(container.textContent).toContain('Run History');

		await click(findButton(container, 'Tools'));
		await waitFor(
			() => container.textContent?.includes('Total Tools') === true
		);
		await click(findButton(container, 'Metrics'));
		await waitFor(
			() => container.textContent?.includes('Usage Analytics') === true
		);
		await click(findButton(container, 'Agents'));
		await waitFor(() => container.textContent?.includes('Total: 4') === true);

		await click(findButton(container, 'New Agent'));
		await waitFor(
			() => document.body.textContent?.includes('Create New Agent') === true
		);
		await fill('#agent-name', 'Paris Meetup UI Agent');
		await fill(
			'#agent-description',
			'Smoke test agent for the sandbox walkthrough.'
		);
		await click(findButton(document.body, 'Create Agent'));
		await click(findButton(container, 'Runs'));
		await waitFor(
			() =>
				container.textContent?.includes('Affichage de 1 à 3 sur 5 résultats') ===
				true
		);
		await click(findButton(container, 'Agents'));
		await waitFor(
			() => container.textContent?.includes('Paris Meetup UI Agent') === true
		);
		await waitFor(() => container.textContent?.includes('Total: 5') === true);

		const agentCard = findAgentCard(container, 'Paris Meetup UI Agent');
		await click(agentCard);
		await waitFor(
			() => document.body.textContent?.includes('Activate Agent') === true
		);
		await click(findButton(document.body, 'Activate Agent'));
		await click(findButton(container, 'Runs'));
		await waitFor(() => container.textContent?.includes('Run History') === true);
		await click(findButton(container, 'Agents'));
		await waitFor(
			() =>
				findAgentCard(
					container,
					'Paris Meetup UI Agent'
				)?.textContent?.includes('ACTIVE') === true
		);

		const activeAgentCard = findAgentCard(container, 'Paris Meetup UI Agent');
		await click(activeAgentCard);
		await waitFor(
			() => document.body.textContent?.includes('Execute Agent') === true
		);
		await click(findButton(document.body, 'Execute Agent'));
		await waitFor(
			() => document.body.textContent?.includes('Message *') === true
		);
		await fill('#execute-message', 'Summarize the meetup smoke test.');
		await click(findButton(document.body, 'Execute'));

		await click(findButton(container, 'Runs'));
		await waitFor(
			() =>
				container.textContent?.includes('Affichage de 1 à 3 sur 6 résultats') ===
				true
		);
		await waitFor(
			() => container.textContent?.includes('Paris Meetup UI Agent') === true
		);

		await act(async () => {
			root.unmount();
		});
	});
});
