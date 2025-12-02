/**
 * Mock handlers for saas-boilerplate example
 *
 * These handlers provide mock implementations of all contracts
 * for use in demos, tests, and the sandbox environment.
 */

// Mock data
export * from './mock-data';

// Project handlers
export {
  mockListProjectsHandler,
  mockGetProjectHandler,
  mockCreateProjectHandler,
  mockUpdateProjectHandler,
  mockDeleteProjectHandler,
  type Project,
  type CreateProjectInput,
  type UpdateProjectInput,
  type ListProjectsInput,
  type ListProjectsOutput,
} from './project.handlers';

// Billing handlers
export {
  mockGetSubscriptionHandler,
  mockGetUsageSummaryHandler,
  mockRecordUsageHandler,
  mockCheckFeatureAccessHandler,
  type Subscription,
  type UsageSummary,
  type RecordUsageInput,
  type CheckFeatureAccessInput,
  type CheckFeatureAccessOutput,
} from './billing.handlers';
