import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { NAME_RE } from './validate-contractspec-plugin.context.mjs';

function parseFrontmatter(root, filePath) {
  const raw = readFileSync(join(root, filePath), 'utf8');
  const match = raw.match(/^---\n([\s\S]*?)\n---\n/);
  if (!match) {
    return null;
  }

  const data = {};
  for (const line of match[1].split('\n')) {
    const idx = line.indexOf(':');
    if (idx <= 0) {
      continue;
    }
    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim();
    data[key] = value.replace(/^"|"$/g, '').replace(/^'|'$/g, '');
  }

  return data;
}

export function validateFrontmatter(context, root, files) {
  for (const filePath of files.rules) {
    const frontmatter = parseFrontmatter(root, filePath);
    if (!frontmatter) {
      context.errors.push(`Rule is missing YAML frontmatter: ${filePath}`);
      continue;
    }
    if (!frontmatter.description) {
      context.errors.push(`Rule frontmatter missing description: ${filePath}`);
    }
    if (!Object.prototype.hasOwnProperty.call(frontmatter, 'alwaysApply')) {
      context.errors.push(`Rule frontmatter missing alwaysApply: ${filePath}`);
    }
  }

  const seen = new Set();
  for (const filePath of [
    ...files.commands,
    ...files.agents,
    ...files.skills,
  ]) {
    const frontmatter = parseFrontmatter(root, filePath);
    if (!frontmatter) {
      context.errors.push(`Frontmatter missing: ${filePath}`);
      continue;
    }
    if (!frontmatter.name) {
      context.errors.push(`Frontmatter missing name: ${filePath}`);
      continue;
    }
    if (!NAME_RE.test(frontmatter.name)) {
      context.errors.push(`Frontmatter name must be kebab-case: ${filePath}`);
    }
    if (seen.has(frontmatter.name)) {
      context.errors.push(
        `Duplicate frontmatter name detected: ${frontmatter.name}`
      );
    }
    seen.add(frontmatter.name);
    if (!frontmatter.description) {
      context.errors.push(`Frontmatter missing description: ${filePath}`);
    }
  }
}
