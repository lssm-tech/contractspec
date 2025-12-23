import { defineCommand, defineQuery } from '@lssm/lib.contracts/operations';
import {
  DealModel,
  CreateDealInputModel,
  MoveDealInputModel,
  DealMovedPayloadModel,
  WinDealInputModel,
  DealWonPayloadModel,
  LoseDealInputModel,
  DealLostPayloadModel,
  ListDealsInputModel,
  ListDealsOutputModel,
} from './deal.schema';

const OWNERS = ['@example.crm-pipeline'] as const;

/**
 * Create a new deal.
 */
export const CreateDealContract = defineCommand({
  meta: {
    name: 'crm.deal.create',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['crm', 'deal', 'create'],
    description: 'Create a new deal in the pipeline.',
    goal: 'Allow sales reps to create new opportunities.',
    context: 'Deal creation UI, quick add.',
  },
  io: {
    input: CreateDealInputModel,
    output: DealModel,
  },
  policy: {
    auth: 'user',
  },
  sideEffects: {
    emits: [
      {
        name: 'deal.created',
        version: 1,
        when: 'Deal is created',
        payload: DealModel,
      },
    ],
    audit: ['deal.created'],
  },
});

/**
 * Move deal to a different stage.
 */
export const MoveDealContract = defineCommand({
  meta: {
    name: 'crm.deal.move',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['crm', 'deal', 'move', 'kanban'],
    description: 'Move a deal to a different stage.',
    goal: 'Allow drag-and-drop stage movement in Kanban.',
    context: 'Pipeline Kanban view.',
  },
  io: {
    input: MoveDealInputModel,
    output: DealModel,
  },
  policy: {
    auth: 'user',
  },
  sideEffects: {
    emits: [
      {
        name: 'deal.moved',
        version: 1,
        when: 'Deal stage changed',
        payload: DealMovedPayloadModel,
      },
    ],
    audit: ['deal.moved'],
  },
});

/**
 * Mark deal as won.
 */
export const WinDealContract = defineCommand({
  meta: {
    name: 'crm.deal.win',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['crm', 'deal', 'won'],
    description: 'Mark a deal as won.',
    goal: 'Close a deal as successful.',
    context: 'Deal closing flow.',
  },
  io: {
    input: WinDealInputModel,
    output: DealModel,
  },
  policy: {
    auth: 'user',
  },
  sideEffects: {
    emits: [
      {
        name: 'deal.won',
        version: 1,
        when: 'Deal is won',
        payload: DealWonPayloadModel,
      },
    ],
    audit: ['deal.won'],
  },
});

/**
 * Mark deal as lost.
 */
export const LoseDealContract = defineCommand({
  meta: {
    name: 'crm.deal.lose',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['crm', 'deal', 'lost'],
    description: 'Mark a deal as lost.',
    goal: 'Close a deal as unsuccessful.',
    context: 'Deal closing flow.',
  },
  io: {
    input: LoseDealInputModel,
    output: DealModel,
  },
  policy: {
    auth: 'user',
  },
  sideEffects: {
    emits: [
      {
        name: 'deal.lost',
        version: 1,
        when: 'Deal is lost',
        payload: DealLostPayloadModel,
      },
    ],
    audit: ['deal.lost'],
  },
});

/**
 * List deals in pipeline.
 */
export const ListDealsContract = defineQuery({
  meta: {
    name: 'crm.deal.list',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['crm', 'deal', 'list'],
    description: 'List deals with filters.',
    goal: 'Show pipeline, deal lists, dashboards.',
    context: 'Pipeline view, deal list.',
  },
  io: {
    input: ListDealsInputModel,
    output: ListDealsOutputModel,
  },
  policy: {
    auth: 'user',
  },
});
