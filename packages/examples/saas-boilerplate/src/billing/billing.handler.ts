/**
 * Mock handlers for Billing contracts.
 */
import { MOCK_SUBSCRIPTION, MOCK_USAGE_SUMMARY } from '../shared/mock-data';

// Types inferred from contract schemas
export interface Subscription {
  id: string;
  organizationId: string;
  planId: string;
  planName: string;
  status: 'ACTIVE' | 'TRIALING' | 'PAST_DUE' | 'CANCELED' | 'UNPAID';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  limits: {
    projects: number;
    users: number;
    storage: number;
    apiCalls: number;
  };
  usage: {
    projects: number;
    users: number;
    storage: number;
    apiCalls: number;
  };
}

export interface UsageSummary {
  organizationId: string;
  period: string;
  apiCalls: {
    total: number;
    limit: number;
    percentUsed: number;
  };
  storage: {
    totalGb: number;
    limitGb: number;
    percentUsed: number;
  };
  activeProjects: number;
  activeUsers: number;
  breakdown: {
    date: string;
    apiCalls: number;
    storageGb: number;
  }[];
}

export interface RecordUsageInput {
  metric: string;
  quantity: number;
  timestamp?: Date;
  metadata?: Record<string, unknown>;
}

export interface CheckFeatureAccessInput {
  feature: string;
}

export interface CheckFeatureAccessOutput {
  allowed: boolean;
  reason?:
    | 'PLAN_LIMIT'
    | 'FEATURE_NOT_INCLUDED'
    | 'QUOTA_EXCEEDED'
    | 'SUBSCRIPTION_INACTIVE';
  currentUsage?: number;
  limit?: number;
}

/**
 * Mock handler for GetSubscriptionContract.
 */
export async function mockGetSubscriptionHandler(): Promise<Subscription> {
  return MOCK_SUBSCRIPTION;
}

/**
 * Mock handler for GetUsageSummaryContract.
 */
export async function mockGetUsageSummaryHandler(input: {
  period?: string;
}): Promise<UsageSummary> {
  return {
    ...MOCK_USAGE_SUMMARY,
    period: input.period ?? 'current_month',
  };
}

/**
 * Mock handler for RecordUsageContract.
 */
export async function mockRecordUsageHandler(
  input: RecordUsageInput
): Promise<{ recorded: boolean; newTotal: number }> {
  const currentUsage = MOCK_USAGE_SUMMARY.apiCalls.total;
  const newTotal = currentUsage + input.quantity;

  return {
    recorded: true,
    newTotal,
  };
}

/**
 * Mock handler for CheckFeatureAccessContract.
 */
export async function mockCheckFeatureAccessHandler(
  input: CheckFeatureAccessInput
): Promise<CheckFeatureAccessOutput> {
  const { feature } = input;

  const featureMap: Record<string, CheckFeatureAccessOutput> = {
    custom_domains: {
      allowed: true,
    },
    api_access: {
      allowed: true,
      currentUsage: MOCK_USAGE_SUMMARY.apiCalls.total,
      limit: MOCK_USAGE_SUMMARY.apiCalls.limit,
    },
    advanced_analytics: {
      allowed: false,
      reason: 'FEATURE_NOT_INCLUDED',
    },
    unlimited_projects: {
      allowed: false,
      reason: 'PLAN_LIMIT',
      currentUsage: MOCK_SUBSCRIPTION.usage.projects,
      limit: MOCK_SUBSCRIPTION.limits.projects,
    },
  };

  return featureMap[feature] ?? { allowed: true };
}

