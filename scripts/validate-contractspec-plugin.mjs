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
  validateMarketplace,
} from './validate-contractspec-plugin.manifest.mjs';
import {
  checkMcpUrls,
  validateMcpShape,
} from './validate-contractspec-plugin.mcp.mjs';

const root = process.cwd();
const pluginDir = join(root, 'plugins', 'contractspec');
const context = { root, pluginDir, errors: [], notices: [] };

const pluginManifestPath = join(pluginDir, '.cursor-plugin', 'plugin.json');
const marketplaceManifestPath = join(
  root,
  '.cursor-plugin',
  'marketplace.json'
);
const mcpPath = join(pluginDir, '.mcp.json');

for (const pathValue of REQUIRED_FILES) {
  if (!existsSync(join(pluginDir, pathValue))) {
    context.errors.push(
      `Missing required file: plugins/contractspec/${pathValue}`
    );
  }
}

const manifest = readJson(context, pluginManifestPath, 'plugin manifest');
if (manifest) {
  validateManifest(context, manifest);
}

const marketplace = readJson(
  context,
  marketplaceManifestPath,
  'marketplace manifest'
);
if (manifest?.name) {
  validateMarketplace(context, marketplace, manifest.name);
}

const files = collectFiles(root);
validateDeprecatedReferences(context, root);
validatePresence(context, files);

validateFrontmatter(context, root, files);

const mcpConfig = readJson(context, mcpPath, '.mcp.json');
const urls = mcpConfig ? validateMcpShape(context, mcpConfig) : [];
await checkMcpUrls(context, urls);

if (context.errors.length > 0) {
  console.error('ContractSpec plugin validation failed:');
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

console.log('ContractSpec plugin validation passed.');
for (const notice of context.notices) {
  console.log(`- ${notice}`);
}
