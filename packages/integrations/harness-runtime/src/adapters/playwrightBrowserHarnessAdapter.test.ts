import { describe, expect, it } from 'bun:test';
import { PlaywrightBrowserHarnessAdapter } from './playwrightBrowserHarnessAdapter';

describe('PlaywrightBrowserHarnessAdapter', () => {
	it('reuses one browser across multiple executions and closes on dispose', async () => {
		const lifecycle = createFakeBrowserLifecycle();
		const adapter = new PlaywrightBrowserHarnessAdapter({
			browserFactory: lifecycle.browserFactory,
		});

		const firstResult = await adapter.execute({
			context: {},
			scenario: {} as never,
			runId: 'run-1',
			target: {
				targetId: 'target-1',
				kind: 'preview',
				isolation: 'preview',
				environment: 'preview',
				baseUrl: 'http://127.0.0.1:3000',
			},
			step: {
				key: 'open-home',
				description: 'Open the page',
				actionClass: 'navigate',
				intent: 'Load the preview target.',
				input: {
					url: 'http://127.0.0.1:3000',
				},
			},
		});

		const secondResult = await adapter.execute({
			context: {},
			scenario: {} as never,
			runId: 'run-1',
			target: {
				targetId: 'target-1',
				kind: 'preview',
				isolation: 'preview',
				environment: 'preview',
				baseUrl: 'http://127.0.0.1:3000',
			},
			step: {
				key: 'submit-name',
				description: 'Submit a name',
				actionClass: 'form-submit',
				intent: 'Fill and confirm the form.',
				input: {
					actions: [
						{
							type: 'fill',
							selector: '#participant-name',
							value: 'Grace Hopper',
						},
						{
							type: 'click',
							selector: '#confirm',
						},
					],
				},
			},
		});

		expect(firstResult.status).toBe('completed');
		expect(firstResult.summary).toBe('Harness Lab | Waiting');
		expect(secondResult.status).toBe('completed');
		expect(secondResult.summary).toBe('Harness Lab | Ready for Grace Hopper');
		expect(lifecycle.launchCount).toBe(1);
		expect(lifecycle.pageCount).toBe(1);
		expect(lifecycle.pageCloseCount).toBe(0);
		expect(lifecycle.browserCloseCount).toBe(0);

		await adapter.dispose();

		expect(lifecycle.pageCloseCount).toBe(1);
		expect(lifecycle.browserCloseCount).toBe(1);
	});
});

function createFakeBrowserLifecycle() {
	let launchCount = 0;
	let pageCount = 0;
	let pageCloseCount = 0;
	let browserCloseCount = 0;

	return {
		async browserFactory() {
			launchCount += 1;
			return {
				async newPage() {
					pageCount += 1;
					return createFakePage({
						onClose() {
							pageCloseCount += 1;
						},
					});
				},
				async close() {
					browserCloseCount += 1;
				},
			};
		},
		get launchCount() {
			return launchCount;
		},
		get pageCount() {
			return pageCount;
		},
		get pageCloseCount() {
			return pageCloseCount;
		},
		get browserCloseCount() {
			return browserCloseCount;
		},
	};
}

function createFakePage(options: { onClose(): void }) {
	let title = 'Harness Lab | Waiting';
	let html =
		'<!doctype html><html><head><title>Harness Lab | Waiting</title></head><body></body></html>';

	return {
		async goto(url: string) {
			title = 'Harness Lab | Waiting';
			html = `<!doctype html><html><head><title>${title}</title></head><body><main>${url}</main></body></html>`;
		},
		async click(selector: string) {
			if (selector === '#confirm') {
				title = 'Harness Lab | Ready for Grace Hopper';
				html = `<!doctype html><html><head><title>${title}</title></head><body><output>Welcome, Grace Hopper.</output></body></html>`;
			}
		},
		async fill(selector: string, value: string) {
			if (selector === '#participant-name') {
				html = `<!doctype html><html><head><title>${title}</title></head><body><input id="${selector}" value="${value}" /></body></html>`;
			}
		},
		async content() {
			return html;
		},
		async screenshot() {
			return Buffer.from('fake-screenshot');
		},
		async title() {
			return title;
		},
		async close() {
			options.onClose();
		},
	};
}
