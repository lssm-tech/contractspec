/**
 * Fix Link Formatter.
 *
 * Generates links for external surfaces (CLI, VSCode, GitHub).
 */

import type { FixLink, FixLinkOptions } from './types';
import type { IntegrityIssue } from '../integrity';

/**
 * Generate fix links for an issue.
 */
export function generateFixLinks(
  issue: IntegrityIssue,
  options: FixLinkOptions
): FixLink[] {
  const links: FixLink[] = [];

  if (!issue.ref || !issue.file) {
    return links;
  }

  // CLI Command
  if (options.includeCli) {
    links.push({
      type: 'cli',
      label: 'Fix with CLI',
      value: `contractspec fix --target "${issue.file}"`,
    });
  }

  // VSCode Deep Link
  if (options.includeVscode) {
    // vscode://file/{path}:{line}:{col}
    const path = issue.file.startsWith('/') ? issue.file : `/${issue.file}`;
    // Cast to any to access potential line/column if not in strictly typed RefInfo
    // or assume they exist if runtime provides them
    // Cast to unknown first to avoid exact type constraints if properties are missing in type definition
    const ref = issue.ref as unknown as { line?: number; column?: number };
    const line = ref.line || 1;
    const col = ref.column || 1;
    links.push({
      type: 'vscode',
      label: 'Open in VS Code',
      value: `vscode://file${path}:${line}:${col}`,
    });
  }

  // GitHub Issue
  if (options.includeGithubIssue && options.repository) {
    const title = encodeURIComponent(`Fix Integrity Issue: ${issue.message}`);
    const body = encodeURIComponent(
      `Found integrity issue in \`${issue.file}\`:\n\n> ${issue.message}\n\nReference: \`${issue.ref.key}.v${issue.ref.version}\``
    );
    links.push({
      type: 'github-issue',
      label: 'Create Issue',
      value: `https://github.com/${options.repository}/issues/new?title=${title}&body=${body}`,
    });
  }

  return links;
}
