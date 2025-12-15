/**
 * Billing domain - subscription, usage tracking, and feature access.
 */

// Enums
export {
  SubscriptionStatusSchemaEnum,
  FeatureAccessReasonEnum,
} from './billing.enum';

// Schema models
export {
  SubscriptionModel,
  UsageSummaryModel,
  RecordUsageInputModel,
  RecordUsageOutputModel,
  UsageRecordedPayloadModel,
  GetUsageSummaryInputModel,
  GetUsageSummaryOutputModel,
  CheckFeatureAccessInputModel,
  CheckFeatureAccessOutputModel,
} from './billing.schema';

// Contracts
export {
  GetSubscriptionContract,
  RecordUsageContract,
  GetUsageSummaryContract,
  CheckFeatureAccessContract,
} from './billing.contracts';

// Events
export {
  UsageRecordedEvent,
  UsageLimitReachedEvent,
  SubscriptionChangedEvent,
} from './billing.event';

// Entities
export {
  SubscriptionStatusEnum,
  SubscriptionEntity,
  BillingUsageEntity,
  UsageLimitEntity,
} from './billing.entity';

// Presentations
export {
  SubscriptionPresentation,
  UsageDashboardPresentation,
} from './billing.presentation';

// Handlers
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
} from './billing.handler';

