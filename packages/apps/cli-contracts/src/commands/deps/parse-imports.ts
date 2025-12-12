import path from 'node:path';

export function parseImportedSpecNames(
  sourceCode: string,
  fromFilePath: string
): string[] {
  const imports: string[] = [];

  // Capture relative imports that reference spec-ish files.
  // Examples:
  // import x from './foo.contracts'
  // import { y } from '../bar.event.ts'
  const importRegex =
    /import\s+.*?\s+from\s+['"]([^'"]+\.(?:contracts|event|presentation|workflow|data-view|migration|telemetry|experiment|app-config|integration|knowledge)(?:\.[jt]s)?)['"]/g;

  let match: RegExpExecArray | null;
  while ((match = importRegex.exec(sourceCode)) !== null) {
    const importPath = match[1];
    if (!importPath) continue;
    if (!importPath.startsWith('.') && !importPath.startsWith('/')) continue;

    const resolvedPath = path.resolve(path.dirname(fromFilePath), importPath);
    const base = path.basename(resolvedPath);

    const name = base
      .replace(/\.(ts|js)$/, '')
      .replace(/\.(contracts|event|presentation|workflow|data-view|migration|telemetry|experiment|app-config|integration|knowledge)$/, '');

    if (name.length > 0) {
      imports.push(name);
    }
  }

  return Array.from(new Set(imports)).sort((a, b) => a.localeCompare(b));
}


