import { afterAll, beforeEach, describe, expect, it, mock } from 'bun:test';

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
const discoverSpecs = mock(async () => [
	{
		filePath: '/repo/packages/modules/audit/src/contracts/ai-contracts.ts',
		specType: 'event',
		key: 'audit.recorded',
		exportName: 'auditRecorded',
		declarationLine: 3,
		version: '1.0.0',
		hasMeta: true,
		hasIo: false,
		hasPolicy: false,
		hasPayload: true,
		hasContent: false,
		hasDefinition: false,
		kind: 'event',
	},
	{
		filePath: '/repo/packages/modules/audit/src/contracts/ai-contracts.ts',
		specType: 'operation',
		key: 'audit.run',
		exportName: 'runAudit',
		declarationLine: 8,
		version: '1.0.0',
		hasMeta: true,
		hasIo: true,
		hasPolicy: true,
		hasPayload: false,
		hasContent: false,
		hasDefinition: false,
		kind: 'command',
	},
]);
const validateDiscoveredSpecs = mock(
	async (specs: Array<Record<string, unknown>>) =>
		specs.map((spec) => ({
			spec,
			valid: true,
			errors: [],
			warnings: [],
			code: 'export const spec = {};',
		}))
);
const resolveImplementations = mock(async () => ({
	status: 'implemented',
	implementations: [],
}));
const WORKSPACE_ADAPTERS_MODULE = new URL(
	'./workspace/adapters.ts',
	import.meta.url
).pathname;

mock.module('vscode', () => ({
	workspace: {
		workspaceFolders: [{ uri: { fsPath: '/repo' } }],
		getConfiguration: () => ({
			get: (_key: string, fallback?: unknown) => fallback,
			update: mock(async () => undefined),
		}),
		openTextDocument,
	},
	window: {
		showInformationMessage,
		showWarningMessage,
		showErrorMessage,
		showQuickPick,
		showTextDocument,
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
}));

mock.module('@contractspec/bundle.workspace', () => ({
	ALL_SETUP_TARGETS: ['cli-config', 'vscode-settings'],
	discoverSpecs,
	validateDiscoveredSpecs,
	resolveImplementations,
	loadWorkspaceConfig: mock(async () => ({
		outputDir: './src',
	})),
	runSetup: mock(async () => ({
		success: true,
		preset: 'core',
		files: [],
		summary: 'ok',
		nextSteps: ['contractspec validate'],
	})),
	groupSpecsByType: (specs: Array<{ specType: string }>) => {
		const groups = new Map<string, Array<{ specType: string }>>();
		for (const spec of specs) {
			const current = groups.get(spec.specType) ?? [];
			current.push(spec);
			groups.set(spec.specType, current);
		}
		return groups;
	},
}));

mock.module(WORKSPACE_ADAPTERS_MODULE, () => ({
	getWorkspaceAdapters: () => ({ fs: {}, logger: {} }),
	getWorkspaceInfoCached: () => ({ workspaceRoot: '/repo' }),
	getPackageRootForFile: () => '/repo/packages/modules/audit',
	isMonorepoWorkspace: () => true,
}));

describe('VS Code spec-centric discovery', () => {
	beforeEach(() => {
		appendLine.mockClear();
		show.mockClear();
		showInformationMessage.mockClear();
		showWarningMessage.mockClear();
		showErrorMessage.mockClear();
		showQuickPick.mockClear();
		openTextDocument.mockClear();
		showTextDocument.mockClear();
		discoverSpecs.mockClear();
		validateDiscoveredSpecs.mockClear();
		resolveImplementations.mockClear();
	});

	it('lists discovered specs with spec counts', async () => {
		const { listAllSpecs } = await import('./commands/list');
		await listAllSpecs({ appendLine, show } as never);

		expect(discoverSpecs).toHaveBeenCalledTimes(1);
		expect(appendLine).toHaveBeenCalledWith(
			expect.stringContaining('Found 2 spec(s)')
		);
	});

	it('validates workspace specs with per-spec counts', async () => {
		const { validateWorkspace } = await import('./commands/validate');
		await validateWorkspace({ appendLine, show } as never);

		expect(validateDiscoveredSpecs).toHaveBeenCalledTimes(1);
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

afterAll(() => {
	mock.restore();
});
