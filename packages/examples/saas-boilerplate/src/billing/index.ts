/**
 * Billing domain - subscription, usage tracking, and feature access.
 */

// Entities
export {
	BillingUsageEntity,
	SubscriptionEntity,
	SubscriptionStatusEnum,
	UsageLimitEntity,
} from './billing.entity';
// Enums
export {
	FeatureAccessReasonEnum,
	SubscriptionStatusSchemaEnum,
} from './billing.enum';
// Events
export {
	SubscriptionChangedEvent,
	UsageLimitReachedEvent,
	UsageRecordedEvent,
} from './billing.event';
// Handlers
export {
	type CheckFeatureAccessInput,
	type CheckFeatureAccessOutput,
	mockCheckFeatureAccessHandler,
	mockGetSubscriptionHandler,
	mockGetUsageSummaryHandler,
	mockRecordUsageHandler,
	type RecordUsageInput,
	type Subscription,
	type UsageSummary,
} from './billing.handler';
// Contracts
export {
	CheckFeatureAccessContract,
	GetSubscriptionContract,
	GetUsageSummaryContract,
	RecordUsageContract,
} from './billing.operations';

// Presentations
export {
	SubscriptionPresentation,
	UsageDashboardPresentation,
} from './billing.presentation';
// Schema models
export {
	CheckFeatureAccessInputModel,
	CheckFeatureAccessOutputModel,
	GetUsageSummaryInputModel,
	GetUsageSummaryOutputModel,
	RecordUsageInputModel,
	RecordUsageOutputModel,
	SubscriptionModel,
	UsageRecordedPayloadModel,
	UsageSummaryModel,
} from './billing.schema';
