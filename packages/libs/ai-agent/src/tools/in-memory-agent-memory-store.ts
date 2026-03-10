import {
  type AgentMemoryStore,
  validateMemoryPath,
} from './agent-memory-store';

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}K`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}M`;
}

/**
 * In-memory implementation of AgentMemoryStore for development and testing.
 * Paths are stored as keys; directories are implicit (paths with /).
 */
export class InMemoryAgentMemoryStore implements AgentMemoryStore {
  private readonly store = new Map<string, string>();

  async view(path: string, viewRange?: [number, number]): Promise<string> {
    validateMemoryPath(path);
    const normalized =
      path.replace(/\/+/g, '/').replace(/\/$/, '') || '/memories';

    if (this.isDirectory(normalized)) {
      return this.listDirectory(normalized);
    }

    const content = this.store.get(normalized);
    if (content === undefined) {
      return `The path ${path} does not exist. Please provide a valid path.`;
    }

    const lines = content.split('\n');
    if (lines.length > 999_999) {
      return `File ${path} exceeds maximum line limit of 999,999 lines.`;
    }

    const [start, end] = viewRange ?? [1, lines.length];
    const from = Math.max(0, start - 1);
    const to = Math.min(lines.length, end);
    const selected = lines.slice(from, to);

    const numbered = selected
      .map((line, i) => {
        const num = from + i + 1;
        return `${String(num).padStart(6)}	${line}`;
      })
      .join('\n');

    return `Here's the content of ${path} with line numbers:\n${numbered}`;
  }

  async create(path: string, fileText: string): Promise<string> {
    validateMemoryPath(path);
    const normalized = path.replace(/\/+/g, '/');
    if (this.store.has(normalized)) {
      return `Error: File ${path} already exists`;
    }
    this.ensureParentDir(normalized);
    this.store.set(normalized, fileText);
    return `File created successfully at: ${path}`;
  }

  async strReplace(
    path: string,
    oldStr: string,
    newStr: string
  ): Promise<string> {
    validateMemoryPath(path);
    const normalized = path.replace(/\/+/g, '/');
    const content = this.store.get(normalized);
    if (content === undefined) {
      return `Error: The path ${path} does not exist. Please provide a valid path.`;
    }

    const count = (content.match(new RegExp(escapeRegex(oldStr), 'g')) ?? [])
      .length;
    if (count > 1) {
      const lines = content.split('\n');
      const lineNums: number[] = [];
      lines.forEach((line, i) => {
        if (line.includes(oldStr)) lineNums.push(i + 1);
      });
      return `No replacement was performed. Multiple occurrences of old_str \`${oldStr}\` in lines: ${lineNums.join(', ')}. Please ensure it is unique`;
    }
    if (count === 0) {
      return `No replacement was performed, old_str \`${oldStr}\` did not appear verbatim in ${path}.`;
    }

    const newContent = content.replace(oldStr, newStr);
    this.store.set(normalized, newContent);

    const snippet = newContent.split('\n').slice(0, 5);
    const numbered = snippet
      .map((line, i) => `${String(i + 1).padStart(6)}	${line}`)
      .join('\n');
    return `The memory file has been edited.\n${numbered}`;
  }

  async insert(
    path: string,
    insertLine: number,
    insertText: string
  ): Promise<string> {
    validateMemoryPath(path);
    const normalized = path.replace(/\/+/g, '/');
    const content = this.store.get(normalized);
    if (content === undefined) {
      return `Error: The path ${path} does not exist`;
    }

    const lines = content.split('\n');
    const n = lines.length;
    if (insertLine < 0 || insertLine > n) {
      return `Error: Invalid \`insert_line\` parameter: ${insertLine}. It should be within the range of lines of the file: [0, ${n}]`;
    }

    lines.splice(insertLine, 0, insertText.replace(/\n$/, ''));
    this.store.set(normalized, lines.join('\n'));
    return `The file ${path} has been edited.`;
  }

