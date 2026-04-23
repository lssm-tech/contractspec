import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import Window from 'happy-dom/lib/window/Window.js';
import * as React from 'react';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { useListUrlState } from './useListUrlState';

interface Filters extends Record<string, unknown> {
	status?: string;
	categoryId?: string;
}

beforeEach(() => {
	const windowInstance = new Window({
		url: 'https://lists.contractspec.local/posts?f=%7B%22status%22%3A%22draft%22%2C%22categoryId%22%3A%22cat_2%22%7D',
	});
	Object.assign(globalThis, {
		window: windowInstance,
		document: windowInstance.document,
		location: windowInstance.location,
		HTMLElement: windowInstance.HTMLElement,
		IS_REACT_ACT_ENVIRONMENT: true,
	});
});

afterEach(() => {
	document.body.innerHTML = '';
});

function Harness({
	onReady,
}: {
	onReady: (state: ReturnType<typeof useListUrlState<Filters>>) => void;
}) {
	const state = useListUrlState<Filters>({
		defaults: { q: '', page: 1, limit: 20, filters: {} },
		filterScope: {
			initial: { status: 'published' },
			locked: { categoryId: 'cat_1' },
		},
	});

	React.useEffect(() => {
		onReady(state);
	}, [onReady, state]);

	return null;
}

describe('useListUrlState', () => {
	it('serializes only user-editable filters and clears editable filters', async () => {
		let hook: ReturnType<typeof useListUrlState<Filters>> | undefined;
		const container = document.createElement('div');
		document.body.append(container);
		const root: Root = createRoot(container);

		act(() => {
			root.render(
				<Harness
					onReady={(state) => {
						hook = state;
					}}
				/>
			);
		});

		expect(hook?.state.filters).toEqual({ status: 'draft' });
		expect(window.location.search).not.toContain('cat_1');

		act(() => {
			hook?.setFilter('categoryId', 'cat_3');
		});

		expect(hook?.state.filters).toEqual({ status: 'draft' });
		expect(decodeURIComponent(window.location.search)).not.toContain(
			'categoryId'
		);

		act(() => {
			hook?.clearFilters();
		});

		expect(hook?.state.filters).toEqual({});
		expect(decodeURIComponent(window.location.search)).not.toContain(
			'published'
		);

		await act(async () => {
			root.unmount();
		});
	});
});
