import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import type {
	HarnessBrowserAction,
	HarnessBrowserStepInput,
	HarnessVisualDiffInput,
} from '@contractspec/lib.contracts-spec';
import type {
	HarnessBrowserRuntimeOptions,
	HarnessExecutionAdapter,
	HarnessStepExecutionInput,
	HarnessStepExecutionResult,
} from '../types';

interface PlaywrightLikePage {
	goto(url: string): Promise<unknown>;
	click(selector: string): Promise<unknown>;
	dblclick?(selector: string): Promise<unknown>;
	fill(selector: string, value: string): Promise<unknown>;
	type?(selector: string, value: string): Promise<unknown>;
	press?(selector: string, key: string): Promise<unknown>;
	selectOption?(selector: string, value: string | string[]): Promise<unknown>;
	check?(selector: string): Promise<unknown>;
	uncheck?(selector: string): Promise<unknown>;
	hover?(selector: string): Promise<unknown>;
	waitForSelector?(selector: string): Promise<unknown>;
	waitForLoadState?(
		state: 'domcontentloaded' | 'load' | 'networkidle'
	): Promise<unknown>;
	waitForTimeout?(ms: number): Promise<unknown>;
	waitForURL?(url: string): Promise<unknown>;
	textContent?(selector: string): Promise<string | null>;
	innerHTML?(selector: string): Promise<string>;
	inputValue?(selector: string): Promise<string>;
	content(): Promise<string>;
	screenshot(options?: { fullPage?: boolean }): Promise<Uint8Array>;
	title(): Promise<string>;
	url?(): string;
	setViewportSize?(viewport: {
		width: number;
		height: number;
	}): Promise<unknown>;
	on?(
		event: 'console' | 'pageerror' | 'requestfailed',
		handler: (value: unknown) => void
	): void;
	close(): Promise<void>;
}

interface PlaywrightLikeContext {
	newPage(): Promise<PlaywrightLikePage>;
	setExtraHTTPHeaders?(headers: Record<string, string>): Promise<unknown>;
	close(): Promise<void>;
}

interface PlaywrightLikeBrowser {
	newContext?(options?: {
		storageState?: string;
		extraHTTPHeaders?: Record<string, string>;
	}): Promise<PlaywrightLikeContext>;
	newPage(): Promise<PlaywrightLikePage>;
	close(): Promise<void>;
}

interface BrowserRunSession {
	context?: PlaywrightLikeContext;
	page: PlaywrightLikePage;
	hasNavigated: boolean;
	consoleMessages: string[];
	pageErrors: string[];
}

export interface PlaywrightBrowserHarnessAdapterOptions
	extends HarnessBrowserRuntimeOptions {
	browserFactory?: () => Promise<PlaywrightLikeBrowser>;
}

