import { afterEach, beforeEach, describe, expect, it, mock } from "bun:test";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import type { ImpactResult, SpecScanResult } from "@contractspec/module.workspace";
import { DEFAULT_CONTRACTSRC } from "@contractspec/lib.contracts-spec/workspace-config";
import { createNodeFsAdapter } from "../../adapters/fs.node";

const mockListSpecs = mock(async (): Promise<SpecScanResult[]> => []);
const mockDetectImpact = mock(async (): Promise<ImpactResult> => createImpactResult());

mock.module("../list", () => ({
	listSpecs: mockListSpecs,
}));

mock.module("../impact", () => ({
	detectImpact: mockDetectImpact,
}));

const { verifyConnectMutation } = await import("./index");

let tempDir: string | null = null;

describe("connect patch verdict mapping", () => {
	beforeEach(() => {
		mockDetectImpact.mockReset();
		mockListSpecs.mockReset();
		mockDetectImpact.mockResolvedValue(createImpactResult());
	});

	afterEach(() => {
		if (tempDir) {
			rmSync(tempDir, { recursive: true, force: true });
			tempDir = null;
		}
	});

	it("maps rewrite to assist without approval", async () => {
		const { fs, packageRoot } = createWorkspace();
		mockListSpecs.mockResolvedValue([
			createSpec(join(packageRoot, "src", "runtime", "foo.ts"), "runtime.foo"),
		]);

		const result = await verifyConnectMutation(
			createAdapters(fs),
			createFsInput(
				packageRoot,
				"task-rewrite",
				"src/runtime/foo.ts",
				"edit",
				createConfig({
					generatedPaths: ["src/runtime/**"],
					reviewThresholds: {
						contractDrift: "rewrite",
					},
				}),
			),
		);

		expect(result.patchVerdict.verdict).toBe("rewrite");
		expect(result.patchVerdict.controlPlane.verdict).toBe("assist");
		expect(result.patchVerdict.controlPlane.requiresApproval).toBe(false);
	});

	it("maps review to assist with approval", async () => {
		const { fs, packageRoot } = createWorkspace();
		mockListSpecs.mockResolvedValue([]);

		const result = await verifyConnectMutation(
			createAdapters(fs),
			createFsInput(packageRoot, "task-review", "src/unknown.ts"),
		);

		expect(result.patchVerdict.verdict).toBe("require_review");
		expect(result.patchVerdict.controlPlane.verdict).toBe("assist");
		expect(result.patchVerdict.controlPlane.requiresApproval).toBe(true);
	});

	it("maps deny to blocked without approval", async () => {
		const { fs, packageRoot } = createWorkspace();
		mockListSpecs.mockResolvedValue([
			createSpec(join(packageRoot, "src", "runtime", "foo.ts"), "runtime.foo"),
		]);

		const result = await verifyConnectMutation(createAdapters(fs), {
			config: createConfig({}, { deny: ["git push --force"] }),
			cwd: packageRoot,
			packageRoot,
			taskId: "task-deny",
			tool: "acp.terminal.exec",
			command: "git push --force origin HEAD",
			touchedPaths: ["src/runtime/foo.ts"],
			workspaceRoot: packageRoot,
		});

		expect(result.patchVerdict.verdict).toBe("deny");
		expect(result.patchVerdict.controlPlane.verdict).toBe("blocked");
		expect(result.patchVerdict.controlPlane.requiresApproval).toBe(false);
	});
});

function createWorkspace() {
	tempDir = mkdtempSync(join(tmpdir(), "contractspec-connect-verdict-"));
	mkdirSync(join(tempDir, "src", "runtime"), { recursive: true });
	mkdirSync(join(tempDir, "generated", "docs"), { recursive: true });
	writeFileSync(join(tempDir, "package.json"), '{"name":"@demo/connect-verdict"}\n', "utf8");
	writeFileSync(join(tempDir, "src", "runtime", "foo.ts"), "export {};\n", "utf8");
	writeFileSync(join(tempDir, "generated", "docs", "connect.md"), "generated\n", "utf8");
	return {
		fs: createNodeFsAdapter(tempDir),
		packageRoot: tempDir,
	};
}

function createAdapters(fs: ReturnType<typeof createNodeFsAdapter>) {
	return {
		fs,
		git: {
			clean: async () => {},
			currentBranch: async () => "main",
			diffFiles: async () => [],
			isGitRepo: async () => true,
			log: async () => [],
			showFile: async () => "",
		},
		logger: {
			createProgress: () => ({
				fail: () => {},
				start: () => {},
				stop: () => {},
				succeed: () => {},
				update: () => {},
				warn: () => {},
			}),
			debug: () => {},
			error: () => {},
			info: () => {},
			warn: () => {},
		},
	};
}

function createFsInput(
	packageRoot: string,
	taskId: string,
	path: string,
	operation = "edit",
	config = createConfig(),
) {
	return {
		config,
		cwd: packageRoot,
		operation,
		packageRoot,
		path,
		taskId,
		tool: "acp.fs.access" as const,
		workspaceRoot: packageRoot,
	};
}

function createConfig(
	policyOverrides: {
		generatedPaths?: string[];
		immutablePaths?: string[];
		protectedPaths?: string[];
		reviewThresholds?: {
			contractDrift?: "rewrite" | "require_review" | "deny" | "permit";
		};
	} = {},
	commandOverrides: {
		allow?: string[];
		deny?: string[];
		review?: string[];
	} = {},
) {
	return {
		...DEFAULT_CONTRACTSRC,
		connect: {
			...DEFAULT_CONTRACTSRC.connect,
			enabled: true,
			commands: commandOverrides,
			policy: {
				...DEFAULT_CONTRACTSRC.connect?.policy,
				...policyOverrides,
				smokeChecks: [],
			},
		},
	};
}

function createImpactResult(overrides: Partial<ImpactResult> = {}): ImpactResult {
	return {
		addedSpecs: [],
		deltas: [],
		hasBreaking: false,
		hasNonBreaking: false,
		removedSpecs: [],
		status: "no-impact",
		summary: {
			added: 0,
			breaking: 0,
			info: 0,
			nonBreaking: 0,
			removed: 0,
		},
		timestamp: "2026-04-06T00:00:00.000Z",
		...overrides,
	};
}

function createSpec(filePath: string, key: string): SpecScanResult {
	return {
		filePath,
		hasContent: false,
		hasDefinition: true,
		hasIo: false,
		hasMeta: true,
		hasPayload: false,
		hasPolicy: false,
		key,
		kind: "command",
		specType: "operation",
		version: "1.0.0",
	};
}
