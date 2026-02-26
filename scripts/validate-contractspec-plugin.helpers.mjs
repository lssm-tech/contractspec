import { existsSync, readFileSync } from 'node:fs';
import { isAbsolute, join, normalize } from 'node:path';

export const NAME_RE = /^[a-z0-9](?:[a-z0-9.-]*[a-z0-9])?$/;
export const REQUIRED_FILES = [
  '.cursor-plugin/plugin.json',
  '.mcp.json',
  'README.md',
  'assets/logo.svg',
];

export function readJson(context, pathValue, label) {
  if (!existsSync(pathValue)) {
    context.errors.push(
      `${label} is missing: ${pathValue.replace(`${context.root}/`, '')}`
    );
    return null;
  }

  try {
    return JSON.parse(readFileSync(pathValue, 'utf8'));
  } catch (error) {
    context.errors.push(`Invalid JSON in ${label}: ${String(error)}`);
    return null;
  }
}

export function isSafeRelativePath(pathValue) {
  if (
    typeof pathValue !== 'string' ||
    pathValue.trim().length === 0 ||
    isAbsolute(pathValue)
  ) {
    return false;
  }
  const normalized = normalize(pathValue).replace(/\\/g, '/');
  return !(
    normalized === '..' ||
    normalized.startsWith('../') ||
    normalized.includes('/../')
  );
}

export function ensurePluginPath(context, pathValue, fieldName) {
  if (!isSafeRelativePath(pathValue)) {
    context.errors.push(
      `Manifest ${fieldName} contains unsafe path: ${String(pathValue)}`
    );
    return;
  }
  if (!existsSync(join(context.pluginDir, pathValue))) {
    context.errors.push(
      `Manifest ${fieldName} path does not exist: ${pathValue}`
    );
  }
}

export function parseFrontmatter(root, filePath) {
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

export function validateManifest(context, manifest) {
  if (typeof manifest.name !== 'string' || !NAME_RE.test(manifest.name)) {
    context.errors.push(
      'Manifest name must be lowercase kebab-style and marketplace-safe'
    );
  }
  if (
    typeof manifest.description !== 'string' ||
    manifest.description.trim().length === 0
  ) {
    context.errors.push('Manifest must include a non-empty description');
  }

  for (const fieldName of ['logo', 'rules', 'commands', 'agents', 'skills']) {
    const value = manifest[fieldName];
    if (typeof value === 'undefined') {
      continue;
    }
    for (const pathValue of Array.isArray(value) ? value : [value]) {
      if (typeof pathValue !== 'string') {
        context.errors.push(
          `Manifest ${fieldName} must be a string or array of strings`
        );
        continue;
      }
      ensurePluginPath(context, pathValue, fieldName);
    }
  }

  if (typeof manifest.mcpServers === 'string') {
    ensurePluginPath(context, manifest.mcpServers, 'mcpServers');
  }
  if (Array.isArray(manifest.mcpServers)) {
    for (const entry of manifest.mcpServers) {
      if (typeof entry === 'string') {
        ensurePluginPath(context, entry, 'mcpServers');
      }
    }
  }
}

export function validateMarketplace(context, marketplace, pluginName) {
  if (!marketplace) {
    return;
  }

  if (
    typeof marketplace.name !== 'string' ||
    marketplace.name.trim().length === 0
  ) {
    context.errors.push('Marketplace manifest must include a name');
  }
  if (
    !marketplace.owner ||
    typeof marketplace.owner.name !== 'string' ||
    marketplace.owner.name.trim().length === 0
  ) {
    context.errors.push('Marketplace manifest must include owner.name');
  }
  if (!Array.isArray(marketplace.plugins) || marketplace.plugins.length === 0) {
    context.errors.push(
      'Marketplace manifest must include at least one plugin entry'
    );
    return;
  }

  const entry = marketplace.plugins.find((item) => item?.name === pluginName);
  if (!entry) {
    context.errors.push(
      `Marketplace manifest is missing plugin entry for '${pluginName}'`
    );
    return;
  }
  if (typeof entry.source !== 'string') {
    context.errors.push(
      `Marketplace plugin '${pluginName}' must define string source`
    );
    return;
  }
  if (!isSafeRelativePath(entry.source)) {
    context.errors.push(`Marketplace plugin source is unsafe: ${entry.source}`);
    return;
  }
  if (!existsSync(join(context.root, entry.source))) {
    context.errors.push(
      `Marketplace plugin source does not exist: ${entry.source}`
    );
  }
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
