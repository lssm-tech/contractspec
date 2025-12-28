import * as vscode from 'vscode';

/**
 * Get the current spec file from the active editor.
 */
export function getCurrentSpecFile(): string | undefined {
  const editor = vscode.window.activeTextEditor;
  if (!editor) return undefined;

  const filePath = editor.document.uri.fsPath;

  // Check for all spec file patterns
  const specPatterns = [
    '.contracts.',
    '.contract.',
    '.operations.',
    '.operation.',
    '.spec.',
    '.feature.',
    '.event.',
    '.events.',
    '.presentation.',
    '.presentations.',
    '.model.',
    '.models.',
    '.capability.',
    '.workflow.',
    '.data-view.',
    '.form.',
    '.migration.',
    '.telemetry.',
    '.experiment.',
    '.app-config.',
    '.integration.',
    '.knowledge.',
    '.policy.',
    '.test-spec.',
  ];

  return specPatterns.some((pattern) => filePath.includes(pattern))
    ? filePath
    : undefined;
}
