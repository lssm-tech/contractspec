import { execFile as execFileCallback } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { promisify } from 'node:util';
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

const execFileAsync = promisify(execFileCallback);

export type AgentBrowserExecFile = (
	file: string,
	args: string[],
	options?: { cwd?: string; env?: NodeJS.ProcessEnv }
) => Promise<{ stdout: string; stderr: string }>;

export interface AgentBrowserHarnessAdapterOptions
	extends HarnessBrowserRuntimeOptions {
	binaryPath?: string;
	cwd?: string;
	execFile?: AgentBrowserExecFile;
	screenshotDir?: string;
}

export class AgentBrowserHarnessAdapter implements HarnessExecutionAdapter {
	readonly mode = 'visual-computer-use' as const;
	private readonly binaryPath: string;
	private readonly execFile: AgentBrowserExecFile;
	private readonly screenshotDir: string;
	private readonly sessions = new Set<string>();

	constructor(
		private readonly options: AgentBrowserHarnessAdapterOptions = {}
	) {
		this.binaryPath = options.binaryPath ?? 'agent-browser';
		this.execFile =
			options.execFile ??
			(async (file, args, execOptions) => {
				const result = await execFileAsync(file, args, execOptions);
				return {
					stdout: String(result.stdout ?? ''),
					stderr: String(result.stderr ?? ''),
				};
			});
		this.screenshotDir = options.screenshotDir ?? tmpdir();
	}

	supports(step: Parameters<HarnessExecutionAdapter['supports']>[0]) {
		return !step.actionClass.startsWith('code-exec');
	}

	async execute(
		input: HarnessStepExecutionInput
	): Promise<HarnessStepExecutionResult> {
		const stepInput = input.step.input as HarnessBrowserStepInput | undefined;
		const session = `contractspec-${input.runId}`;
		this.sessions.add(session);
		const baseArgs = this.createBaseArgs(input, stepInput, session);
		const url = stepInput?.url ?? input.target.baseUrl;
		if (url && !isAllowedUrl(url, input.target.allowlistedDomains)) {
			return {
				status: 'blocked',
				summary: `URL ${url} is outside harness allowlisted domains.`,
				reasons: ['domain_not_allowlisted'],
			};
		}

		try {
			if (url) {
				await this.run([...baseArgs, 'open', url]);
			}
			for (const action of stepInput?.actions ?? []) {
				await this.run([...baseArgs, ...actionToArgs(action)]);
			}

			const artifacts: NonNullable<HarnessStepExecutionResult['artifacts']> =
				[];
			const screenshotPath = join(
				this.screenshotDir,
				`${input.runId}-${input.step.key}.png`
			);
			await this.run([...baseArgs, 'screenshot', screenshotPath]);
			artifacts.push({
				kind: 'screenshot',
				contentType: 'image/png',
				body: await readFile(screenshotPath).catch(() => undefined),
				summary: `${input.step.key} agent-browser screenshot`,
				metadata: { path: screenshotPath },
			});

			const snapshot = await this.run([
				...baseArgs,
				'snapshot',
				'-i',
				'--json',
			]);
			artifacts.push({
				kind: 'accessibility-snapshot',
				contentType: 'application/json',
				body: parseJsonOrText(snapshot.stdout),
				summary: `${input.step.key} agent-browser accessibility snapshot`,
			});

			const consoleOutput = await this.run([...baseArgs, 'console']).catch(
				() => undefined
			);
			const errorOutput = await this.run([...baseArgs, 'errors']).catch(
				() => undefined
			);
			if (consoleOutput?.stdout || errorOutput?.stdout) {
				artifacts.push({
					kind: 'console',
					contentType: 'application/json',
					body: {
						console: consoleOutput?.stdout ?? '',
						errors: errorOutput?.stdout ?? '',
					},
					summary: `${input.step.key} agent-browser console evidence`,
				});
			}

			const visual = await this.captureVisualDiff(baseArgs, stepInput?.visual);
			if (visual) artifacts.push(visual);

			const title = await this.run([...baseArgs, 'get', 'title']).catch(
				() => undefined
			);
			return {
				status:
					visual?.metadata?.['status'] === 'failed' ? 'failed' : 'completed',
				summary: title?.stdout.trim() || 'agent-browser step completed',
				artifacts,
				metadata: {
					authProfile: resolveAuthProfileKey(input, stepInput),
					session,
				},
			};
		} catch (error) {
			if (isMissingBinaryError(error)) {
				return {
					status: 'unsupported',
					summary: 'agent-browser CLI is not available.',
					reasons: ['agent_browser_missing'],
				};
			}
			return {
				status: 'failed',
				summary: error instanceof Error ? error.message : String(error),
			};
		}
	}

	async dispose() {
		for (const session of this.sessions) {
			await this.run(['--session', session, 'close']).catch(() => undefined);
		}
		this.sessions.clear();
	}

