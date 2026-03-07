import type { DocBlock } from '@contractspec/lib.contracts-spec/docs';
import { registerDocBlocks } from '@contractspec/lib.contracts-spec/docs';

const ecosystemDocBlocks: DocBlock[] = [
  {
    id: 'docs.ecosystem.plugins',
    title: 'Marketplace plugins',
    summary:
      'Focused Cursor marketplace plugins for product and core libraries.',
    kind: 'usage',
    visibility: 'public',
    route: '/docs/ecosystem/plugins',
    tags: ['ecosystem', 'plugins', 'extensions'],
    body: `# Marketplace plugins

ContractSpec ships a focused Cursor marketplace catalog with plugins for the product and key libraries. Plugin sources live in \`packages/apps-registry/cursor-marketplace/plugins/*\`, while the root manifest at \`.cursor-plugin/marketplace.json\` drives submission.`,
  },
  {
    id: 'docs.ecosystem.integrations',
    title: 'Integrations',
    summary: 'Reference plugins and integrations you can extend.',
    kind: 'usage',
    visibility: 'public',
    route: '/docs/ecosystem/integrations',
    tags: ['ecosystem', 'integrations'],
    body: `# Integrations

Reference integrations demonstrate how to extend ContractSpec with real-world plugins. Use them as starting points for your own adapters and generators.`,
  },
  {
    id: 'docs.ecosystem.templates',
    title: 'Plugin authoring templates',
    summary:
      'Author focused plugins with a consistent marketplace-ready layout.',
    kind: 'usage',
    visibility: 'public',
    route: '/docs/ecosystem/templates',
    tags: ['ecosystem', 'templates'],
    body: '# Plugin authoring templates\n\nCreate each plugin under `packages/apps-registry/cursor-marketplace/plugins/<plugin-name>/` and include `.cursor-plugin/plugin.json`, `rules/`, `commands/`, `agents/`, `skills/`, and `.mcp.json`.',
  },

  {
    id: 'docs.ecosystem.registry',
    title: 'Marketplace manifest',
    summary: 'Manage and validate root marketplace entries for all plugins.',
    kind: 'usage',
    visibility: 'public',
    route: '/docs/ecosystem/registry',
    tags: ['ecosystem', 'registry'],
    body: '# Marketplace manifest\n\nKeep all plugin entries in `.cursor-plugin/marketplace.json` and validate them with `bun run plugin:contractspec:validate` before submission.',
  },
];

registerDocBlocks(ecosystemDocBlocks);
