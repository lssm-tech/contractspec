/**
 * Presentation descriptors for crm-pipeline
 */

// Pipeline presentations
export {
  PipelineKanbanPresentation,
  DealListPresentation,
  DealDetailPresentation,
  DealCardPresentation,
} from './pipeline';

// Dashboard presentations
export {
  CrmDashboardPresentation,
  PipelineMetricsPresentation,
} from './dashboard';

// Re-export all presentations as an array
import {
  PipelineKanbanPresentation,
  DealListPresentation,
  DealDetailPresentation,
  DealCardPresentation,
} from './pipeline';
import {
  CrmDashboardPresentation,
  PipelineMetricsPresentation,
} from './dashboard';

export const CrmPipelinePresentations = [
  CrmDashboardPresentation,
  PipelineKanbanPresentation,
  DealListPresentation,
  DealDetailPresentation,
  DealCardPresentation,
  PipelineMetricsPresentation,
];
