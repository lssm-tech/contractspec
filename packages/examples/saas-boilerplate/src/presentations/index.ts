/**
 * Presentation descriptors for saas-boilerplate
 */

// Project presentations
export {
  ProjectListPresentation,
  ProjectDetailPresentation,
} from './project-list';

// Billing presentations
export {
  SubscriptionPresentation,
  UsageDashboardPresentation,
} from './billing';

// Dashboard presentations
export {
  SaasDashboardPresentation,
  SettingsPanelPresentation,
} from './dashboard';

// Re-export all presentations as an array
import {
  ProjectListPresentation,
  ProjectDetailPresentation,
} from './project-list';
import {
  SubscriptionPresentation,
  UsageDashboardPresentation,
} from './billing';
import {
  SaasDashboardPresentation,
  SettingsPanelPresentation,
} from './dashboard';

export const SaasBoilerplatePresentations = [
  SaasDashboardPresentation,
  ProjectListPresentation,
  ProjectDetailPresentation,
  SubscriptionPresentation,
  UsageDashboardPresentation,
  SettingsPanelPresentation,
];
