import { describe, expect, it } from 'bun:test';

import { OperationSpecRegistry } from '../operations/registry';
import {
  GetResolvedBrandingQuery,
  registerAppConfigOperations,
  ResolveMessageQuery,
  UpdateBlueprintTranslationCatalogCommand,
  UpdateTenantBrandingCommand,
  UpdateTenantTranslationOverridesCommand,
  VerifyCustomDomainCommand,
} from './contracts';

describe('app-config contracts', () => {
  it('registers branding and translation management contracts', () => {
    const registry = registerAppConfigOperations(new OperationSpecRegistry());

    expect(registry.getSpec('appConfig.updateTenantBranding', 1)).toBe(
      UpdateTenantBrandingCommand
    );

    expect(registry.getSpec('appConfig.verifyCustomDomain', 1)).toBe(
      VerifyCustomDomainCommand
    );

    expect(
      registry.getSpec('appConfig.updateBlueprintTranslationCatalog', 1)
    ).toBe(UpdateBlueprintTranslationCatalogCommand);

    expect(registry.getSpec('appConfig.updateTenantTranslations', 1)).toBe(
      UpdateTenantTranslationOverridesCommand
    );

    expect(registry.getSpec('appConfig.getResolvedBranding', 1)).toBe(
      GetResolvedBrandingQuery
    );

    expect(registry.getSpec('appConfig.resolveMessage', 1)).toBe(
      ResolveMessageQuery
    );
  });
});
