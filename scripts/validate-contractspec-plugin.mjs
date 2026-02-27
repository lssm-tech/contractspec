#!/usr/bin/env node

import { existsSync } from 'node:fs';
import { join } from 'node:path';
import {
  REQUIRED_FILES,
  readJson,
} from './validate-contractspec-plugin.context.mjs';
import {
  collectFiles,
  validateDeprecatedReferences,
  validatePresence,
} from './validate-contractspec-plugin.content.mjs';
import { validateFrontmatter } from './validate-contractspec-plugin.frontmatter.mjs';
import {
  validateManifest,
  validateMarketplaceLink,
  validateMarketplace,
} from './validate-contractspec-plugin.manifest.mjs';
import {
  checkMcpUrls,
  validateMcpShape,
} from './validate-contractspec-plugin.mcp.mjs';

const root = process.cwd();
const context = { root, errors: [], notices: [] };
const marketplaceManifestPath = join(
  root,
  '.cursor-plugin',
  'marketplace.json'
);

const marketplace = readJson(
  context,
  marketplaceManifestPath,
  'marketplace manifest'
);
const entries = validateMarketplace(context, marketplace);

for (const entry of entries) {
  const pluginDir = join(root, entry.source);
  const pluginContext = {
    root,
    pluginDir,
    errors: context.errors,
    notices: context.notices,
  };

  for (const pathValue of REQUIRED_FILES) {
    if (!existsSync(join(pluginDir, pathValue))) {
      pluginContext.errors.push(
        `Plugin '${entry.name}' is missing required file: ${entry.source}/${pathValue}`
      );
    }
  }

  const pluginManifestPath = join(pluginDir, '.cursor-plugin', 'plugin.json');
  const manifest = readJson(
    pluginContext,
    pluginManifestPath,
    `plugin manifest (${entry.name})`
  );
  if (manifest) {
    validateManifest(pluginContext, manifest, entry.name);
    validateMarketplaceLink(pluginContext, manifest, entry);
  }

  const files = collectFiles(root, entry.source);
  validateDeprecatedReferences(pluginContext, root, entry.source);
  validatePresence(pluginContext, files, entry.name);
  validateFrontmatter(pluginContext, root, files);

  const mcpRelativePath =
    typeof manifest?.mcpServers === 'string'
      ? manifest.mcpServers
      : '.mcp.json';
  const mcpPath = join(pluginDir, mcpRelativePath);
  const mcpConfig = readJson(
    pluginContext,
    mcpPath,
    `.mcp.json (${entry.name})`
  );
  const urls = mcpConfig ? validateMcpShape(pluginContext, mcpConfig) : [];
  await checkMcpUrls(pluginContext, urls);
}

if (context.errors.length > 0) {
  console.error('ContractSpec marketplace plugin validation failed:');
  for (const error of context.errors) {
    console.error(`- ${error}`);
  }
  if (context.notices.length > 0) {
    console.error('Notices:');
    for (const notice of context.notices) {
      console.error(`- ${notice}`);
    }
  }
  process.exit(1);
}

console.log('ContractSpec marketplace plugin validation passed.');
for (const notice of context.notices) {
  console.log(`- ${notice}`);
}
