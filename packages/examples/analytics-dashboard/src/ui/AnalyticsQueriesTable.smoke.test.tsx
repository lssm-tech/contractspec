import { afterEach, beforeAll, describe, expect, test } from 'bun:test';
import Window from 'happy-dom/lib/window/Window.js';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { AnalyticsQueriesTable } from './AnalyticsQueriesTable';

const queries = [
	{
		id: 'query-1',
		projectId: 'project-1',
		organizationId: 'org-1',
		name: 'Weekly Revenue',
		description: 'Revenue by week for the core self-serve product.',
		type: 'SQL' as const,
		definition: { metric: 'revenue', grain: 'week' },
		sql: 'select week, sum(amount) from revenue group by 1',
		cacheTtlSeconds: 60,
		isShared: true,
		createdAt: new Date('2026-03-01T09:00:00.000Z'),
		updatedAt: new Date('2026-03-18T09:00:00.000Z'),
	},
	{
		id: 'query-2',
		projectId: 'project-1',
		organizationId: 'org-1',
		name: 'Expansion Accounts',
		description: 'Tracks upsell candidates by score.',
		type: 'METRIC' as const,
		definition: { metric: 'expansionScore' },
		cacheTtlSeconds: 300,
		isShared: true,
		createdAt: new Date('2026-03-02T09:00:00.000Z'),
		updatedAt: new Date('2026-03-17T09:00:00.000Z'),
	},
	{
		id: 'query-3',
		projectId: 'project-1',
		organizationId: 'org-1',
		name: 'Query Failures',
		description: 'Shows failing background runs by connector.',
		type: 'AGGREGATION' as const,
		definition: { metric: 'queryFailures' },
		cacheTtlSeconds: 900,
		isShared: false,
		createdAt: new Date('2026-03-03T09:00:00.000Z'),
		updatedAt: new Date('2026-03-16T09:00:00.000Z'),
	},
	{
		id: 'query-4',
		projectId: 'project-1',
		organizationId: 'org-1',
		name: 'Live Cohorts',
		description: 'Retention cohorts by signup week.',
		type: 'CUSTOM' as const,
		definition: { metric: 'cohorts' },
		cacheTtlSeconds: 1200,
		isShared: true,
		createdAt: new Date('2026-03-04T09:00:00.000Z'),
		updatedAt: new Date('2026-03-15T09:00:00.000Z'),
	},
];

beforeAll(() => {
	const windowInstance = new Window({
		url: 'https://sandbox.contractspec.local/sandbox?template=analytics-dashboard',
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

async function renderTable() {
	const container = document.createElement('div');
	document.body.append(container);
	const root: Root = createRoot(container);

	await act(async () => {
		root.render(<AnalyticsQueriesTable queries={queries} />);
	});

	return { container, root };
}

describe('AnalyticsQueriesTable', () => {
	test('renders the shared table surface', async () => {
		const { container, root } = await renderTable();

		expect(container.textContent).toContain('Saved Queries');
		expect(container.textContent).toContain('4 queries');
		expect(container.textContent).toContain(
			'Affichage de 1 à 3 sur 4 résultats'
		);
		expect(
			container.querySelector('[aria-label="Expand row query-1"]')
		).not.toBeNull();

		await act(async () => {
			root.unmount();
		});
	});
});
