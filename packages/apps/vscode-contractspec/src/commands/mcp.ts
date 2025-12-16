/**
 * MCP (Model Context Protocol) commands for ContractSpec extension.
 */

import * as vscode from 'vscode';

interface DocSearchResult {
  id: string;
  title: string;
  summary: string;
  route: string;
  visibility: string;
  tags: string[];
}

/**
 * Search ContractSpec docs via MCP.
 */
export async function searchDocs(
  outputChannel: vscode.OutputChannel
): Promise<void> {
  const config = vscode.workspace.getConfiguration('contractspec');
  const apiBaseUrl = config.get<string>('api.baseUrl', '');

  if (!apiBaseUrl) {
    vscode.window.showWarningMessage(
      'ContractSpec API base URL not configured. Set contractspec.api.baseUrl in settings to enable MCP features.'
    );
    return;
  }

  // Get search query from user
  const query = await vscode.window.showInputBox({
    prompt: 'Search ContractSpec documentation',
    placeHolder: 'e.g., telemetry, workflow, validation',
  });

  if (!query) {
    return;
  }

  outputChannel.appendLine(`\n=== Searching docs for: "${query}" ===`);
  outputChannel.show(true);

  try {
    const results = await callDocsMcp(apiBaseUrl, query);

    if (results.length === 0) {
      vscode.window.showInformationMessage('No docs found matching your query');
      outputChannel.appendLine('No results found');
      return;
    }

    outputChannel.appendLine(`Found ${results.length} result(s)\n`);

    // Show results in quick pick
    const items = results.map((doc) => ({
      label: doc.title,
      description: doc.visibility,
      detail: doc.summary,
      doc,
    }));

    const selected = await vscode.window.showQuickPick(items, {
      placeHolder: 'Select a doc to view',
      matchOnDescription: true,
      matchOnDetail: true,
    });

    if (selected) {
      // Fetch full doc content
      const content = await fetchDocContent(apiBaseUrl, selected.doc.id);

      // Show in new editor
      const document = await vscode.workspace.openTextDocument({
        content: `# ${selected.doc.title}\n\n${content}`,
        language: 'markdown',
      });
      await vscode.window.showTextDocument(document);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    vscode.window.showErrorMessage(`Error searching docs: ${message}`);
    outputChannel.appendLine(`\n❌ Error: ${message}`);
  }
}

/**
 * Call Docs MCP to search for docs.
 */
async function callDocsMcp(
  baseUrl: string,
  query: string
): Promise<DocSearchResult[]> {
  const url = `${baseUrl.replace(/\/$/, '')}/api/mcp/docs`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'tools/call',
      params: {
        name: 'docs.search.v1',
        arguments: {
          query,
        },
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`MCP request failed: ${response.status}`);
  }

  const result = await response.json();

  if (result.error) {
    throw new Error(result.error.message ?? 'MCP error');
  }

  // Parse the result content
  const content = result.result?.content?.[0];
  if (!content || content.type !== 'text') {
    return [];
  }

  try {
    const parsed = JSON.parse(content.text);
    return parsed.docs ?? [];
  } catch {
    return [];
  }
}

/**
 * Fetch full doc content from MCP.
 */
async function fetchDocContent(
  baseUrl: string,
  docId: string
): Promise<string> {
  const url = `${baseUrl.replace(/\/$/, '')}/api/mcp/docs`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'resources/read',
      params: {
        uri: `docs://doc/${encodeURIComponent(docId)}`,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`MCP request failed: ${response.status}`);
  }

  const result = await response.json();

  if (result.error) {
    throw new Error(result.error.message ?? 'MCP error');
  }

  const content = result.result?.contents?.[0];
  return content?.text ?? 'No content available';
}