export class PlaywrightBrowserHarnessAdapter
	implements HarnessExecutionAdapter
{
	readonly mode = 'deterministic-browser' as const;
	private readonly browserFactory: () => Promise<PlaywrightLikeBrowser>;
	private readonly sessions = new Map<string, BrowserRunSession>();
	private browserPromise: Promise<PlaywrightLikeBrowser> | null = null;
	private browser: PlaywrightLikeBrowser | null = null;

	constructor(
		private readonly options: PlaywrightBrowserHarnessAdapterOptions = {}
	) {
		this.browserFactory =
			options.browserFactory ?? this.createPlaywrightBrowser.bind(this);
	}

	supports(step: Parameters<HarnessExecutionAdapter['supports']>[0]) {
		return !step.actionClass.startsWith('code-exec');
	}

	async dispose() {
		for (const session of this.sessions.values()) {
			await session.page.close().catch(() => undefined);
			await session.context?.close().catch(() => undefined);
		}
		this.sessions.clear();

		const browser = await this.peekBrowser();
		this.browser = null;
		this.browserPromise = null;
		if (browser) {
			await browser.close();
		}
	}

	async execute(
		input: HarnessStepExecutionInput
	): Promise<HarnessStepExecutionResult> {
		const stepInput = input.step.input as HarnessBrowserStepInput | undefined;
		const session = await this.getRunSession(input);
		try {
			await this.applyViewport(session.page, stepInput);
			const url =
				typeof stepInput?.url === 'string'
					? stepInput.url
					: !session.hasNavigated
						? input.target.baseUrl
						: undefined;
			if (url) {
				await session.page.goto(url);
				session.hasNavigated = true;
			}

			for (const action of stepInput?.actions ?? []) {
				await this.executeAction(session.page, action);
			}

			const [title, html, screenshot] = await Promise.all([
				session.page.title(),
				session.page.content(),
				session.page.screenshot({ fullPage: stepInput?.capture?.screenshot }),
			]);
			const artifacts: NonNullable<HarnessStepExecutionResult['artifacts']> = [
				{
					kind: 'screenshot',
					contentType: 'image/png',
					body: screenshot,
					summary: `${input.step.key} screenshot`,
				},
				{
					kind: 'dom-snapshot',
					contentType: 'text/html',
					body: html,
					summary: `${input.step.key} DOM snapshot`,
				},
			];
			if (session.consoleMessages.length > 0 || session.pageErrors.length > 0) {
				artifacts.push({
					kind: 'console',
					contentType: 'application/json',
					body: {
						console: [...session.consoleMessages],
						errors: [...session.pageErrors],
					},
					summary: `${input.step.key} console evidence`,
				});
			}
			const visual = await this.captureVisualDiff(
				stepInput?.visual,
				screenshot
			);
			if (visual) artifacts.push(visual);

			return {
				status:
					visual?.metadata?.['status'] === 'failed' ? 'failed' : 'completed',
				summary: title,
				artifacts,
				metadata: {
					authProfile: resolveAuthProfileKey(input, stepInput),
					url: session.page.url?.(),
				},
			};
		} catch (error) {
			return {
				status: 'failed',
				summary: error instanceof Error ? error.message : String(error),
			};
		}
	}

	private async executeAction(
		page: PlaywrightLikePage,
		action: HarnessBrowserAction
	) {
		switch (action.type) {
			case 'click':
				await page.click(action.selector);
				break;
			case 'dblclick':
				await (page.dblclick ?? page.click).call(page, action.selector);
				break;
			case 'fill':
				await page.fill(action.selector, action.value);
				break;
			case 'type':
				await (page.type ?? page.fill).call(
					page,
					action.selector,
					action.value
				);
				break;
			case 'press':
				await page.press?.('body', action.key);
				break;
			case 'select':
				await page.selectOption?.(action.selector, action.value);
				break;
			case 'check':
				await page.check?.(action.selector);
				break;
			case 'uncheck':
				await page.uncheck?.(action.selector);
				break;
			case 'hover':
				await page.hover?.(action.selector);
				break;
			case 'wait':
				if (action.selector) await page.waitForSelector?.(action.selector);
				if (action.url) await page.waitForURL?.(action.url);
				if (action.load) await page.waitForLoadState?.(action.load);
				if (action.ms != null) await page.waitForTimeout?.(action.ms);
				break;
			case 'snapshot':
			case 'screenshot':
			case 'get':
				break;
		}
	}

	private async getRunSession(input: HarnessStepExecutionInput) {
		const existing = this.sessions.get(input.runId);
		if (existing) return existing;

		const browser = await this.getBrowser();
		const stepInput = input.step.input as HarnessBrowserStepInput | undefined;
		const authProfile = resolveAuthProfile(
			input,
			stepInput,
			this.options.authProfiles
		);
		const headers = resolveHeaders(input, stepInput, authProfile);
		const context =
			browser.newContext != null
				? await browser.newContext({
						storageState:
							authProfile?.kind === 'storage-state'
								? authProfile.ref
								: undefined,
						extraHTTPHeaders: headers,
					})
				: undefined;
		const page = context ? await context.newPage() : await browser.newPage();
		const session: BrowserRunSession = {
			context,
			page,
			hasNavigated: false,
			consoleMessages: [],
			pageErrors: [],
		};
		page.on?.('console', (value) => {
			session.consoleMessages.push(formatPlaywrightEvent(value));
		});
		page.on?.('pageerror', (value) => {
			session.pageErrors.push(formatPlaywrightEvent(value));
		});
		if (!context && headers && Object.keys(headers).length > 0) {
			await page.goto('about:blank').catch(() => undefined);
		}
		if (context?.setExtraHTTPHeaders && headers) {
			await context.setExtraHTTPHeaders(headers);
		}
		this.sessions.set(input.runId, session);
		return session;
	}

	private async applyViewport(
		page: PlaywrightLikePage,
		stepInput: HarnessBrowserStepInput | undefined
	) {
		if (stepInput?.viewport && page.setViewportSize) {
			await page.setViewportSize(stepInput.viewport);
		}
	}

	private async captureVisualDiff(
		visual: HarnessVisualDiffInput | undefined,
		screenshot: Uint8Array
	) {
		if (!visual?.baselinePath) return undefined;

		try {
			const baseline = await readFile(visual.baselinePath);
			const current = Buffer.from(screenshot);
			const diffBytes = countByteDiffs(baseline, current);
			const maxLength = Math.max(baseline.length, current.length, 1);
			const diffRatio = diffBytes / maxLength;
			const maxDiffBytes =
				visual.maxDiffBytes ?? this.options.visual?.maxDiffBytes ?? 0;
			const maxDiffRatio =
				visual.maxDiffRatio ?? this.options.visual?.maxDiffRatio ?? 0;
			const passed = diffBytes <= maxDiffBytes && diffRatio <= maxDiffRatio;
			return {
				kind: 'visual-diff' as const,
				contentType: 'application/json',
				body: { diffBytes, diffRatio, maxDiffBytes, maxDiffRatio },
				summary: `Visual diff ${passed ? 'passed' : 'failed'}`,
				metadata: {
					status: passed ? 'passed' : 'failed',
					diffBytes,
					diffRatio,
					baselinePath: visual.baselinePath,
				},
			};
		} catch (error) {
			if (visual.updateBaseline || this.options.visual?.updateBaselines) {
				await mkdir(dirname(visual.baselinePath), { recursive: true });
				await writeFile(visual.baselinePath, Buffer.from(screenshot));
				return {
					kind: 'visual-diff' as const,
					contentType: 'application/json',
					body: { updatedBaseline: true },
					summary: 'Visual baseline updated',
					metadata: {
						status: 'passed',
						baselinePath: visual.baselinePath,
						updatedBaseline: true,
					},
				};
			}
			return {
				kind: 'visual-diff' as const,
				contentType: 'application/json',
				body: { error: error instanceof Error ? error.message : String(error) },
				summary: 'Visual baseline missing',
				metadata: {
					status: 'failed',
					baselinePath: visual.baselinePath,
				},
			};
		}
	}

	private async peekBrowser(): Promise<PlaywrightLikeBrowser | null> {
		if (this.browser) return this.browser;
		return this.browserPromise
			? await this.browserPromise.catch(() => null)
			: null;
	}

	private async getBrowser(): Promise<PlaywrightLikeBrowser> {
		const browser = await this.peekBrowser();
		if (browser) return browser;

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
			return await this.browserPromise;
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

function countByteDiffs(left: Uint8Array, right: Uint8Array) {
	let diff = Math.abs(left.length - right.length);
	const length = Math.min(left.length, right.length);
	for (let index = 0; index < length; index += 1) {
		if (left[index] !== right[index]) diff += 1;
	}
	return diff;
}

function resolveAuthProfileKey(
	input: HarnessStepExecutionInput,
	stepInput: HarnessBrowserStepInput | undefined
) {
	const value =
		typeof stepInput?.authProfile === 'string'
			? stepInput.authProfile
			: (stepInput?.authProfile?.key ??
				(getMetadata(input)['authProfile'] as string | undefined));
	return typeof value === 'string' ? value : undefined;
}

function resolveAuthProfile(
	input: HarnessStepExecutionInput,
	stepInput: HarnessBrowserStepInput | undefined,
	authProfiles: PlaywrightBrowserHarnessAdapterOptions['authProfiles']
) {
	if (typeof stepInput?.authProfile === 'object') return stepInput.authProfile;
	const key = resolveAuthProfileKey(input, stepInput);
	return key ? authProfiles?.[key] : undefined;
}

function resolveHeaders(
	input: HarnessStepExecutionInput,
	stepInput: HarnessBrowserStepInput | undefined,
	authProfile: ReturnType<typeof resolveAuthProfile>
) {
	const headersEnv =
		stepInput?.headersEnv ??
		(authProfile?.kind === 'headers-env' ? authProfile.ref : undefined) ??
		(getMetadata(input)['headersEnv'] as string | undefined);
	if (!headersEnv) return undefined;
	const raw = process.env[headersEnv];
	if (!raw) return undefined;
	try {
		const parsed = JSON.parse(raw);
		return typeof parsed === 'object' && parsed !== null
			? (parsed as Record<string, string>)
			: undefined;
	} catch {
		return undefined;
	}
}

function getMetadata(input: HarnessStepExecutionInput) {
	const metadata = input.context['metadata'];
	return typeof metadata === 'object' && metadata !== null
		? (metadata as Record<string, unknown>)
		: {};
}

function formatPlaywrightEvent(value: unknown) {
	if (typeof value === 'string') return value;
	if (value && typeof value === 'object' && 'text' in value) {
		const text = (value as { text?: () => string }).text;
		if (typeof text === 'function') return text.call(value);
	}
	return String(value);
}
