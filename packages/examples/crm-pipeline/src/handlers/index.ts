/**
 * Mock handlers for crm-pipeline example
 *
 * These handlers provide mock implementations of all contracts
 * for use in demos, tests, and the sandbox environment.
 */

// Mock data
export * from './mock-data';

// Deal handlers
export {
  mockListDealsHandler,
  mockCreateDealHandler,
  mockMoveDealHandler,
  mockWinDealHandler,
  mockLoseDealHandler,
  mockGetDealsByStageHandler,
  mockGetPipelineStagesHandler,
  type Deal,
  type CreateDealInput,
  type MoveDealInput,
  type WinDealInput,
  type LoseDealInput,
  type ListDealsInput,
  type ListDealsOutput,
} from './deal.handlers';

