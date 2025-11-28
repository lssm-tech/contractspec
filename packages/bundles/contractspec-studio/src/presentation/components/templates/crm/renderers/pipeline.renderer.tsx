/**
 * React renderer for CRM Pipeline presentation
 */
import type { PresentationRenderer } from '@lssm/lib.contracts';
import { CrmPipelineBoard } from '../CrmPipelineBoard';
import { mockGetDealsByStageHandler, mockGetPipelineStagesHandler } from '@lssm/example.crm-pipeline/handlers';

export const crmPipelineReactRenderer: PresentationRenderer<JSX.Element> = {
  target: 'react',
  render: async (desc, ctx) => {
    if (desc.source.type !== 'component') {
      throw new Error('Invalid source type');
    }

    if (desc.source.componentKey !== 'CrmPipelineView') {
      throw new Error(`Unknown component: ${desc.source.componentKey}`);
    }

    // Fetch data
    const pipelineId = 'pipeline-1';
    const [dealsByStage, stages] = await Promise.all([
      mockGetDealsByStageHandler({ pipelineId }),
      mockGetPipelineStagesHandler({ pipelineId }),
    ]);

    return <CrmPipelineBoard dealsByStage={dealsByStage} stages={stages} />;
  },
};

