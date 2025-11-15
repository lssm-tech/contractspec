import { describe, expect, it } from 'vitest';

import { SpecRegistry } from '../registry';
import {
  GetResolvedBrandingQuery,
  ResolveMessageQuery,
  UpdateBlueprintTranslationCatalogCommand,
  UpdateTenantBrandingCommand,
  UpdateTenantTranslationOverridesCommand,
  VerifyCustomDomainCommand,
  registerAppConfigContracts,
} from './contracts';

describe('app-config contracts', () => {
  it('registers branding and translation management contracts', () => {
    const registry = registerAppConfigContracts(new SpecRegistry());

    expect(
      registry.getSpec('appConfig.updateTenantBranding', 1)
    ).toBe(UpdateTenantBrandingCommand);

    expect(
      registry.getSpec('appConfig.verifyCustomDomain', 1)
    ).toBe(VerifyCustomDomainCommand);

    expect(
      registry.getSpec('appConfig.updateBlueprintTranslationCatalog', 1)
    ).toBe(UpdateBlueprintTranslationCatalogCommand);

    expect(
      registry.getSpec('appConfig.updateTenantTranslations', 1)
    ).toBe(UpdateTenantTranslationOverridesCommand);

    expect(
      registry.getSpec('appConfig.getResolvedBranding', 1)
    ).toBe(GetResolvedBrandingQuery);

    expect(
      registry.getSpec('appConfig.resolveMessage', 1)
    ).toBe(ResolveMessageQuery);
  });
});





