/**
 * SaaS Boilerplate Presentations - re-exports from domain modules for backward compatibility.
 */

// Billing presentations
export {
  SubscriptionPresentation,
  UsageDashboardPresentation,
} from '../billing/billing.presentation';

// Project presentations
export {
  ProjectListPresentation,
  ProjectDetailPresentation,
} from '../project/project.presentation';

// Dashboard presentations
export {
  SaasDashboardPresentation,
  SettingsPanelPresentation,
} from '../dashboard/dashboard.presentation';

// All presentations collection
export const SaasBoilerplatePresentations = {
  // Billing
  SubscriptionPresentation: undefined,
  UsageDashboardPresentation: undefined,

  // Project
  ProjectListPresentation: undefined,
  ProjectDetailPresentation: undefined,

  // Dashboard
  SaasDashboardPresentation: undefined,
  SettingsPanelPresentation: undefined,
};


