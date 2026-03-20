// Blueprint

// Re-export types for convenience
export type {
	AppBlueprintSpec,
	AppRouteConfig,
	BrandingDefaults,
	FeatureFlagState,
	ResolvedBranding,
	TenantAppConfig,
} from '@contractspec/lib.contracts-spec/app-config';
export { contractspecBlueprint } from './contractspec-blueprint';

// Branding
export {
	contractspecBrandingDefaults,
	contractspecResolvedBranding,
} from './contractspec-branding';
// Routes
export { contractspecRoutes } from './contractspec-routes';
