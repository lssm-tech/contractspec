/**
 * SaaS Boilerplate Presentations - re-exports from domain modules for backward compatibility.
 */

// Billing presentations
export {
	SubscriptionPresentation,
	UsageDashboardPresentation,
} from '../billing/billing.presentation';
// Dashboard presentations
export {
	SaasDashboardPresentation,
	SettingsPanelPresentation,
} from '../dashboard/dashboard.presentation';
// Project presentations
export {
	ProjectDetailPresentation,
	ProjectListPresentation,
} from '../project/project.presentation';

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
