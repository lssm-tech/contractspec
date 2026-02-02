/**
 * Pipeline Presentation Descriptors
 */
import { definePresentation, StabilityEnum } from '@contractspec/lib.contracts';
import { DealModel } from '../deal/deal.schema';

/**
 * Kanban board presentation for the sales pipeline.
 */
export const PipelineKanbanPresentation = definePresentation({
  meta: {
    key: 'crm.pipeline.kanban',
    version: '1.0.0',
    title: 'Pipeline Kanban',
    description: 'Kanban board view of deals organized by stage',
    domain: 'crm-pipeline',
    owners: ['@crm-team'],
    tags: ['pipeline', 'kanban', 'deals'],
    stability: StabilityEnum.Experimental,
    goal: 'Visualize the sales pipeline status and deal distribution across stages.',
    context: 'Used in the sales dashboard and management reports.',
  },
  source: {
    type: 'component',
    framework: 'react',
    componentKey: 'PipelineKanbanView',
    props: DealModel,
  },
  targets: ['react', 'markdown'],
  policy: {
    flags: ['crm.pipeline.enabled'],
  },
});

/**
 * List view of deals with filtering.
 */
export const DealListPresentation = definePresentation({
  meta: {
    key: 'crm.deal.viewList',
    version: '1.0.0',
    title: 'Deal List',
    description: 'List view of deals with value, status, and owner info',
    domain: 'crm-pipeline',
    owners: ['@crm-team'],
    tags: ['deal', 'list'],
    stability: StabilityEnum.Experimental,
    goal: 'Search, filter, and review deal lists.',
    context: 'Standard view for deal management and bulk actions.',
  },
  source: {
    type: 'component',
    framework: 'react',
    componentKey: 'DealListView',
    props: DealModel,
  },
  targets: ['react', 'markdown', 'application/json'],
  policy: {
    flags: ['crm.deals.enabled'],
  },
});

/**
 * Deal detail presentation.
 */
export const DealDetailPresentation = definePresentation({
  meta: {
    key: 'crm.deal.detail',
    version: '1.0.0',
    title: 'Deal Details',
    description:
      'Detailed view of a deal with activities, contacts, and history',
    domain: 'crm-pipeline',
    owners: ['@crm-team'],
    tags: ['deal', 'detail'],
    stability: StabilityEnum.Experimental,
    goal: 'Deep dive into deal details and historical activities.',
    context: 'The main workspace for managing a single deal execution.',
  },
  source: {
    type: 'component',
    framework: 'react',
    componentKey: 'DealDetailView',
  },
  targets: ['react', 'markdown'],
  policy: {
    flags: ['crm.deals.enabled'],
  },
});

/**
 * Deal card for kanban board.
 */
export const DealCardPresentation = definePresentation({
  meta: {
    key: 'crm.deal.card',
    version: '1.0.0',
    title: 'Deal Card',
    description: 'Compact deal card for kanban board display',
    domain: 'crm-pipeline',
    owners: ['@crm-team'],
    tags: ['deal', 'card', 'kanban'],
    stability: StabilityEnum.Experimental,
    goal: 'Provide a quick overview of deal status in the pipeline view.',
    context: 'Condensed representation used within the Pipeline Kanban board.',
  },
  source: {
    type: 'component',
    framework: 'react',
    componentKey: 'DealCard',
    props: DealModel,
  },
  targets: ['react'],
  policy: {
    flags: ['crm.deals.enabled'],
  },
});
