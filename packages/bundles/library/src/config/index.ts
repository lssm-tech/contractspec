// Blueprint
export { contractspecBlueprint } from './contractspec-blueprint';

// Routes
export { contractspecRoutes } from './contractspec-routes';

// Branding
export {
  contractspecBrandingDefaults,
  contractspecResolvedBranding,
} from './contractspec-branding';

// Re-export types for convenience
export type {
  AppBlueprintSpec,
  TenantAppConfig,
  ResolvedBranding,
  AppRouteConfig,
  BrandingDefaults,
  FeatureFlagState,
} from '@contractspec/lib.contracts/app-config';
