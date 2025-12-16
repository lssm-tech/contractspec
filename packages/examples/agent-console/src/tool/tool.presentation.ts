import type { PresentationDescriptorV2 } from '@lssm/lib.contracts';
import { ToolSummaryModel } from './tool.schema';

/**
 * Presentation for displaying a list of tools.
 */
export const ToolListPresentation: PresentationDescriptorV2 = {
  meta: {
    name: 'agent-console.tool.list',
    version: 1,
    description: 'List view of AI tools with category, status, and version info',
    domain: 'agent-console',
    owners: ['agent-console-team'],
    tags: ['tool', 'list', 'dashboard'],
  },
  source: {
    type: 'component',
    framework: 'react',
    componentKey: 'ToolListView',
    props: ToolSummaryModel,
  },
  targets: ['react', 'markdown', 'application/json'],
  policy: { flags: ['agent-console.enabled'] },
};

/**
 * Presentation for tool detail view.
 */
export const ToolDetailPresentation: PresentationDescriptorV2 = {
  meta: {
    name: 'agent-console.tool.detail',
    version: 1,
    description: 'Detailed view of an AI tool with configuration and test panel',
    domain: 'agent-console',
    owners: ['agent-console-team'],
    tags: ['tool', 'detail'],
  },
  source: {
    type: 'component',
    framework: 'react',
    componentKey: 'ToolDetailView',
  },
  targets: ['react', 'markdown'],
  policy: { flags: ['agent-console.enabled'] },
};


