import { existsSync } from 'node:fs';
import { join } from 'node:path';
import {
  NAME_RE,
  ensurePluginPath,
  isSafeRelativePath,
} from './validate-contractspec-plugin.context.mjs';

export function validateManifest(context, manifest, pluginName) {
  if (typeof manifest.name !== 'string' || !NAME_RE.test(manifest.name)) {
    context.errors.push(
      `Plugin '${pluginName}' has invalid manifest name '${manifest.name ?? ''}'`
    );
  }
  if (
    typeof manifest.description !== 'string' ||
    manifest.description.trim().length === 0
  ) {
    context.errors.push(
      `Plugin '${pluginName}' manifest must include a non-empty description`
    );
  }

  for (const fieldName of ['logo', 'rules', 'commands', 'agents', 'skills']) {
    const value = manifest[fieldName];
    if (typeof value === 'undefined') {
      continue;
    }
    for (const pathValue of Array.isArray(value) ? value : [value]) {
      if (typeof pathValue !== 'string') {
        context.errors.push(
          `Plugin '${pluginName}' manifest field '${fieldName}' must be a string or array of strings`
        );
        continue;
      }
      ensurePluginPath(context, pathValue, `${pluginName}.${fieldName}`);
    }
  }

  if (typeof manifest.mcpServers === 'string') {
    ensurePluginPath(context, manifest.mcpServers, `${pluginName}.mcpServers`);
  }
  if (Array.isArray(manifest.mcpServers)) {
    for (const entry of manifest.mcpServers) {
      if (typeof entry === 'string') {
        ensurePluginPath(context, entry, `${pluginName}.mcpServers`);
      }
    }
  }
}

export function validateMarketplace(context, marketplace) {
  if (!marketplace) {
    return [];
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
    return [];
  }

  const validEntries = [];
  const names = new Set();
  const sources = new Set();

  for (const entry of marketplace.plugins) {
    if (!entry || typeof entry !== 'object') {
      context.errors.push('Marketplace plugin entry must be an object');
      continue;
    }

    if (typeof entry.name !== 'string' || !NAME_RE.test(entry.name)) {
      context.errors.push('Marketplace plugin entry has invalid name');
      continue;
    }
    if (names.has(entry.name)) {
      context.errors.push(
        `Marketplace plugin name is duplicated: ${entry.name}`
      );
      continue;
    }
    names.add(entry.name);

    if (typeof entry.source !== 'string') {
      context.errors.push(
        `Marketplace plugin '${entry.name}' must define string source`
      );
      continue;
    }
    if (!isSafeRelativePath(entry.source)) {
      context.errors.push(
        `Marketplace plugin '${entry.name}' source is unsafe: ${entry.source}`
      );
      continue;
    }
    if (sources.has(entry.source)) {
      context.errors.push(
        `Marketplace plugin source is duplicated: ${entry.source}`
      );
      continue;
    }
    sources.add(entry.source);
    if (!existsSync(join(context.root, entry.source))) {
      context.errors.push(
        `Marketplace plugin '${entry.name}' source does not exist: ${entry.source}`
      );
      continue;
    }

    validEntries.push(entry);
  }

  return validEntries;
}

export function validateMarketplaceLink(context, manifest, entry) {
  if (!manifest || !entry) {
    return;
  }
  if (manifest.name !== entry.name) {
    context.errors.push(
      `Marketplace name '${entry.name}' does not match manifest name '${manifest.name}' for source ${entry.source}`
    );
  }
}
