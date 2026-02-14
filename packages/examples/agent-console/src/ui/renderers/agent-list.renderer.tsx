/**
 * React Renderer for Agent List Presentation
 */
import type { PresentationSpec } from '@contractspec/lib.contracts/presentations';
import type { PresentationRenderer } from '@contractspec/lib.contracts/presentations/transform-engine';
import { AgentListView } from '../views/AgentListView';

/**
 * React renderer for agent-console.agent.list presentation
 */
export const agentListReactRenderer: PresentationRenderer<React.ReactElement> =
  {
    target: 'react',
    render: async (desc: PresentationSpec) => {
      if (desc.source.type !== 'component') {
        throw new Error('AgentListRenderer: expected component source');
      }
      if (desc.source.componentKey !== 'AgentListView') {
        throw new Error(
          `AgentListRenderer: unknown component ${desc.source.componentKey}`
        );
      }
      return <AgentListView />;
    },
  };
