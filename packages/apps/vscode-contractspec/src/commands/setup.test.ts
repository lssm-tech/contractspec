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

mock.module('vscode', () => ({
	workspace: {
		get workspaceFolders() {
			return [{ uri: { fsPath: workspaceRoot } }];
		},
	},
	window: {
		showInformationMessage,
		showErrorMessage,
		showWarningMessage,
		showInputBox,
		showQuickPick,
		withProgress,
	},
	ProgressLocation: {
		Notification: 15,
	},
}));

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
		const { runSetupWizard } = await import('./setup');
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
		const { runQuickSetup } = await import('./setup');
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
