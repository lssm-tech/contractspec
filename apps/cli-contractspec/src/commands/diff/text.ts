import { execSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import type { TextDiffResult } from './types';
import { getErrorMessage } from '../../utils/errors';

export function diffText(
  aPath: string,
  bPath: string,
  aContent?: string,
  bContent?: string
): TextDiffResult {
  // Prefer git diff when both paths exist on disk
  if (existsSync(aPath) && existsSync(bPath)) {
    try {
      const output = execSync(`git diff --no-index -- "${aPath}" "${bPath}"`, {
        encoding: 'utf-8',
        stdio: ['ignore', 'pipe', 'pipe'],
      });
      return { ok: true, output };
    } catch (error) {
      // git diff exits non-zero when differences exist; still returns output on stdout,
      // but execSync throws. We'll capture what we can from the error.
      const maybe = error as unknown as { stdout?: unknown; stderr?: unknown };
      const stdout =
        typeof maybe.stdout === 'string'
          ? maybe.stdout
          : String(maybe.stdout ?? '');
      const stderr =
        typeof maybe.stderr === 'string'
          ? maybe.stderr
          : String(maybe.stderr ?? '');
      const combined = `${stdout}${stderr}`;
      if (combined.trim().length > 0) {
        return { ok: true, output: combined };
      }
      return { ok: false, output: getErrorMessage(error) };
    }
  }

  // Fallback: basic diff from content
  const left = aContent ?? readFileSync(aPath, 'utf-8');
  const right = bContent ?? readFileSync(bPath, 'utf-8');
  const lines1 = left.split('\n');
  const lines2 = right.split('\n');

  const out: string[] = [];
  const max = Math.max(lines1.length, lines2.length);
  for (let i = 0; i < max; i += 1) {
    const l1 = lines1[i];
    const l2 = lines2[i];
    if (l1 === l2) continue;
    if (typeof l1 === 'string') out.push(`- ${l1}`);
    if (typeof l2 === 'string') out.push(`+ ${l2}`);
  }

  return { ok: true, output: out.join('\n') };
}
