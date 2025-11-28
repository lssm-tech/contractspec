/**
 * React Renderer for Agent List Presentation
 */
import type { PresentationRenderer, PresentationDescriptorV2 } from '@lssm/lib.contracts';
import { AgentListView } from '../views/AgentListView';

/**
 * React renderer for agent-console.agent.list presentation
 */
export const agentListReactRenderer: PresentationRenderer<React.ReactElement> = {
  target: 'react',
  render: async (desc: PresentationDescriptorV2) => {
    if (desc.source.type !== 'component') {
      throw new Error('AgentListRenderer: expected component source');
    }
    if (desc.source.componentKey !== 'AgentListView') {
      throw new Error(`AgentListRenderer: unknown component ${desc.source.componentKey}`);
    }
    return <AgentListView />;
  },
};

