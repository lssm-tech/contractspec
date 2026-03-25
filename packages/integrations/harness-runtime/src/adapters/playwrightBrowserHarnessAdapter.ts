import type {
	HarnessExecutionAdapter,
	HarnessStepExecutionResult,
} from '../types';

interface PlaywrightLikePage {
	goto(url: string): Promise<unknown>;
	click(selector: string): Promise<unknown>;
	fill(selector: string, value: string): Promise<unknown>;
	content(): Promise<string>;
	screenshot(): Promise<Uint8Array>;
	title(): Promise<string>;
	close(): Promise<void>;
}

interface PlaywrightLikeBrowser {
	newPage(): Promise<PlaywrightLikePage>;
	close(): Promise<void>;
}

export interface PlaywrightBrowserHarnessAdapterOptions {
	browserFactory?: () => Promise<PlaywrightLikeBrowser>;
}

export class PlaywrightBrowserHarnessAdapter
	implements HarnessExecutionAdapter
{
	readonly mode = 'deterministic-browser' as const;
	private readonly browserFactory: () => Promise<PlaywrightLikeBrowser>;
	private browserPromise: Promise<PlaywrightLikeBrowser> | null = null;
	private browser: PlaywrightLikeBrowser | null = null;

	constructor(options: PlaywrightBrowserHarnessAdapterOptions = {}) {
		this.browserFactory =
			options.browserFactory ?? this.createPlaywrightBrowser.bind(this);
	}

	supports(step: Parameters<HarnessExecutionAdapter['supports']>[0]) {
		return !step.actionClass.startsWith('code-exec');
	}

	async dispose() {
		const browser = await this.peekBrowser();
		this.browser = null;
		this.browserPromise = null;
		if (browser) {
			await browser.close();
		}
	}

	async execute(
		input: Parameters<HarnessExecutionAdapter['execute']>[0]
	): Promise<HarnessStepExecutionResult> {
		const browser = await this.getBrowser();
		const page = await browser.newPage();
		try {
			const url =
				typeof input.step.input?.url === 'string'
					? input.step.input.url
					: input.target.baseUrl;
			if (url) await page.goto(url);

			const actions = Array.isArray(input.step.input?.actions)
				? input.step.input.actions
				: [];
			for (const action of actions as Array<Record<string, unknown>>) {
				if (action?.type === 'click' && typeof action.selector === 'string') {
					await page.click(action.selector);
				}
				if (
					action?.type === 'fill' &&
					typeof action.selector === 'string' &&
					typeof action.value === 'string'
				) {
					await page.fill(action.selector, action.value);
				}
			}

			const [title, html, screenshot] = await Promise.all([
				page.title(),
				page.content(),
				page.screenshot(),
			]);
			return {
				status: 'completed' as const,
				summary: title,
				artifacts: [
					{
						kind: 'screenshot' as const,
						contentType: 'image/png',
						body: screenshot,
						summary: `${input.step.key} screenshot`,
					},
					{
						kind: 'dom-snapshot' as const,
						contentType: 'text/html',
						body: html,
						summary: `${input.step.key} DOM snapshot`,
					},
				],
			};
		} finally {
			await page.close();
		}
	}

	private async peekBrowser(): Promise<PlaywrightLikeBrowser | null> {
		if (this.browser) {
			return this.browser;
		}

		return this.browserPromise
			? await this.browserPromise.catch(() => null)
			: null;
	}

	private async getBrowser(): Promise<PlaywrightLikeBrowser> {
		const browser = await this.peekBrowser();
		if (browser) {
			return browser;
		}

		if (!this.browserPromise) {
			this.browserPromise = this.browserFactory()
				.then((browser) => {
					this.browser = browser;
					return browser;
				})
				.catch((error) => {
					this.browserPromise = null;
					this.browser = null;
					throw error;
				});
		}

		try {
			const browser = await this.browserPromise;
			if (!browser) {
				throw new Error('Playwright browser could not be initialized.');
			}
			return browser;
		} catch (error) {
			this.browserPromise = null;
			this.browser = null;
			throw error;
		}
	}

	private async createPlaywrightBrowser() {
		const playwright = await import('playwright');
		return (await playwright.chromium.launch()) as unknown as PlaywrightLikeBrowser;
	}
}
