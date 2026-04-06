import type { FsAdapter } from '../../ports/fs';
import { resolve } from 'node:path';
import type {
	ConnectContextPack,
	ConnectPatchVerdict,
	ConnectPlanPacket,
	ConnectReviewListItem,
	ConnectReviewPacket,
} from './types';
import type { ConnectResolvedWorkspace } from './shared';
import type { ConnectDecisionEnvelope } from './runtime-types';

export interface ConnectStoragePaths {
	root: string;
	contextPack: string;
	planPacket: string;
	patchVerdict: string;
	auditFile: string;
	reviewPacketsDir: string;
	decisionsDir: string;
}

export interface ConnectStoredDecision {
	historyDir: string;
	contextPack?: ConnectContextPack;
	planPacket?: ConnectPlanPacket;
	patchVerdict?: ConnectPatchVerdict;
	reviewPacket?: ConnectReviewPacket;
	envelope?: ConnectDecisionEnvelope;
}

export function resolveStoragePaths(
	workspace: ConnectResolvedWorkspace
): ConnectStoragePaths {
	const storage = workspace.config.connect?.storage;
	const root = resolve(
		workspace.packageRoot,
		storage?.root ?? '.contractspec/connect'
	);

	return {
		root,
		contextPack: resolve(
			workspace.packageRoot,
			storage?.contextPack ?? '.contractspec/connect/context-pack.json'
		),
		planPacket: resolve(
			workspace.packageRoot,
			storage?.planPacket ?? '.contractspec/connect/plan-packet.json'
		),
		patchVerdict: resolve(
			workspace.packageRoot,
			storage?.patchVerdict ?? '.contractspec/connect/patch-verdict.json'
		),
		auditFile: resolve(
			workspace.packageRoot,
			storage?.auditFile ?? '.contractspec/connect/audit.ndjson'
		),
		reviewPacketsDir: resolve(
			workspace.packageRoot,
			storage?.reviewPacketsDir ?? '.contractspec/connect/review-packets'
		),
		decisionsDir: resolve(root, 'decisions'),
	};
}

export async function ensureStorage(
	fs: FsAdapter,
	storage: ConnectStoragePaths
): Promise<void> {
	await fs.mkdir(storage.root);
	await fs.mkdir(storage.reviewPacketsDir);
	await fs.mkdir(storage.decisionsDir);
}

export async function persistLatestArtifacts(
	fs: FsAdapter,
	storage: ConnectStoragePaths,
	artifacts: {
		contextPack?: ConnectContextPack;
		planPacket?: ConnectPlanPacket;
		patchVerdict?: ConnectPatchVerdict;
	}
): Promise<void> {
	if (artifacts.contextPack) {
		await writeJson(fs, storage.contextPack, artifacts.contextPack);
	}
	if (artifacts.planPacket) {
		await writeJson(fs, storage.planPacket, artifacts.planPacket);
	}
	if (artifacts.patchVerdict) {
		await writeJson(fs, storage.patchVerdict, artifacts.patchVerdict);
	}
}

export async function persistDecisionArtifacts(
	fs: FsAdapter,
	storage: ConnectStoragePaths,
	decisionId: string,
	artifacts: {
		contextPack?: ConnectContextPack;
		planPacket?: ConnectPlanPacket;
		patchVerdict?: ConnectPatchVerdict;
		reviewPacket?: ConnectReviewPacket;
		evaluationResult?: unknown;
		replayBundle?: unknown;
	}
): Promise<string> {
	const historyDir = fs.join(storage.decisionsDir, decisionId);
	await fs.mkdir(historyDir);

	if (artifacts.contextPack) {
		await writeJson(fs, fs.join(historyDir, 'context-pack.json'), artifacts.contextPack);
	}
	if (artifacts.planPacket) {
		await writeJson(fs, fs.join(historyDir, 'plan-packet.json'), artifacts.planPacket);
	}
	if (artifacts.patchVerdict) {
		await writeJson(
			fs,
			fs.join(historyDir, 'patch-verdict.json'),
			artifacts.patchVerdict
		);
	}
	if (artifacts.reviewPacket) {
		await writeJson(
			fs,
			fs.join(historyDir, 'review-packet.json'),
			artifacts.reviewPacket
		);
	}
	if (artifacts.evaluationResult !== undefined) {
		await writeJson(
			fs,
			fs.join(historyDir, 'evaluation-result.json'),
			artifacts.evaluationResult
		);
	}
	if (artifacts.replayBundle !== undefined) {
		await writeJson(fs, fs.join(historyDir, 'replay-bundle.json'), artifacts.replayBundle);
	}

	return historyDir;
}

