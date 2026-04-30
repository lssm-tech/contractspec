import { afterEach, beforeAll, describe, expect, it } from 'bun:test';
import Window from 'happy-dom/lib/window/Window.js';
import * as React from 'react';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { renderToStaticMarkup } from 'react-dom/server';
import { AppShell } from './AppShell';

beforeAll(() => {
	const windowInstance = new Window({
		url: 'https://design-system-shell.contractspec.local/tests',
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
		HTMLButtonElement: windowInstance.HTMLButtonElement,
		Node: windowInstance.Node,
		Event: windowInstance.Event,
		KeyboardEvent: windowInstance.KeyboardEvent,
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

async function click(element: Element | null) {
	expect(element).toBeTruthy();
	await act(async () => {
		element?.dispatchEvent(
			new window.MouseEvent('click', { bubbles: true, cancelable: true })
		);
	});
	await act(async () => {
		await new Promise((resolve) => setTimeout(resolve, 0));
	});
}

async function renderShell(node: React.ReactNode) {
	const container = document.createElement('div');
	document.body.appendChild(container);
	let root: Root | undefined;
	await act(async () => {
		root = createRoot(container);
		root.render(node);
	});
	return { container, root: root as Root };
}

describe('AppShell', () => {
	it('renders shell brand, breadcrumbs, nested navigation, content, and page outline', () => {
		const html = renderToStaticMarkup(
			<AppShell
				title="Console"
				activeHref="/projects/active"
				breadcrumbs={[{ href: '/', label: 'Home' }, { label: 'Projects' }]}
				navigation={[
					{
						title: 'Workspace',
						items: [
							{
								label: 'Projects',
								href: '/projects',
								match: 'startsWith',
								children: [{ label: 'Active', href: '/projects/active' }],
							},
						],
					},
				]}
				pageOutline={[
					{ id: 'summary', label: 'Summary' },
					{ id: 'details', label: 'Details', level: 2 },
				]}
			>
				<section id="summary">Shell content</section>
			</AppShell>
		);

		expect(html).toContain('Console');
		expect(html).toContain('Home');
		expect(html).toContain('Projects');
		expect(html).toContain('Active');
		expect(html).toContain('Shell content');
		expect(html).toContain('href="#summary"');
		expect(html).toContain('href="#details"');
		expect(html).toContain('aria-current="page"');
	});

	it('renders page content without a reserved desktop outline column', () => {
		const html = renderToStaticMarkup(
			<AppShell
				title="Console"
				pageOutline={[
					{ id: 'summary', label: 'Summary' },
					{ id: 'details', label: 'Details', level: 2 },
				]}
			>
				<section id="summary">Shell content</section>
			</AppShell>
		);

		expect(html).not.toContain('lg:grid-cols-[minmax(0,1fr)_240px]');
		expect(html).toContain('hover:w-64');
		expect(html).toContain('focus-within:w-64');
		expect(html).toContain('xl:block');
		expect(html).not.toContain('Open page outline');
	});

	it('hides the page outline trigger and compact dialog path on small screens', async () => {
		await renderShell(
			<AppShell
				title="Console"
				pageOutline={[
					{ id: 'summary', label: 'Summary' },
					{ id: 'details', label: 'Details', level: 2 },
				]}
			>
				<section id="summary">Shell content</section>
			</AppShell>
		);

		expect(
			document.querySelector('button[aria-label="Open page outline"]')
		).toBeNull();
		expect(document.body.textContent).not.toContain('On this page');
		expect(
			Array.from(document.querySelectorAll('nav')).some((nav) =>
				nav.className.includes('rounded-md border p-3')
			)
		).toBe(false);
	});

	it('renders a shared desktop sidebar provider and collapse trigger', async () => {
		await renderShell(
			<AppShell
				title="Console"
				activeHref="/projects"
				navigation={[
					{
						title: 'Workspace',
						items: [{ label: 'Projects', href: '/projects' }],
					},
				]}
			>
				<section>Shell content</section>
			</AppShell>
		);

		expect(
			document.querySelectorAll('[data-slot="sidebar-wrapper"]').length
		).toBe(1);
		expect(document.querySelector('[data-slot="sidebar-inset"]')).toBeTruthy();
		expect(
			document
				.querySelector('[data-slot="sidebar"]')
				?.getAttribute('data-state')
		).toBe('expanded');

		await click(document.querySelector('[data-slot="sidebar-trigger"]'));

		expect(
			document
				.querySelector('[data-slot="sidebar"]')
				?.getAttribute('data-state')
		).toBe('collapsed');
	});

	it('renders notification trigger, unread badge, list, and callback wiring', async () => {
		const calls: string[] = [];
		await renderShell(
			<AppShell
				title="Console"
				notifications={{
					unreadCount: 2,
					items: [
						{
							id: 'deploy-failed',
							title: 'Deploy failed',
							body: 'Production deploy needs attention.',
							status: 'unread',
							createdAt: '2026-04-29T10:30:00Z',
							category: 'Release',
						},
					],
					onOpenChange: (open) => calls.push(`open:${open}`),
					onSelect: (item) => calls.push(`select:${item.id}`),
					onMarkRead: (item) => calls.push(`read:${item.id}`),
					onMarkAllRead: () => calls.push('read:all'),
				}}
			>
				<section>Shell content</section>
			</AppShell>
		);

		expect(
			document.querySelector('[aria-label="2 unread notifications"]')
				?.textContent
		).toBe('2');
		await click(document.querySelector('button[aria-label="Notifications"]'));

		expect(calls).toContain('open:true');
		expect(document.body.textContent).toContain('Deploy failed');
		expect(document.body.textContent).toContain(
			'Production deploy needs attention.'
		);
		expect(document.body.textContent).toContain('Mark all read');

		await click(
			document.querySelector('button[aria-label="Mark Deploy failed as read"]')
		);
		await click(
			document.querySelector(
				'button[aria-label="Mark all notifications as read"]'
			)
		);
		const itemButton = Array.from(document.querySelectorAll('button')).find(
			(button) => button.textContent?.includes('Deploy failed')
		);
		await click(itemButton ?? null);

		expect(calls).toContain('read:deploy-failed');
		expect(calls).toContain('read:all');
		expect(calls).toContain('select:deploy-failed');
		expect(calls).toContain('open:false');
	});

	it('closes notifications from the trigger, outside clicks, and Escape', async () => {
		const calls: string[] = [];
		await renderShell(
			<AppShell
				title="Console"
				notifications={{
					items: [
						{
							id: 'deploy-failed',
							title: 'Deploy failed',
							status: 'unread',
						},
					],
					onOpenChange: (open) => calls.push(`open:${open}`),
				}}
			>
				<section>Shell content</section>
			</AppShell>
		);

		const trigger = document.querySelector(
			'button[aria-label="Notifications"]'
		);
		await click(trigger);
		expect(document.querySelector('[role="dialog"]')?.textContent).toContain(
			'Deploy failed'
		);

		await click(trigger);
		expect(document.querySelector('[role="dialog"]')).toBeNull();

		await click(trigger);
		await click(document.body);
		expect(document.querySelector('[role="dialog"]')).toBeNull();
		await click(trigger);
		await act(async () => {
			document.dispatchEvent(
				new window.KeyboardEvent('keydown', {
					bubbles: true,
					cancelable: true,
					key: 'Escape',
				})
			);
		});
		expect(document.querySelector('[role="dialog"]')).toBeNull();
		expect(calls).toEqual([
			'open:true',
			'open:false',
			'open:true',
			'open:false',
			'open:true',
			'open:false',
		]);
	});

	it('renders notification loading and empty states', async () => {
		await renderShell(
			<AppShell title="Console" notifications={{ loading: true, items: [] }}>
				<section>Shell content</section>
			</AppShell>
		);
		await click(document.querySelector('button[aria-label="Notifications"]'));
		expect(document.body.textContent).toContain('Loading notifications...');

		document.body.innerHTML = '';
		await renderShell(
			<AppShell
				title="Console"
				notifications={{ emptyLabel: 'Inbox is clear', items: [] }}
			>
				<section>Shell content</section>
			</AppShell>
		);
		await click(document.querySelector('button[aria-label="Notifications"]'));
		expect(document.body.textContent).toContain('Inbox is clear');
	});
});
