import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { globSync } from 'glob';

const DEPRECATED_REF_RE = /@contractspec\/lib\.contracts(?!-spec)/;

export function collectFiles(root) {
  return {
    rules: globSync('plugins/contractspec/rules/*.mdc', { cwd: root }),
    commands: globSync('plugins/contractspec/commands/*.md', { cwd: root }),
    agents: globSync('plugins/contractspec/agents/*.md', { cwd: root }),
    skills: globSync('plugins/contractspec/skills/*/SKILL.md', { cwd: root }),
  };
}

export function validatePresence(context, files) {
  if (files.rules.length === 0) {
    context.errors.push('Plugin must include at least one rule');
  }
  if (files.commands.length === 0) {
    context.errors.push('Plugin must include at least one command');
  }
  if (files.agents.length === 0) {
    context.errors.push('Plugin must include at least one agent');
  }
  if (files.skills.length === 0) {
    context.errors.push('Plugin must include at least one skill');
  }
}

export function validateDeprecatedReferences(context, root) {
  const textFiles = globSync('plugins/contractspec/**/*.{md,mdc,json}', {
    cwd: root,
  });
  for (const filePath of textFiles) {
    const content = readFileSync(join(root, filePath), 'utf8');
    if (DEPRECATED_REF_RE.test(content)) {
      context.errors.push(
        `Deprecated package reference found in ${filePath}: use @contractspec/lib.contracts-spec`
      );
    }
  }
}