export async function writeDecisionEnvelope(
	fs: FsAdapter,
	storage: ConnectStoragePaths,
	decisionId: string,
	envelope: ConnectDecisionEnvelope
): Promise<string> {
	const filePath = fs.join(storage.decisionsDir, decisionId, 'decision-envelope.json');
	await writeJson(fs, filePath, envelope);
	return filePath;
}

export async function appendAuditRecord(
	fs: FsAdapter,
	storage: ConnectStoragePaths,
	record: Record<string, unknown>
): Promise<void> {
	const existing = (await tryRead(fs, storage.auditFile)) ?? '';
	const line = `${JSON.stringify(record)}\n`;
	await fs.writeFile(storage.auditFile, `${existing}${line}`);
}

export async function writeReviewPacket(
	fs: FsAdapter,
	storage: ConnectStoragePaths,
	packet: ConnectReviewPacket
): Promise<string> {
	const filePath = fs.join(storage.reviewPacketsDir, `${packet.id}.json`);
	await writeJson(fs, filePath, packet);
	return filePath;
}

export async function loadStoredDecision(
	fs: FsAdapter,
	storage: ConnectStoragePaths,
	decisionId: string
): Promise<ConnectStoredDecision> {
	const historyDir = fs.join(storage.decisionsDir, decisionId);
	return {
		historyDir,
		contextPack: await readJson<ConnectContextPack>(
			fs,
			fs.join(historyDir, 'context-pack.json')
		),
		planPacket: await readJson<ConnectPlanPacket>(
			fs,
			fs.join(historyDir, 'plan-packet.json')
		),
		patchVerdict: await readJson<ConnectPatchVerdict>(
			fs,
			fs.join(historyDir, 'patch-verdict.json')
		),
		reviewPacket: await readJson<ConnectReviewPacket>(
			fs,
			fs.join(historyDir, 'review-packet.json')
		),
		envelope: await readJson<ConnectDecisionEnvelope>(
			fs,
			fs.join(historyDir, 'decision-envelope.json')
		),
	};
}

export async function listStoredReviewPackets(
	fs: FsAdapter,
	storage: ConnectStoragePaths
): Promise<ConnectReviewListItem[]> {
	const files = await fs.glob({
		pattern: '*.json',
		cwd: storage.reviewPacketsDir,
		absolute: true,
	});
	const items: ConnectReviewListItem[] = [];

	for (const filePath of files) {
		const packet = await readJson<ConnectReviewPacket>(fs, filePath);
		if (packet) {
			items.push({ filePath, packet });
		}
	}

	return items.sort((left, right) =>
		left.packet.id.localeCompare(right.packet.id)
	);
}

export function artifactRef(
	fs: FsAdapter,
	workspace: ConnectResolvedWorkspace,
	path: string
): string {
	const relative = fs.relative(workspace.packageRoot, fs.resolve(path));
	return relative.replaceAll('\\', '/');
}

export function decisionArtifactRefs(
	fs: FsAdapter,
	workspace: ConnectResolvedWorkspace,
	storage: ConnectStoragePaths,
	decisionId: string,
	artifacts: {
		contextPack?: boolean;
		planPacket?: boolean;
		patchVerdict?: boolean;
		reviewPacket?: boolean;
		evaluationResult?: boolean;
		replayBundle?: boolean;
	}
): ConnectDecisionEnvelope['artifacts'] {
	const historyDir = fs.join(storage.decisionsDir, decisionId);

	return {
		contextPack: artifactRef(fs, workspace, fs.join(historyDir, 'context-pack.json')),
		planPacket: artifactRef(fs, workspace, fs.join(historyDir, 'plan-packet.json')),
		patchVerdict: artifactRef(fs, workspace, fs.join(historyDir, 'patch-verdict.json')),
		reviewPacket: artifacts.reviewPacket
			? artifactRef(fs, workspace, fs.join(historyDir, 'review-packet.json'))
			: undefined,
		evaluationResult: artifacts.evaluationResult
			? artifactRef(fs, workspace, fs.join(historyDir, 'evaluation-result.json'))
			: undefined,
		replayBundle: artifacts.replayBundle
			? artifactRef(fs, workspace, fs.join(historyDir, 'replay-bundle.json'))
			: undefined,
	};
}

async function writeJson(
	fs: FsAdapter,
	path: string,
	value: unknown
): Promise<void> {
	await fs.writeFile(path, `${JSON.stringify(value, null, 2)}\n`);
}

async function readJson<T>(fs: FsAdapter, path: string): Promise<T | undefined> {
	const content = await tryRead(fs, path);
	if (!content) {
		return undefined;
	}

	try {
		return JSON.parse(content) as T;
	} catch {
		return undefined;
	}
}

async function tryRead(fs: FsAdapter, path: string): Promise<string | undefined> {
	if (!(await fs.exists(path))) {
		return undefined;
	}

	try {
		return await fs.readFile(path);
	} catch {
		return undefined;
	}
}
