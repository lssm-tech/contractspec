import { afterEach, beforeEach, describe, expect, it, mock } from 'bun:test';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

let workspaceRoot = '/repo';

const appendLine = mock(() => {});
const show = mock(() => {});
const showInformationMessage = mock(() => Promise.resolve(undefined));
const showWarningMessage = mock(() => Promise.resolve(undefined));
const showErrorMessage = mock(() => Promise.resolve(undefined));
const showQuickPick = mock(() => Promise.resolve(undefined));
const openTextDocument = mock(() => Promise.resolve({}));
const showTextDocument = mock(() =>
	Promise.resolve({
		selection: undefined,
		revealRange: mock(() => {}),
	})
);

type VscodeMockState = {
	workspaceRoot: string;
	showInformationMessage: typeof showInformationMessage;
	showWarningMessage: typeof showWarningMessage;
	showErrorMessage: typeof showErrorMessage;
	showQuickPick: typeof showQuickPick;
	openTextDocument: typeof openTextDocument;
	showTextDocument: typeof showTextDocument;
	showInputBox?: (...args: unknown[]) => Promise<unknown>;
	withProgress?: (...args: unknown[]) => Promise<unknown>;
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

function installVscodeMock() {
	mock.module('vscode', () => ({
		workspace: {
			get workspaceFolders() {
				return [{ uri: { fsPath: getVscodeMockState().workspaceRoot } }];
			},
			getConfiguration: () => ({
				get: (_key: string, fallback?: unknown) => fallback,
				update: mock(async () => undefined),
			}),
			openTextDocument: (...args: Parameters<typeof openTextDocument>) =>
				getVscodeMockState().openTextDocument(...args),
		},
		window: {
			showInformationMessage: (
				...args: Parameters<typeof showInformationMessage>
			) => getVscodeMockState().showInformationMessage(...args),
			showWarningMessage: (...args: Parameters<typeof showWarningMessage>) =>
				getVscodeMockState().showWarningMessage(...args),
			showErrorMessage: (...args: Parameters<typeof showErrorMessage>) =>
				getVscodeMockState().showErrorMessage(...args),
			showQuickPick: (...args: Parameters<typeof showQuickPick>) =>
				getVscodeMockState().showQuickPick(...args),
			showTextDocument: (...args: Parameters<typeof showTextDocument>) =>
				getVscodeMockState().showTextDocument(...args),
			showInputBox: (...args: unknown[]) =>
				getVscodeMockState().showInputBox?.(...args) ??
				Promise.resolve(undefined),
			withProgress: (...args: unknown[]) =>
				getVscodeMockState().withProgress?.(...args) ??
				Promise.resolve(undefined),
		},
		EventEmitter: class<T> {
			readonly event = mock(() => {});
			fire = mock((_value?: T) => {});
		},
		TreeItem: class {
			label: string;
			collapsibleState: number;
			tooltip?: string;
			description?: string;
			resourceUri?: { fsPath: string };
			command?: Record<string, unknown>;
			iconPath?: unknown;

			constructor(label: string, collapsibleState: number) {
				this.label = label;
				this.collapsibleState = collapsibleState;
			}
		},
		TreeItemCollapsibleState: {
			None: 0,
			Expanded: 1,
		},
		ThemeIcon: class {
			constructor(
				public readonly id: string,
				public readonly color?: unknown
			) {}
		},
		ThemeColor: class {
			constructor(public readonly id: string) {}
		},
		Uri: {
			file: (fsPath: string) => ({ fsPath }),
		},
		Range: class {
			constructor(
				public readonly startLine: number,
				public readonly startCharacter: number,
				public readonly endLine: number,
				public readonly endCharacter: number
			) {}
		},
		Selection: class {
			constructor(
				public readonly start: unknown,
				public readonly end: unknown
			) {}
		},
		TextEditorRevealType: {
			InCenter: 0,
		},
		ProgressLocation: {
			Notification: 15,
		},
		ConfigurationTarget: {
			Workspace: 2,
		},
	}));
}

describe('VS Code spec-centric discovery', () => {
	let tempDir = '';

	beforeEach(async () => {
		tempDir = await mkdtemp(join(tmpdir(), 'contractspec-vscode-specs-'));
		workspaceRoot = tempDir;

		await writeFile(
			join(tempDir, 'package.json'),
			JSON.stringify({ name: 'vscode-specs-fixture', type: 'module' }, null, 2)
		);
		await writeFile(
			join(tempDir, '.contractsrc.json'),
			JSON.stringify({ outputDir: './src' }, null, 2)
		);
		await mkdir(join(tempDir, 'src', 'contracts'), { recursive: true });
		await writeFile(
			join(tempDir, 'src', 'contracts', 'ai-contracts.ts'),
			`import { defineCommand, defineEvent } from '@contractspec/lib.contracts-spec';

export const auditRecorded = defineEvent({
  meta: { key: 'audit.recorded', version: '1.0.0' },
  payload: {},
});

export const runAudit = defineCommand({
  meta: { key: 'audit.run', version: '1.0.0' },
  io: {},
  policy: {},
});
`,
			'utf8'
		);

		mock.restore();
		installVscodeMock();
		setVscodeMockState({
			workspaceRoot,
			showInformationMessage,
			showWarningMessage,
			showErrorMessage,
			showQuickPick,
			openTextDocument,
			showTextDocument,
		});

		appendLine.mockClear();
		show.mockClear();
		showInformationMessage.mockClear();
		showWarningMessage.mockClear();
		showErrorMessage.mockClear();
		showQuickPick.mockClear();
		openTextDocument.mockClear();
		showTextDocument.mockClear();

		const { invalidateWorkspaceCache } = await import('./workspace/adapters');
		invalidateWorkspaceCache();
	});

	afterEach(async () => {
		mock.restore();
		if (tempDir) {
			await rm(tempDir, { recursive: true, force: true });
		}
	});

	it('lists discovered specs with spec counts', async () => {
		const { listAllSpecs } = await import('./commands/list');
		await listAllSpecs({ appendLine, show } as never);

		expect(appendLine).toHaveBeenCalledWith(
			expect.stringContaining('Found 2 spec(s)')
		);
	});

	it('validates workspace specs with per-spec counts', async () => {
		const { validateWorkspace } = await import('./commands/validate');
		await validateWorkspace({ appendLine, show } as never);

		expect(showInformationMessage).toHaveBeenCalledWith(
			expect.stringContaining('All 2 spec(s) passed validation')
		);
	});

	it('shows one explorer entry per exported spec', async () => {
		const { SpecsTreeDataProvider } = await import('./views/specs-tree');
		const provider = new SpecsTreeDataProvider();
		await provider.refresh();

		const groups = await provider.getChildren();
		expect(groups).toHaveLength(2);

		const operationGroup = groups.find((group) =>
			String(group.label).includes('Operation')
		);
		expect(operationGroup).toBeDefined();

		const specs = await provider.getChildren(operationGroup);
		expect(specs[0]?.label).toContain('runAudit');
	});
});
