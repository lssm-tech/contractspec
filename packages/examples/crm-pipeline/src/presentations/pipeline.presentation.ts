/**
 * Pipeline Presentation Descriptors
 */
import type { PresentationDescriptorV2 } from '@lssm/lib.contracts';
import { DealModel } from '../contracts/deal.contracts';

/**
 * Kanban board presentation for the sales pipeline.
 */
export const PipelineKanbanPresentation: PresentationDescriptorV2 = {
  meta: {
    name: 'crm.pipeline.kanban',
    version: 1,
    description: 'Kanban board view of deals organized by stage',
    domain: 'crm-pipeline',
    owners: ['crm-team'],
    tags: ['pipeline', 'kanban', 'deals'],
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
export const DealListPresentation: PresentationDescriptorV2 = {
  meta: {
    name: 'crm.deal.list',
    version: 1,
    description: 'List view of deals with value, status, and owner info',
    domain: 'crm-pipeline',
    owners: ['crm-team'],
    tags: ['deal', 'list'],
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
export const DealDetailPresentation: PresentationDescriptorV2 = {
  meta: {
    name: 'crm.deal.detail',
    version: 1,
    description:
      'Detailed view of a deal with activities, contacts, and history',
    domain: 'crm-pipeline',
    owners: ['crm-team'],
    tags: ['deal', 'detail'],
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
export const DealCardPresentation: PresentationDescriptorV2 = {
  meta: {
    name: 'crm.deal.card',
    version: 1,
    description: 'Compact deal card for kanban board display',
    domain: 'crm-pipeline',
    owners: ['crm-team'],
    tags: ['deal', 'card', 'kanban'],
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
