/**
 * Pipeline Presentation Descriptors
 */
import type { PresentationSpec } from '@lssm/lib.contracts';
import { StabilityEnum } from '@lssm/lib.contracts';
import { DealModel } from '../deal/deal.schema';

/**
 * Kanban board presentation for the sales pipeline.
 */
export const PipelineKanbanPresentation: PresentationSpec = {
  meta: {
    name: 'crm.pipeline.kanban',
    version: 1,
    title: 'Pipeline Kanban',
    description: 'Kanban board view of deals organized by stage',
    domain: 'crm-pipeline',
    owners: ['@crm-team'],
    tags: ['pipeline', 'kanban', 'deals'],
    stability: StabilityEnum.Experimental,
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
};

/**
 * List view of deals with filtering.
 */
export const DealListPresentation: PresentationSpec = {
  meta: {
    name: 'crm.deal.list',
    version: 1,
    title: 'Deal List',
    description: 'List view of deals with value, status, and owner info',
    domain: 'crm-pipeline',
    owners: ['@crm-team'],
    tags: ['deal', 'list'],
    stability: StabilityEnum.Experimental,
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
};

/**
 * Deal detail presentation.
 */
export const DealDetailPresentation: PresentationSpec = {
  meta: {
    name: 'crm.deal.detail',
    version: 1,
    title: 'Deal Details',
    description:
      'Detailed view of a deal with activities, contacts, and history',
    domain: 'crm-pipeline',
    owners: ['@crm-team'],
    tags: ['deal', 'detail'],
    stability: StabilityEnum.Experimental,
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
};

/**
 * Deal card for kanban board.
 */
export const DealCardPresentation: PresentationSpec = {
  meta: {
    name: 'crm.deal.card',
    version: 1,
    title: 'Deal Card',
    description: 'Compact deal card for kanban board display',
    domain: 'crm-pipeline',
    owners: ['@crm-team'],
    tags: ['deal', 'card', 'kanban'],
    stability: StabilityEnum.Experimental,
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
};
