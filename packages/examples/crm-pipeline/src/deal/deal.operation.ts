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
    key: 'crm.deal.create',
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
        key: 'deal.created',
        version: 1,
        when: 'Deal is created',
        payload: DealModel,
      },
    ],
    audit: ['deal.created'],
  },
  acceptance: {
    scenarios: [
      {
        key: 'create-deal-happy-path',
        given: ['User is authenticated'],
        when: ['User creates a deal with valid data'],
        then: ['Deal is created', 'DealCreated event is emitted'],
      },
    ],
    examples: [
      {
        key: 'create-basic-deal',
        input: {
          title: 'Big Corp Q3 License',
          stageId: 'stage-lead',
          value: 50000,
          companyId: 'comp-123',
        },
        output: {
          id: 'deal-789',
          title: 'Big Corp Q3 License',
          status: 'open',
        },
      },
    ],
  },
});

/**
 * Move deal to a different stage.
 */
export const MoveDealContract = defineCommand({
  meta: {
    key: 'crm.deal.move',
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
        key: 'deal.moved',
        version: 1,
        when: 'Deal stage changed',
        payload: DealMovedPayloadModel,
      },
    ],
    audit: ['deal.moved'],
  },
  acceptance: {
    scenarios: [
      {
        key: 'move-deal-happy-path',
        given: ['Deal exists in stage A'],
        when: ['User moves deal to stage B'],
        then: ['Deal stage is updated', 'DealMoved event is emitted'],
      },
    ],
    examples: [
      {
        key: 'move-to-negotiation',
        input: { dealId: 'deal-789', targetStageId: 'stage-negotiation' },
        output: {
          id: 'deal-789',
          stageId: 'stage-negotiation',
          movedAt: '2025-01-15T10:00:00Z',
        },
      },
    ],
  },
});

/**
 * Mark deal as won.
 */
export const WinDealContract = defineCommand({
  meta: {
    key: 'crm.deal.win',
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
        key: 'deal.won',
        version: 1,
        when: 'Deal is won',
        payload: DealWonPayloadModel,
      },
    ],
    audit: ['deal.won'],
  },
  acceptance: {
    scenarios: [
      {
        key: 'win-deal-happy-path',
        given: ['Deal is open'],
        when: ['User marks deal as won'],
        then: ['Deal status becomes WON', 'DealWon event is emitted'],
      },
    ],
    examples: [
      {
        key: 'mark-won',
        input: {
          dealId: 'deal-789',
          actualValue: 52000,
          note: 'Signed contract attached',
        },
        output: {
          id: 'deal-789',
          status: 'won',
          closedAt: '2025-01-20T14:30:00Z',
        },
      },
    ],
  },
});

/**
 * Mark deal as lost.
 */
export const LoseDealContract = defineCommand({
  meta: {
    key: 'crm.deal.lose',
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
        key: 'deal.lost',
        version: 1,
        when: 'Deal is lost',
        payload: DealLostPayloadModel,
      },
    ],
    audit: ['deal.lost'],
  },
  acceptance: {
    scenarios: [
      {
        key: 'lose-deal-happy-path',
        given: ['Deal is open'],
        when: ['User marks deal as lost'],
        then: ['Deal status becomes LOST', 'DealLost event is emitted'],
      },
    ],
    examples: [
      {
        key: 'mark-lost',
        input: {
          dealId: 'deal-789',
          reason: 'competitor',
          note: 'Went with cheaper option',
        },
        output: {
          id: 'deal-789',
          status: 'lost',
          closedAt: '2025-01-21T09:00:00Z',
        },
      },
    ],
  },
});

/**
 * List deals in pipeline.
 */
export const ListDealsContract = defineQuery({
  meta: {
    key: 'crm.deal.list',
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
  acceptance: {
    scenarios: [
      {
        key: 'list-deals-happy-path',
        given: ['User has access to deals'],
        when: ['User lists deals'],
        then: ['List of deals is returned'],
      },
    ],
    examples: [
      {
        key: 'list-filter-stage',
        input: { stageId: 'stage-lead', limit: 20 },
        output: { items: [], total: 5, hasMore: false },
      },
    ],
  },
});