	private async captureVisualDiff(
		baseArgs: string[],
		visual: HarnessVisualDiffInput | undefined
	) {
		if (!visual?.baselinePath) return undefined;
		try {
			const result = await this.run([
				...baseArgs,
				'diff',
				'screenshot',
				'--baseline',
				visual.baselinePath,
				'--json',
			]);
			const parsed = parseJsonOrText(result.stdout);
			return {
				kind: 'visual-diff' as const,
				contentType: 'application/json',
				body: parsed,
				summary: 'agent-browser visual diff',
				metadata: {
					status: 'passed',
					baselinePath: visual.baselinePath,
				},
			};
		} catch (error) {
			return {
				kind: 'visual-diff' as const,
				contentType: 'application/json',
				body: {
					error: error instanceof Error ? error.message : String(error),
				},
				summary: 'agent-browser visual diff failed',
				metadata: {
					status: 'failed',
					baselinePath: visual.baselinePath,
				},
			};
		}
	}

	private createBaseArgs(
		input: HarnessStepExecutionInput,
		stepInput: HarnessBrowserStepInput | undefined,
		session: string
	) {
		const args = ['--session', session];
		const domains = input.target.allowlistedDomains;
		if (domains?.length) args.push('--allowed-domains', domains.join(','));
		const authProfile = resolveAuthProfile(
			input,
			stepInput,
			this.options.authProfiles
		);
		if (authProfile) {
			switch (authProfile.kind) {
				case 'storage-state':
					args.push('--state', authProfile.ref);
					break;
				case 'browser-profile':
					args.push('--profile', authProfile.ref);
					break;
				case 'session-name':
					args.push('--session-name', authProfile.ref);
					break;
				case 'headers-env': {
					const headers = process.env[authProfile.ref];
					if (headers) args.push('--headers', headers);
					break;
				}
			}
		}
		return args;
	}

	private async run(args: string[]) {
		return this.execFile(this.binaryPath, args, {
			cwd: this.options.cwd,
			env: process.env,
		});
	}
}

function actionToArgs(action: HarnessBrowserAction): string[] {
	switch (action.type) {
		case 'click':
			return ['click', action.selector];
		case 'dblclick':
			return ['dblclick', action.selector];
		case 'fill':
			return ['fill', action.selector, action.value];
		case 'type':
			return ['type', action.selector, action.value];
		case 'press':
			return ['press', action.key];
		case 'select':
			return [
				'select',
				action.selector,
				...(Array.isArray(action.value) ? action.value : [action.value]),
			];
		case 'check':
			return ['check', action.selector];
		case 'uncheck':
			return ['uncheck', action.selector];
		case 'hover':
			return ['hover', action.selector];
		case 'wait':
			if (action.selector) return ['wait', action.selector];
			if (action.text) return ['wait', '--text', action.text];
			if (action.url) return ['wait', '--url', action.url];
			if (action.load) return ['wait', '--load', action.load];
			return ['wait', String(action.ms ?? 500)];
		case 'snapshot':
			return action.selector
				? ['snapshot', '-i', '--selector', action.selector]
				: ['snapshot', '-i'];
		case 'screenshot':
			return ['screenshot'];
		case 'get':
			return action.selector
				? ['get', action.target, action.selector]
				: ['get', action.target];
	}
}

function parseJsonOrText(value: string) {
	try {
		return JSON.parse(value);
	} catch {
		return value;
	}
}

function isAllowedUrl(url: string, allowlistedDomains: string[] | undefined) {
	if (!allowlistedDomains?.length) return true;
	try {
		const hostname = new URL(url).hostname;
		return allowlistedDomains.includes(hostname);
	} catch {
		return false;
	}
}

function resolveAuthProfileKey(
	input: HarnessStepExecutionInput,
	stepInput: HarnessBrowserStepInput | undefined
) {
	const value =
		typeof stepInput?.authProfile === 'string'
			? stepInput.authProfile
			: (stepInput?.authProfile?.key ?? getMetadata(input)['authProfile']);
	return typeof value === 'string' ? value : undefined;
}

function resolveAuthProfile(
	input: HarnessStepExecutionInput,
	stepInput: HarnessBrowserStepInput | undefined,
	authProfiles: AgentBrowserHarnessAdapterOptions['authProfiles']
) {
	if (typeof stepInput?.authProfile === 'object') return stepInput.authProfile;
	const key = resolveAuthProfileKey(input, stepInput);
	return typeof key === 'string' ? authProfiles?.[key] : undefined;
}

function isMissingBinaryError(error: unknown) {
	return (
		typeof error === 'object' &&
		error !== null &&
		'code' in error &&
		(error as { code?: string }).code === 'ENOENT'
	);
}

function getMetadata(input: HarnessStepExecutionInput) {
	const metadata = input.context['metadata'];
	return typeof metadata === 'object' && metadata !== null
		? (metadata as Record<string, unknown>)
		: {};
}
