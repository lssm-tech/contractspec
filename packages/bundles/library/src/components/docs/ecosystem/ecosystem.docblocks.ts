import type { DocBlock } from '@contractspec/lib.contracts/docs';
import { registerDocBlocks } from '@contractspec/lib.contracts/docs';

const ecosystemDocBlocks: DocBlock[] = [
  {
    id: 'docs.ecosystem.plugins',
    title: 'Plugin API',
    summary: 'Build generators, validators, adapters, and registry resolvers.',
    kind: 'usage',
    visibility: 'public',
    route: '/docs/ecosystem/plugins',
    tags: ['ecosystem', 'plugins', 'extensions'],
    body: `# Plugin API

ContractSpec plugins extend the platform with generators, validators, adapters, formatters, and registry resolvers. Define capabilities in code, register them through configuration, and ship reusable packages.`,
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
    title: 'Plugin templates',
    summary: 'Scaffold new plugins with create-contractspec-plugin.',
    kind: 'usage',
    visibility: 'public',
    route: '/docs/ecosystem/templates',
    tags: ['ecosystem', 'templates'],
    body: `# Plugin templates

Use \\`create-contractspec-plugin\\` to scaffold a new plugin package with tests, documentation, and CI wiring.`,
  },
  {
    id: 'docs.ecosystem.registry',
    title: 'Registry resolution',
    summary: 'Discover plugins locally or from remote registries.',
    kind: 'usage',
    visibility: 'public',
    route: '/docs/ecosystem/registry',
    tags: ['ecosystem', 'registry'],
    body: `# Registry resolution

Plugins can be resolved from local workspaces, npm packages, or remote registries. Configure resolution order in \\`.contractsrc.json\\` and use registry resolver plugins for custom sources.`,
  },
];

registerDocBlocks(ecosystemDocBlocks);
