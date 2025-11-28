/**
 * Mock handlers for Deal contracts
 */
import { MOCK_DEALS, MOCK_STAGES } from './mock-data';

// Types inferred from contract schemas
export interface Deal {
  id: string;
  name: string;
  value: number;
  currency: string;
  pipelineId: string;
  stageId: string;
  status: 'OPEN' | 'WON' | 'LOST' | 'STALE';
  contactId?: string;
  companyId?: string;
  ownerId: string;
  expectedCloseDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateDealInput {
  name: string;
  value: number;
  currency?: string;
  pipelineId: string;
  stageId: string;
  contactId?: string;
  companyId?: string;
  expectedCloseDate?: Date;
}

export interface MoveDealInput {
  dealId: string;
  stageId: string;
  position?: number;
}

export interface WinDealInput {
  dealId: string;
  wonSource?: string;
  notes?: string;
}

export interface LoseDealInput {
  dealId: string;
  lostReason: string;
  notes?: string;
}

export interface ListDealsInput {
  pipelineId?: string;
  stageId?: string;
  status?: 'OPEN' | 'WON' | 'LOST' | 'all';
  ownerId?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

export interface ListDealsOutput {
  deals: Deal[];
  total: number;
  totalValue: number;
}

/**
 * Mock handler for ListDealsContract
 */
export async function mockListDealsHandler(
  input: ListDealsInput
): Promise<ListDealsOutput> {
  const {
    pipelineId,
    stageId,
    status,
    ownerId,
    search,
    limit = 20,
    offset = 0,
  } = input;

  let filtered = [...MOCK_DEALS];

  if (pipelineId) {
    filtered = filtered.filter((d) => d.pipelineId === pipelineId);
  }

  if (stageId) {
    filtered = filtered.filter((d) => d.stageId === stageId);
  }

  if (status && status !== 'all') {
    filtered = filtered.filter((d) => d.status === status);
  }

  if (ownerId) {
    filtered = filtered.filter((d) => d.ownerId === ownerId);
  }

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter((d) => d.name.toLowerCase().includes(q));
  }

  // Sort by value descending
  filtered.sort((a, b) => b.value - a.value);

  const total = filtered.length;
  const totalValue = filtered.reduce((sum, d) => sum + d.value, 0);
  const deals = filtered.slice(offset, offset + limit);

  return {
    deals,
    total,
    totalValue,
  };
}

/**
 * Mock handler for CreateDealContract
 */
export async function mockCreateDealHandler(
  input: CreateDealInput,
  context: { ownerId: string }
): Promise<Deal> {
  const now = new Date();

  const deal: Deal = {
    id: `deal-${Date.now()}`,
    name: input.name,
    value: input.value,
    currency: input.currency ?? 'USD',
    pipelineId: input.pipelineId,
    stageId: input.stageId,
    status: 'OPEN',
    contactId: input.contactId,
    companyId: input.companyId,
    ownerId: context.ownerId,
    expectedCloseDate: input.expectedCloseDate,
    createdAt: now,
    updatedAt: now,
  };

  MOCK_DEALS.push(deal);

  return deal;
}

/**
 * Mock handler for MoveDealContract
 */
export async function mockMoveDealHandler(input: MoveDealInput): Promise<Deal> {
  const dealIndex = MOCK_DEALS.findIndex((d) => d.id === input.dealId);
  if (dealIndex === -1) {
    throw new Error('NOT_FOUND');
  }
  const deal = MOCK_DEALS[dealIndex]!;

  const stage = MOCK_STAGES.find((s) => s.id === input.stageId);
  if (!stage) {
    throw new Error('INVALID_STAGE');
  }

  const updatedDeal: Deal = {
    ...deal,
    stageId: input.stageId,
    updatedAt: new Date(),
  };

  MOCK_DEALS[dealIndex] = updatedDeal;

  return updatedDeal;
}

/**
 * Mock handler for WinDealContract
 */
export async function mockWinDealHandler(input: WinDealInput): Promise<Deal> {
  const dealIndex = MOCK_DEALS.findIndex((d) => d.id === input.dealId);
  if (dealIndex === -1) {
    throw new Error('NOT_FOUND');
  }
  const deal = MOCK_DEALS[dealIndex]!;
  if (!deal) {
    throw new Error('NOT_FOUND');
  }

  const updatedDeal: Deal = {
    ...deal,
    status: 'WON' as const,
    updatedAt: new Date(),
  };

  MOCK_DEALS[dealIndex] = updatedDeal;

  return updatedDeal;
}

/**
 * Mock handler for LoseDealContract
 */
export async function mockLoseDealHandler(input: LoseDealInput): Promise<Deal> {
  const dealIndex = MOCK_DEALS.findIndex((d) => d.id === input.dealId);
  if (dealIndex === -1) {
    throw new Error('NOT_FOUND');
  }
  const deal = MOCK_DEALS[dealIndex]!;

  const updatedDeal: Deal = {
    ...deal,
    status: 'LOST' as const,
    updatedAt: new Date(),
  };

  MOCK_DEALS[dealIndex] = updatedDeal;

  return updatedDeal;
}

/**
 * Get deals grouped by stage for Kanban view
 */
export async function mockGetDealsByStageHandler(input: {
  pipelineId: string;
}): Promise<Record<string, Deal[]>> {
  const deals = MOCK_DEALS.filter(
    (d) => d.pipelineId === input.pipelineId && d.status === 'OPEN'
  );

  const grouped: Record<string, Deal[]> = {};
  for (const stage of MOCK_STAGES) {
    grouped[stage.id] = deals.filter((d) => d.stageId === stage.id);
  }

  return grouped;
}

/**
 * Get pipeline stages
 */
export async function mockGetPipelineStagesHandler(input: {
  pipelineId: string;
}) {
  return MOCK_STAGES.filter((s) => s.pipelineId === input.pipelineId);
}
