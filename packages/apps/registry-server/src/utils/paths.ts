import path from 'node:path';

export function repoRoot(): string {
  return process.env.CONTRACTSPEC_REPO_ROOT ?? process.cwd();
}

export function fromRepoRoot(...segments: string[]): string {
  return path.join(repoRoot(), ...segments);
}


