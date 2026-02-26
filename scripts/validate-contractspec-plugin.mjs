#!/usr/bin/env node

import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { globSync } from 'glob';
import {
  REQUIRED_FILES,
  readJson,
  validateFrontmatter,
  validateManifest,
  validateMarketplace,
} from './validate-contractspec-plugin.helpers.mjs';
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

const files = {
  rules: globSync('plugins/contractspec/rules/*.mdc', { cwd: root }),
  commands: globSync('plugins/contractspec/commands/*.md', { cwd: root }),
  agents: globSync('plugins/contractspec/agents/*.md', { cwd: root }),
  skills: globSync('plugins/contractspec/skills/*/SKILL.md', { cwd: root }),
};

const deprecatedRefPattern = /@contractspec\/lib\.contracts(?!-spec)/;
const textFiles = globSync('plugins/contractspec/**/*.{md,mdc,json}', {
  cwd: root,
});
for (const filePath of textFiles) {
  const content = readFileSync(join(root, filePath), 'utf8');
  if (deprecatedRefPattern.test(content)) {
    context.errors.push(
      `Deprecated package reference found in ${filePath}: use @contractspec/lib.contracts-spec`
    );
  }
}

if (files.rules.length === 0)
  context.errors.push('Plugin must include at least one rule');
if (files.commands.length === 0)
  context.errors.push('Plugin must include at least one command');
if (files.agents.length === 0)
  context.errors.push('Plugin must include at least one agent');
if (files.skills.length === 0)
  context.errors.push('Plugin must include at least one skill');

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
