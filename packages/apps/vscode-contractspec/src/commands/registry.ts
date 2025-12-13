/**
 * Registry commands for ContractSpec extension.
 *
 * Browse/search/install ContractSpec registry items into the current workspace.
 */

import * as vscode from 'vscode';
import { getWorkspaceConfig, getWorkspaceRoot } from '../workspace/adapters';
import path from 'node:path';

type RegistryManifest = {
  items: Array<{
    name: string;
    type: string; // e.g. contractspec:operation
    title: string;
    description: string;
    version: number;
  }>;
};

type RegistryItem = {
  name: string;
  type: string;
  version: number;
  title: string;
  description: string;
  files: Array<{ path: string; type: string; content?: string }>;
};

function getRegistryBaseUrl(): string {
  const config = vscode.workspace.getConfiguration('contractspec');
  return (config.get<string>('registry.baseUrl', '') ?? '').replace(/\/$/, '');
}

function requireWorkspaceRoot(): string {
  const root = getWorkspaceRoot();
  if (!root) throw new Error('No workspace folder open');
  return root;
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url, {
    method: 'GET',
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Registry request failed: ${res.status} ${res.statusText} ${body}`);
  }
  return (await res.json()) as T;
}

function stripPrefix(type: string): string {
  return type.startsWith('contractspec:') ? type.slice('contractspec:'.length) : type;
}

function toKebab(name: string): string {
  return name.replace(/\./g, '-').replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

function extForType(type: string): string {
  switch (type) {
    case 'operation':
      return '.contracts.ts';
    case 'event':
      return '.event.ts';
    case 'presentation':
      return '.presentation.ts';
    case 'workflow':
      return '.workflow.ts';
    case 'data-view':
      return '.data-view.ts';
    case 'integration':
      return '.integration.ts';
    case 'knowledge':
      return '.knowledge.ts';
    case 'app-config':
      return '.app-config.ts';
    case 'template':
      return '.template.json';
    default:
      return '.ts';
  }
}

async function ensureDir(uri: vscode.Uri): Promise<void> {
  await vscode.workspace.fs.createDirectory(uri);
}

async function writeFileSafe(uri: vscode.Uri, content: string): Promise<void> {
  await ensureDir(vscode.Uri.file(path.dirname(uri.fsPath)));
  await vscode.workspace.fs.writeFile(uri, Buffer.from(content, 'utf8'));
}

async function installRegistryItem(
  item: RegistryItem,
  outputChannel: vscode.OutputChannel
): Promise<void> {
  const workspaceRoot = requireWorkspaceRoot();
  const config = await getWorkspaceConfig();
  const outputDir = config.outputDir ?? './src';

  const filesWithContent = item.files.filter(
    (f): f is { path: string; type: string; content: string } =>
      typeof f.content === 'string'
  );

  if (filesWithContent.length === 0) {
    throw new Error(`Registry item ${item.type}/${item.name} has no file contents`);
  }

  const typeSegment = stripPrefix(item.type);

  if (filesWithContent.length === 1) {
    const baseOut = vscode.Uri.file(path.resolve(workspaceRoot, outputDir));
    await ensureDir(baseOut);
    const fileName = `${toKebab(item.name)}${extForType(typeSegment)}`;
    const fileUri = vscode.Uri.joinPath(baseOut, fileName);
    await writeFileSafe(fileUri, filesWithContent[0].content);
    outputChannel.appendLine(`✅ Installed ${item.type}/${item.name} → ${fileUri.fsPath}`);
    return;
  }

  const stagedDir = vscode.Uri.joinPath(
    vscode.Uri.file(workspaceRoot),
    '.contractspec',
    'registry',
    typeSegment,
    toKebab(item.name)
  );
  await ensureDir(stagedDir);

  for (const f of filesWithContent) {
    const baseName = f.path.split('/').pop() ?? 'file.ts';
    const fileUri = vscode.Uri.joinPath(stagedDir, baseName);
    await writeFileSafe(fileUri, f.content);
  }

  outputChannel.appendLine(
    `✅ Installed ${item.type}/${item.name} (${filesWithContent.length} files) → ${stagedDir.fsPath}`
  );
  vscode.window.showInformationMessage(
    `Installed ${item.name} into ${stagedDir.fsPath} (staged)`
  );
}

export async function browseRegistry(
  outputChannel: vscode.OutputChannel
): Promise<void> {
  const baseUrl = getRegistryBaseUrl();
  if (!baseUrl) {
    vscode.window.showWarningMessage(
      'Registry base URL not configured. Set contractspec.registry.baseUrl in settings.'
    );
    return;
  }

  outputChannel.appendLine('\n=== ContractSpec Registry (Browse) ===');
  outputChannel.show(true);

  const manifest = await fetchJson<RegistryManifest>(`${baseUrl}/r/contractspec.json`);
  const types = Array.from(
    new Set(manifest.items.map((i) => stripPrefix(i.type)))
  ).sort((a, b) => a.localeCompare(b));

  const pickedType = await vscode.window.showQuickPick(types, {
    placeHolder: 'Select a registry category',
  });
  if (!pickedType) return;

  const candidates = manifest.items
    .filter((i) => stripPrefix(i.type) === pickedType)
    .sort((a, b) => a.name.localeCompare(b.name));

  const selected = await vscode.window.showQuickPick(
    candidates.map((i) => ({
      label: i.title || i.name,
      description: i.name,
      detail: i.description,
      item: i,
    })),
    { placeHolder: `Select a ${pickedType} to install`, matchOnDetail: true }
  );
  if (!selected) return;

  const itemUrl = `${baseUrl}/r/contractspec/${pickedType}/${selected.item.name}.json`;
  const full = await fetchJson<RegistryItem>(itemUrl);
  await installRegistryItem(full, outputChannel);
}

export async function searchRegistry(
  outputChannel: vscode.OutputChannel
): Promise<void> {
  const baseUrl = getRegistryBaseUrl();
  if (!baseUrl) {
    vscode.window.showWarningMessage(
      'Registry base URL not configured. Set contractspec.registry.baseUrl in settings.'
    );
    return;
  }

  const query = await vscode.window.showInputBox({
    prompt: 'Search ContractSpec Registry',
    placeHolder: 'e.g., auth, billing, workflow',
  });
  if (!query) return;

  outputChannel.appendLine(`\n=== ContractSpec Registry (Search: "${query}") ===`);
  outputChannel.show(true);

  const manifest = await fetchJson<RegistryManifest>(`${baseUrl}/r/contractspec.json`);
  const q = query.toLowerCase();
  const matches = manifest.items
    .filter((i) => `${i.name} ${i.title} ${i.description}`.toLowerCase().includes(q))
    .sort((a, b) => a.name.localeCompare(b.name));

  if (matches.length === 0) {
    vscode.window.showInformationMessage('No registry items matched your query.');
    outputChannel.appendLine('No matches.');
    return;
  }

  const selected = await vscode.window.showQuickPick(
    matches.map((i) => ({
      label: i.title || i.name,
      description: `${stripPrefix(i.type)} • ${i.name}`,
      detail: i.description,
      item: i,
    })),
    { placeHolder: 'Select an item to install', matchOnDetail: true }
  );
  if (!selected) return;

  const typeSegment = stripPrefix(selected.item.type);
  const itemUrl = `${baseUrl}/r/contractspec/${typeSegment}/${selected.item.name}.json`;
  const full = await fetchJson<RegistryItem>(itemUrl);
  await installRegistryItem(full, outputChannel);
}

export async function addFromRegistry(
  outputChannel: vscode.OutputChannel
): Promise<void> {
  // Keep this intentionally simple: browse → install.
  await browseRegistry(outputChannel);
}


