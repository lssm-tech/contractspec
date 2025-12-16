/**
 * SaaS Boilerplate Handlers - re-exports from domain modules for backward compatibility.
 */

// Billing handlers
export {
  mockGetSubscriptionHandler,
  mockRecordUsageHandler,
  mockGetUsageSummaryHandler,
  mockCheckFeatureAccessHandler,
} from '../billing/billing.handler';

// Project handlers
export {
  mockCreateProjectHandler,
  mockGetProjectHandler,
  mockListProjectsHandler,
  mockUpdateProjectHandler,
  mockDeleteProjectHandler,
} from '../project/project.handler';


