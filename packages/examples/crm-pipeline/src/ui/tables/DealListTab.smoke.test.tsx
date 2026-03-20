import { afterEach, beforeAll, describe, expect, test } from 'bun:test';
import Window from 'happy-dom/lib/window/Window.js';
import * as React from 'react';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { MOCK_DEALS } from '../../handlers/mock-data';
import type { Deal } from '../hooks/useDealList';
import { DealListDataTable } from './DealListTab';

const TEST_DEALS: Deal[] = MOCK_DEALS.map((deal) => ({
	...deal,
	projectId: 'project-1',
}));

beforeAll(() => {
	const windowInstance = new Window({
		url: 'https://sandbox.contractspec.local/sandbox?template=crm-pipeline',
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

function sortDeals(
	pageIndex: number,
	pageSize: number,
	sorting: { id: string; desc: boolean }[]
) {
	const [sort] = sorting;
	const sorted = [...TEST_DEALS].sort((left, right) => {
		const leftValue =
			sort?.id === 'deal'
				? left.name
				: sort?.id === 'status'
					? left.status
					: sort?.id === 'expectedCloseDate'
						? (left.expectedCloseDate?.toISOString() ?? '')
						: sort?.id === 'updatedAt'
							? left.updatedAt.toISOString()
							: left.value;
		const rightValue =
			sort?.id === 'deal'
				? right.name
				: sort?.id === 'status'
					? right.status
					: sort?.id === 'expectedCloseDate'
						? (right.expectedCloseDate?.toISOString() ?? '')
						: sort?.id === 'updatedAt'
							? right.updatedAt.toISOString()
							: right.value;
		if (leftValue === rightValue) return 0;
		const comparison = leftValue > rightValue ? 1 : -1;
		return sort?.desc ? comparison * -1 : comparison;
	});
	return sorted.slice(pageIndex * pageSize, pageIndex * pageSize + pageSize);
}

function Harness() {
	const [sorting, setSorting] = React.useState([{ id: 'value', desc: true }]);
	const [pagination, setPagination] = React.useState({
		pageIndex: 0,
		pageSize: 3,
	});
	return (
		<DealListDataTable
			deals={sortDeals(pagination.pageIndex, pagination.pageSize, sorting)}
			totalItems={TEST_DEALS.length}
			pageIndex={pagination.pageIndex}
			pageSize={pagination.pageSize}
			sorting={sorting}
			onSortingChange={setSorting}
			onPaginationChange={setPagination}
		/>
	);
}

async function renderTable() {
	const container = document.createElement('div');
	document.body.append(container);
	const root: Root = createRoot(container);

	await act(async () => {
		root.render(<Harness />);
	});

	return { container, root };
}

async function click(element: Element | null | undefined) {
	if (!element) {
		throw new Error('Expected clickable element.');
	}
	await act(async () => {
		if ('click' in element && typeof element.click === 'function') {
			element.click();
			return;
		}
		element.dispatchEvent(new MouseEvent('click', { bubbles: true }));
	});
}

describe('DealListDataTable', () => {
	test('renders the shared table and supports selection plus expansion', async () => {
		const { container, root } = await renderTable();

		expect(container.textContent).toContain('All Deals');
		expect(container.textContent).toContain('6 total deals');

		await click(container.querySelector('[aria-label="Select row deal-5"]'));
		expect(container.textContent).toContain('Selected 1');

		await click(container.querySelector('[aria-label="Expand row deal-5"]'));
		expect(container.textContent).toContain('user-1');

		await click(
			[...container.getElementsByTagName('button')].find(
				(button) => button.textContent?.trim() === '2'
			)
		);
		expect(container.textContent).toContain(
			'Affichage de 4 à 6 sur 6 résultats'
		);

		await act(async () => {
			root.unmount();
		});
	});
});
