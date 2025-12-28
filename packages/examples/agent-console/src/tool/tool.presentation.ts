import type { PresentationSpec } from '@contractspec/lib.contracts';
import { StabilityEnum } from '@contractspec/lib.contracts';
import { ToolSummaryModel } from './tool.schema';

/**
 * Presentation for displaying a list of tools.
 */
export const ToolListPresentation: PresentationSpec = {
  meta: {
    key: 'agent-console.tool.list',
    version: 1,
    title: 'Tool List',
    description:
      'List view of AI tools with category, status, and version info',
    goal: 'Provide an overview of all available tools for agents.',
    context: 'Tool management dashboard.',
    domain: 'agent-console',
    owners: ['@agent-console-team'],
    tags: ['tool', 'list', 'dashboard'],
    stability: StabilityEnum.Experimental,
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
export const ToolDetailPresentation: PresentationSpec = {
  meta: {
    key: 'agent-console.tool.detail',
    version: 1,
    title: 'Tool Details',
    description:
      'Detailed view of an AI tool with configuration and test panel',
    goal: 'Allow users to inspect and test a specific tool.',
    context: 'Detailed view of a tool.',
    domain: 'agent-console',
    owners: ['@agent-console-team'],
    tags: ['tool', 'detail'],
    stability: StabilityEnum.Experimental,
  },
  source: {
    type: 'component',
    framework: 'react',
    componentKey: 'ToolDetailView',
  },
  targets: ['react', 'markdown'],
  policy: { flags: ['agent-console.enabled'] },
};
