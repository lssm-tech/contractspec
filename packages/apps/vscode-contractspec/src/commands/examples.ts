/**
 * Examples commands for ContractSpec extension.
 */

import * as vscode from 'vscode';
import {
  getExample,
  listExamples,
  searchExamples,
} from '@lssm/module.contractspec-examples';

interface ExampleSummary {
  id: string;
  title: string;
  summary: string;
  tags: readonly string[];
}

export async function browseExamples(
  outputChannel: vscode.OutputChannel
): Promise<void> {
  const config = vscode.workspace.getConfiguration('contractspec');
  const apiBaseUrl = config.get<string>('api.baseUrl', '');

  const query = await vscode.window.showInputBox({
    prompt: 'Search ContractSpec examples',
    placeHolder: 'e.g., crm, knowledge, integration',
  });

  const items = await (apiBaseUrl
    ? fetchExamplesViaInternalMcp(apiBaseUrl, query ?? '')
    : Promise.resolve(
        (query ? searchExamples(query) : [...listExamples()]).map((e) => ({
          id: e.id,
          title: e.title,
          summary: e.summary,
          tags: e.tags,
        }))
      ));

  if (!items.length) {
    vscode.window.showInformationMessage('No examples found');
    return;
  }

  const selected = await vscode.window.showQuickPick(
    items.map((e) => ({
      label: e.title,
      description: e.id,
      detail: e.summary,
      example: e,
    })),
    { placeHolder: 'Select an example' }
  );

  if (!selected) return;

  outputChannel.appendLine(`\n=== Example: ${selected.example.id} ===`);
  outputChannel.appendLine(selected.example.title);
  outputChannel.appendLine(selected.example.summary);
  outputChannel.show(true);

  const full = apiBaseUrl
    ? await fetchExampleViaInternalMcp(apiBaseUrl, selected.example.id)
    : getExample(selected.example.id);

  const document = await vscode.workspace.openTextDocument({
    content: JSON.stringify(full ?? selected.example, null, 2),
    language: 'json',
  });
  await vscode.window.showTextDocument(document);
}

export async function initExampleIntoWorkspace(
  outputChannel: vscode.OutputChannel
): Promise<void> {
  const picked = await vscode.window.showQuickPick(
    [...listExamples()].map((e) => ({
      label: e.title,
      description: e.id,
      detail: e.summary,
      id: e.id,
    })),
    { placeHolder: 'Choose an example to initialize into this workspace' }
  );
  if (!picked) return;

  const example = getExample(picked.id);
  if (!example) {
    vscode.window.showErrorMessage(`Unknown example id: ${picked.id}`);
    return;
  }

  const root = vscode.workspace.workspaceFolders?.[0]?.uri;
  if (!root) {
    vscode.window.showWarningMessage('Open a workspace folder first.');
    return;
  }

  const targetDir = vscode.Uri.joinPath(
    root,
    '.contractspec',
    'examples',
    example.id
  );
  await vscode.workspace.fs.createDirectory(targetDir);

  const manifestFile = vscode.Uri.joinPath(targetDir, 'example.json');
  const readmeFile = vscode.Uri.joinPath(targetDir, 'README.md');

  await vscode.workspace.fs.writeFile(
    manifestFile,
    Buffer.from(JSON.stringify(example, null, 2), 'utf8')
  );
  await vscode.workspace.fs.writeFile(
    readmeFile,
    Buffer.from(
      [
        `# ${example.title}`,
        '',
        example.summary,
        '',
        `- id: \`${example.id}\``,
        `- package: \`${example.entrypoints.packageName}\``,
        '',
        'This folder is a lightweight workspace stub that references an example manifest.',
        'Use it as a starting point for exploration or for wiring into your own project structure.',
      ].join('\n'),
      'utf8'
    )
  );

  outputChannel.appendLine(
    `✅ Initialized example "${example.id}" into ${targetDir.fsPath}`
  );
  outputChannel.show(true);

  const doc = await vscode.workspace.openTextDocument(readmeFile);
  await vscode.window.showTextDocument(doc);
}

async function fetchExamplesViaInternalMcp(
  baseUrl: string,
  query: string
): Promise<ExampleSummary[]> {
  const url = `${baseUrl.replace(/\/$/, '')}/api/mcp/internal`;
  const uri = query
    ? `examples://list?q=${encodeURIComponent(query)}`
    : 'examples://list';

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'resources/read',
      params: { uri },
    }),
  });

  if (!response.ok) throw new Error(`MCP request failed: ${response.status}`);
  const result = await response.json();
  if (result.error) throw new Error(result.error.message ?? 'MCP error');
  const content = result.result?.contents?.[0]?.text;
  if (!content) return [];
  const parsed = JSON.parse(content) as {
    id: string;
    title: string;
    summary: string;
    tags: string[];
  }[];
  return parsed.map((e) => ({ ...e, tags: e.tags }));
}

async function fetchExampleViaInternalMcp(
  baseUrl: string,
  id: string
): Promise<unknown> {
  const url = `${baseUrl.replace(/\/$/, '')}/api/mcp/internal`;
  const uri = `examples://example/${encodeURIComponent(id)}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'resources/read',
      params: { uri },
    }),
  });
  if (!response.ok) throw new Error(`MCP request failed: ${response.status}`);
  const result = await response.json();
  if (result.error) throw new Error(result.error.message ?? 'MCP error');
  const content = result.result?.contents?.[0]?.text;
  if (!content) return null;
  return JSON.parse(content);
}

