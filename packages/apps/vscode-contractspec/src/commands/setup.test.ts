import {
	afterAll,
	afterEach,
	beforeEach,
	describe,
	expect,
	it,
	mock,
} from 'bun:test';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

let workspaceRoot = '/repo';
const showInformationMessage = mock(() => Promise.resolve(undefined));
const showErrorMessage = mock(() => Promise.resolve(undefined));
const showWarningMessage = mock(() => Promise.resolve(undefined));
const showInputBox = mock(
	async (options?: { value?: string }) => options?.value ?? 'demo'
);
const showQuickPick = mock(
	async (
		items: Array<{ value?: string }> | string[],
		options?: { canPickMany?: boolean }
	) => {
		if (options?.canPickMany) {
			return items;
		}

		if (Array.isArray(items) && typeof items[0] === 'string') {
			return items[0];
		}

		return (
			(items as Array<{ value?: string }>).find(
				(item) => item.value === 'connect'
			) ?? items[0]
		);
	}
);
const withProgress = mock(async (_options, task) =>
	task({ report: mock(() => {}) })
);

type VscodeMockState = {
	workspaceRoot: string;
	showInformationMessage: typeof showInformationMessage;
	showErrorMessage: typeof showErrorMessage;
	showWarningMessage: typeof showWarningMessage;
	showInputBox: typeof showInputBox;
	showQuickPick: typeof showQuickPick;
	withProgress: typeof withProgress;
	openTextDocument?: (...args: unknown[]) => Promise<unknown>;
	showTextDocument?: (...args: unknown[]) => Promise<unknown>;
};

function setVscodeMockState(state: VscodeMockState) {
	(
		globalThis as { __contractspecVscodeMockState?: VscodeMockState }
	).__contractspecVscodeMockState = state;
}

function getVscodeMockState(): VscodeMockState {
	const state = (
		globalThis as { __contractspecVscodeMockState?: VscodeMockState }
	).__contractspecVscodeMockState;
	if (!state) {
		throw new Error('VS Code mock state is not initialized.');
	}
	return state;
}

function installVscodeSetupMock() {
	mock.module('vscode', () => ({
		workspace: {
			get workspaceFolders() {
				return [{ uri: { fsPath: getVscodeMockState().workspaceRoot } }];
			},
			openTextDocument: (...args: unknown[]) =>
				getVscodeMockState().openTextDocument?.(...args) ?? Promise.resolve({}),
			getConfiguration: () => ({
				get: (_key: string, fallback?: unknown) => fallback,
				update: mock(async () => undefined),
			}),
		},
		window: {
			showInformationMessage: (
				...args: Parameters<typeof showInformationMessage>
			) => getVscodeMockState().showInformationMessage(...args),
			showErrorMessage: (...args: Parameters<typeof showErrorMessage>) =>
				getVscodeMockState().showErrorMessage(...args),
			showWarningMessage: (...args: Parameters<typeof showWarningMessage>) =>
				getVscodeMockState().showWarningMessage(...args),
			showInputBox: (...args: Parameters<typeof showInputBox>) =>
				getVscodeMockState().showInputBox(...args),
			showQuickPick: (...args: Parameters<typeof showQuickPick>) =>
				getVscodeMockState().showQuickPick(...args),
			withProgress: (...args: Parameters<typeof withProgress>) =>
				getVscodeMockState().withProgress(...args),
			showTextDocument: (...args: unknown[]) =>
				getVscodeMockState().showTextDocument?.(...args) ??
				Promise.resolve({
					selection: undefined,
					revealRange: mock(() => {}),
				}),
		},
		ProgressLocation: {
			Notification: 15,
		},
		TextEditorRevealType: {
			InCenter: 0,
		},
		ConfigurationTarget: {
			Workspace: 2,
		},
		EventEmitter: class<T> {
			readonly event = mock(() => {});
			fire = mock((_value?: T) => {});
		},
		TreeItem: class {
			label: string;
			collapsibleState: number;

			constructor(label: string, collapsibleState: number) {
				this.label = label;
				this.collapsibleState = collapsibleState;
			}
		},
	}));
}

function loadSetupModule() {
	return import(`./setup?test=${Date.now()}-${Math.random()}`);
}

describe('VS Code setup commands', () => {
	const outputChannel = {
		appendLine: mock(() => {}),
		show: mock(() => {}),
	};
	let tempDir = '';

	beforeEach(async () => {
		tempDir = await mkdtemp(join(tmpdir(), 'contractspec-vscode-setup-'));
		workspaceRoot = tempDir;
		await writeFile(
			join(tempDir, 'package.json'),
			JSON.stringify({ name: 'vscode-setup-fixture', type: 'module' }, null, 2)
		);
		mock.restore();
		installVscodeSetupMock();
		setVscodeMockState({
			workspaceRoot,
			showInformationMessage,
			showErrorMessage,
			showWarningMessage,
			showInputBox,
			showQuickPick,
			withProgress,
		});

		showInformationMessage.mockClear();
		showErrorMessage.mockClear();
		showWarningMessage.mockClear();
		showInputBox.mockClear();
		showQuickPick.mockClear();
		withProgress.mockClear();
		outputChannel.appendLine.mockClear();
		outputChannel.show.mockClear();
	});

	afterEach(async () => {
		if (tempDir) {
			await rm(tempDir, { recursive: true, force: true });
		}
	});

	it('runs the interactive setup flow and writes a connect-enabled config', async () => {
		const { runSetupWizard } = await loadSetupModule();
		await runSetupWizard(outputChannel as never);

		const written = JSON.parse(
			await readFile(join(tempDir, '.contractsrc.json'), 'utf8')
		) as { connect?: { enabled?: boolean } };

		expect(written.connect?.enabled).toBe(true);
		expect(outputChannel.appendLine).toHaveBeenCalledWith(
			expect.stringContaining('--- Next Steps ---')
		);
		expect(showInformationMessage).toHaveBeenCalled();
	});

	it('uses the core preset for quick setup defaults', async () => {
		const { runQuickSetup } = await loadSetupModule();
		await runQuickSetup(outputChannel as never);

		const written = JSON.parse(
			await readFile(join(tempDir, '.contractsrc.json'), 'utf8')
		) as { builder?: { enabled?: boolean }; connect?: { enabled?: boolean } };

		expect(written.builder?.enabled).toBeUndefined();
		expect(written.connect?.enabled).toBeUndefined();
	});
});

afterAll(() => {
	mock.restore();
});
