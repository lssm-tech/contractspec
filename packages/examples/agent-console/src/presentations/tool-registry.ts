/**
 * Tool Registry Presentation Descriptor
 */
import type { PresentationDescriptorV2 } from '@lssm/lib.contracts';
import { ToolSummaryModel } from '../contracts/tool';

/**
 * Presentation for displaying the tool registry.
 */
export const ToolRegistryPresentation: PresentationDescriptorV2 = {
  meta: {
    name: 'agent-console.tool.registry',
    version: 1,
    description: 'Registry of available tools organized by category',
    domain: 'agent-console',
    owners: ['agent-console-team'],
    tags: ['tool', 'registry', 'list'],
  },
  source: {
    type: 'component',
    framework: 'react',
    componentKey: 'ToolRegistryView',
    props: ToolSummaryModel,
  },
  targets: ['react', 'markdown', 'application/json'],
  policy: {
    flags: ['agent-console.enabled'],
  },
};

/**
 * Presentation for tool detail view.
 */
export const ToolDetailPresentation: PresentationDescriptorV2 = {
  meta: {
    name: 'agent-console.tool.detail',
    version: 1,
    description: 'Detailed view of a tool with schema and configuration',
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
  policy: {
    flags: ['agent-console.enabled'],
  },
};
