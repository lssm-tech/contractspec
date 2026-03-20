/**
 * Mock handlers for crm-pipeline example
 *
 * These handlers provide mock implementations of all contracts
 * for use in demos, tests, and the sandbox environment.
 */

// Runtime handlers (PGLite)
export * from './crm.handlers';

// Deal handlers
export {
	type CreateDealInput,
	type Deal,
	type ListDealsInput,
	type ListDealsOutput,
	type LoseDealInput,
	type MoveDealInput,
	mockCreateDealHandler,
	mockGetDealsByStageHandler,
	mockGetPipelineStagesHandler,
	mockListDealsHandler,
	mockLoseDealHandler,
	mockMoveDealHandler,
	mockWinDealHandler,
	type WinDealInput,
} from './deal.handlers';
// Mock data
export * from './mock-data';
