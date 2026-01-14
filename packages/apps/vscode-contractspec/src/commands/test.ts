import * as vscode from 'vscode';
import * as path from 'path';

export async function generateTestsCommand(uri: vscode.Uri) {
  if (!uri) {
    // Try currently active editor
    const editor = vscode.window.activeTextEditor;
    if (editor) {
      uri = editor.document.uri;
    } else {
      vscode.window.showErrorMessage('No file selected to generate tests for.');
      return;
    }
  }

  // Basic validation that it's a TS file
  if (!uri.fsPath.endsWith('.ts')) {
    vscode.window.showErrorMessage(
      'Test generation only supports TypeScript files.'
    );
    return;
  }

  const workspaceFolder = vscode.workspace.getWorkspaceFolder(uri);
  if (!workspaceFolder) {
    vscode.window.showErrorMessage('File not in a workspace.');
    return;
  }

  const relativePath = path.relative(workspaceFolder.uri.fsPath, uri.fsPath);

  const terminal = vscode.window.createTerminal('ContractSpec Test Gen');
  terminal.show();
  terminal.sendText(`npx contractspec test "${relativePath}" --generate`);
}

export async function runSpecTestsCommand(uri: vscode.Uri) {
  if (!uri) {
    const editor = vscode.window.activeTextEditor;
    if (editor) uri = editor.document.uri;
    else {
      vscode.window.showErrorMessage('No file selected.');
      return;
    }
  }

  const workspaceFolder = vscode.workspace.getWorkspaceFolder(uri);
  if (!workspaceFolder) {
    vscode.window.showErrorMessage('File not in workspace.');
    return;
  }

  const relativePath = path.relative(workspaceFolder.uri.fsPath, uri.fsPath);
  const terminal = vscode.window.createTerminal('ContractSpec Run Tests');
  terminal.show();
  terminal.sendText(`npx contractspec test "${relativePath}"`);
}
