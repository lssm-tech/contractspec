import { existsSync } from 'node:fs';
import { join } from 'node:path';
import {
  NAME_RE,
  ensurePluginPath,
  isSafeRelativePath,
} from './validate-contractspec-plugin.context.mjs';

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
