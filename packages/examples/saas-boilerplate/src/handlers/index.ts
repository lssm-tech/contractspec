/**
 * SaaS Boilerplate Handlers - re-exports from domain modules for backward compatibility.
 */

// Billing handlers
export {
	mockCheckFeatureAccessHandler,
	mockGetSubscriptionHandler,
	mockGetUsageSummaryHandler,
	mockRecordUsageHandler,
} from '../billing/billing.handler';

// Project handlers
export {
	mockCreateProjectHandler,
	mockDeleteProjectHandler,
	mockGetProjectHandler,
	mockListProjectsHandler,
	mockUpdateProjectHandler,
} from '../project/project.handler';

// Runtime handlers (PGLite)
export * from './saas.handlers';
