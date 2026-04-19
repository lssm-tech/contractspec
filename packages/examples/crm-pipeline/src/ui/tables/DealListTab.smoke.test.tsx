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

function sortDeals(
	pageIndex: number,
	pageSize: number,
	sorting: { id: string; desc: boolean }[],
	search: string,
	status: 'OPEN' | 'WON' | 'LOST' | 'all'
) {
	const [sort] = sorting;
	const filtered = TEST_DEALS.filter((deal) => {
		const matchesStatus = status === 'all' ? true : deal.status === status;
		const matchesSearch =
			!search ||
			[deal.name, deal.companyId, deal.contactId, deal.notes, deal.ownerId]
				.filter(Boolean)
				.join(' ')
				.toLowerCase()
				.includes(search.toLowerCase());
		return matchesStatus && matchesSearch;
	});
	const sorted = [...filtered].sort((left, right) => {
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
	const [search, setSearch] = React.useState('');
	const [status, setStatus] = React.useState<'OPEN' | 'WON' | 'LOST' | 'all'>(
		'all'
	);
	const filteredDeals = sortDeals(
		pagination.pageIndex,
		pagination.pageSize,
		sorting,
		search,
		status
	);
	const totalItems = TEST_DEALS.filter((deal) => {
		const matchesStatus = status === 'all' ? true : deal.status === status;
		const matchesSearch =
			!search ||
			[deal.name, deal.companyId, deal.contactId, deal.notes, deal.ownerId]
				.filter(Boolean)
				.join(' ')
				.toLowerCase()
				.includes(search.toLowerCase());
		return matchesStatus && matchesSearch;
	}).length;
	return (
		<DealListDataTable
			deals={filteredDeals}
			totalItems={totalItems}
			pageIndex={pagination.pageIndex}
			pageSize={pagination.pageSize}
			sorting={sorting}
			search={search}
			status={status}
			onSortingChange={(nextSorting) => {
				setSorting(nextSorting);
				setPagination((current) => ({ ...current, pageIndex: 0 }));
			}}
			onPaginationChange={setPagination}
			onSearchChange={(value) => {
				setSearch(value);
				setPagination((current) => ({ ...current, pageIndex: 0 }));
			}}
			onStatusChange={(value) => {
				setStatus(value);
				setPagination((current) => ({ ...current, pageIndex: 0 }));
			}}
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

		await click(
			[...container.getElementsByTagName('button')].find(
				(button) => button.textContent?.trim() === 'Won Only'
			)
		);
		expect(container.textContent).toContain('Status: WON');

		await act(async () => {
			root.unmount();
		});
	});
});
