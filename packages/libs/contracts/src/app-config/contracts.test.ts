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

    expect(registry.get('appConfig.updateTenantBranding', '1.0.0')).toBe(
      UpdateTenantBrandingCommand
    );

    expect(registry.get('appConfig.verifyCustomDomain', '1.0.0')).toBe(
      VerifyCustomDomainCommand
    );

    expect(
      registry.get('appConfig.updateBlueprintTranslationCatalog', '1.0.0')
    ).toBe(UpdateBlueprintTranslationCatalogCommand);

    expect(registry.get('appConfig.updateTenantTranslations', '1.0.0')).toBe(
      UpdateTenantTranslationOverridesCommand
    );

    expect(registry.get('appConfig.getResolvedBranding', '1.0.0')).toBe(
      GetResolvedBrandingQuery
    );

    expect(registry.get('appConfig.resolveMessage', '1.0.0')).toBe(
      ResolveMessageQuery
    );
  });
});