  async delete(path: string): Promise<string> {
    validateMemoryPath(path);
    const normalized = path.replace(/\/+/g, '/');
    if (this.isDirectory(normalized)) {
      const prefix =
        normalized === '/memories' ? '/memories/' : `${normalized}/`;
      for (const key of this.store.keys()) {
        if (key.startsWith(prefix) || key === normalized) {
          this.store.delete(key);
        }
      }
    } else {
      if (!this.store.has(normalized)) {
        return `Error: The path ${path} does not exist`;
      }
      this.store.delete(normalized);
    }
    return `Successfully deleted ${path}`;
  }

  async rename(oldPath: string, newPath: string): Promise<string> {
    validateMemoryPath(oldPath);
    validateMemoryPath(newPath);
    const oldNorm = oldPath.replace(/\/+/g, '/');
    const newNorm = newPath.replace(/\/+/g, '/');

    if (this.store.has(newNorm) || this.hasAnyChild(newNorm)) {
      return `Error: The destination ${newPath} already exists`;
    }
    if (this.isDirectory(oldNorm)) {
      const oldPrefix = `${oldNorm}/`;
      const entries = Array.from(this.store.entries()).filter(
        ([k]) => k.startsWith(oldPrefix) || k === oldNorm
      );
      const newPrefix = `${newNorm}/`;
      for (const [k, v] of entries) {
        this.store.delete(k);
        const newKey =
          k === oldNorm ? newNorm : newPrefix + k.slice(oldPrefix.length);
        this.store.set(newKey, v);
      }
    } else {
      const content = this.store.get(oldNorm);
      if (content === undefined) {
        return `Error: The path ${oldPath} does not exist`;
      }
      this.store.delete(oldNorm);
      this.ensureParentDir(newNorm);
      this.store.set(newNorm, content);
    }
    return `Successfully renamed ${oldPath} to ${newPath}`;
  }

  private isDirectory(path: string): boolean {
    if (path === '/memories') return true;
    for (const key of this.store.keys()) {
      if (key.startsWith(path + '/')) return true;
    }
    return false;
  }

  private hasAnyChild(path: string): boolean {
    const prefix = path.endsWith('/') ? path : `${path}/`;
    for (const key of this.store.keys()) {
      if (key.startsWith(prefix)) return true;
    }
    return false;
  }

  private ensureParentDir(path: string): void {
    const parts = path.split('/').filter(Boolean);
    parts.pop();
    for (let i = 1; i <= parts.length; i++) {
      const p = '/' + parts.slice(0, i).join('/');
      if (!this.store.has(p)) {
        this.store.set(p, '');
      }
    }
  }

  private listDirectory(path: string): string {
    const prefix = path === '/memories' ? '/memories/' : `${path}/`;
    const seen = new Set<string>();
    const entries: { path: string; size: number }[] = [];

    if (path === '/memories') {
      entries.push({
        path: '/memories',
        size: Array.from(this.store.keys())
          .filter((k) => k.startsWith('/memories/'))
          .reduce((acc, k) => acc + (this.store.get(k)?.length ?? 0), 0),
      });
    }

    for (const key of this.store.keys()) {
      if (!key.startsWith(prefix) && key !== path) continue;
      const rel = key.slice(prefix.length);
      const first = rel.split('/')[0];
      if (!first || first.startsWith('.') || first === 'node_modules') continue;
      const fullPath =
        path === '/memories' ? `/memories/${first}` : `${path}/${first}`;
      if (seen.has(fullPath)) continue;
      seen.add(fullPath);

      let size = 0;
      if (this.store.has(key)) {
        size = (this.store.get(key) ?? '').length;
      } else {
        for (const k of this.store.keys()) {
          if (k.startsWith(fullPath + '/') || k === fullPath) {
            size += (this.store.get(k) ?? '').length;
          }
        }
      }
      entries.push({ path: fullPath, size });
    }

    const lines = entries
      .slice(0, 50)
      .map((e) => `${formatSize(e.size)}\t${e.path}`)
      .join('\n');
    return `Here're the files and directories up to 2 levels deep in ${path}, excluding hidden items and node_modules:\n${lines}`;
  }
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
