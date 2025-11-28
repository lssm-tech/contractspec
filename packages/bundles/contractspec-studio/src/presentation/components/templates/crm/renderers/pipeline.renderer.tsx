/**
 * React renderer for CRM Pipeline presentation
 *
 * Renders the CRM pipeline board component.
 * Data is fetched via the CrmPipelineBoard component's internal hooks.
 */
import * as React from 'react';
import type { PresentationRenderer } from '@lssm/lib.contracts';
import { CrmPipelineBoard } from '../CrmPipelineBoard';
import { useDealList } from '../hooks/useDealList';

/**
 * Wrapper component that provides data to CrmPipelineBoard
 */
function CrmPipelineBoardWrapper() {
  const { dealsByStage, stages } = useDealList();
  return <CrmPipelineBoard dealsByStage={dealsByStage} stages={stages} />;
}

export const crmPipelineReactRenderer: PresentationRenderer<React.ReactElement> =
  {
    target: 'react',
    render: async (desc, ctx) => {
      if (desc.source.type !== 'component') {
        throw new Error('Invalid source type');
      }

      if (desc.source.componentKey !== 'CrmPipelineView') {
        throw new Error(`Unknown component: ${desc.source.componentKey}`);
      }

      // Note: The wrapper component will fetch data internally
      return <CrmPipelineBoardWrapper />;
    },
  };
