import { ScalarTypeEnum, SchemaModel } from '@lssm/lib.schema';
import { defineCommand, defineQuery } from '../spec';
import { OwnersEnum, StabilityEnum, TagsEnum } from '../ownership';
import type { ContractSpec } from '../spec';
import type { SpecRegistry } from '../registry';

const BrandingAssetInput = new SchemaModel({
  name: 'BrandingAssetInput',
  fields: {
    type: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    url: { type: ScalarTypeEnum.URL(), isOptional: false },
    mimeType: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
  },
});

const UpdateTenantBrandingInput = new SchemaModel({
  name: 'UpdateTenantBrandingInput',
  fields: {
    tenantId: { type: ScalarTypeEnum.ID(), isOptional: false },
    appId: { type: ScalarTypeEnum.ID(), isOptional: false },
    environment: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    appName: { type: ScalarTypeEnum.JSONObject(), isOptional: true },
    assets: { type: BrandingAssetInput, isOptional: true, isArray: true },
    colors: { type: ScalarTypeEnum.JSONObject(), isOptional: true },
    customDomain: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    subdomain: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
  },
});

const UpdateTenantBrandingOutput = new SchemaModel({
  name: 'UpdateTenantBrandingOutput',
  fields: {
    success: { type: ScalarTypeEnum.Boolean(), isOptional: false },
    updatedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

const VerifyCustomDomainInput = new SchemaModel({
  name: 'VerifyCustomDomainInput',
  fields: {
    tenantId: { type: ScalarTypeEnum.ID(), isOptional: false },
    appId: { type: ScalarTypeEnum.ID(), isOptional: false },
    domain: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
  },
});

const VerifyCustomDomainOutput = new SchemaModel({
  name: 'VerifyCustomDomainOutput',
  fields: {
    status: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    message: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
  },
});

const TranslationEntryInput = new SchemaModel({
  name: 'TranslationEntryInput',
  fields: {
    key: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    locale: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    value: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    context: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
  },
});

const UpdateBlueprintTranslationInput = new SchemaModel({
  name: 'UpdateBlueprintTranslationInput',
  fields: {
    blueprintName: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: false,
    },
    blueprintVersion: {
      type: ScalarTypeEnum.Int_unsecure(),
      isOptional: false,
    },
    catalogName: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    catalogVersion: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    defaultLocale: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: false,
    },
    supportedLocales: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: false,
      isArray: true,
    },
    entries: {
      type: TranslationEntryInput,
      isOptional: false,
      isArray: true,
    },
  },
});

const UpdateTenantTranslationInput = new SchemaModel({
  name: 'UpdateTenantTranslationInput',
  fields: {
    tenantId: { type: ScalarTypeEnum.ID(), isOptional: false },
    appId: { type: ScalarTypeEnum.ID(), isOptional: false },
    entries: {
      type: TranslationEntryInput,
      isOptional: false,
      isArray: true,
    },
    defaultLocale: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    enabledLocales: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: true,
      isArray: true,
    },
  },
});

const MessageResolutionInput = new SchemaModel({
  name: 'MessageResolutionInput',
  fields: {
    tenantId: { type: ScalarTypeEnum.ID(), isOptional: false },
    appId: { type: ScalarTypeEnum.ID(), isOptional: false },
    locale: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    key: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
  },
});

const MessageResolutionOutput = new SchemaModel({
  name: 'MessageResolutionOutput',
  fields: {
    value: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    source: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
  },
});

export const UpdateTenantBrandingCommand = defineCommand({
  meta: {
    name: 'appConfig.updateTenantBranding',
    version: 1,
    description: 'Applies tenant branding overrides (names, assets, domains).',
    owners: [OwnersEnum.PlatformSigil],
    tags: ['branding'],
    stability: StabilityEnum.Beta,
    goal: 'Maintain tenant-specific branding assets and domains.',
    context:
      'Invoked by the Studio or automation when a tenant updates branding settings.',
  },
  io: {
    input: UpdateTenantBrandingInput,
    output: UpdateTenantBrandingOutput,
  },
  policy: {
    auth: 'admin',
    policies: [{ name: 'platform.app-config.manage', version: 1 }],
  },
});

export const VerifyCustomDomainCommand = defineCommand({
  meta: {
    name: 'appConfig.verifyCustomDomain',
    version: 1,
    description: 'Validates DNS ownership for tenant custom domains.',
    owners: [OwnersEnum.PlatformSigil],
    tags: ['branding'],
    stability: StabilityEnum.Experimental,
    goal: 'Confirm tenant-provided domains before activation.',
    context:
      'Triggered after the tenant adds DNS records to verify domain ownership.',
  },
  io: {
    input: VerifyCustomDomainInput,
    output: VerifyCustomDomainOutput,
  },
  policy: {
    auth: 'admin',
    policies: [{ name: 'platform.app-config.manage', version: 1 }],
  },
});

export const UpdateBlueprintTranslationCatalogCommand = defineCommand({
  meta: {
    name: 'appConfig.updateBlueprintTranslationCatalog',
    version: 1,
    description: 'Registers or updates translation entries for a blueprint.',
    owners: [OwnersEnum.PlatformSigil],
    tags: [TagsEnum.I18n],
    stability: StabilityEnum.Beta,
    goal: 'Keep blueprint translation catalogs in sync with shipped copy.',
    context:
      'Executed by platform automation or CI when committing updated translation catalogs.',
  },
  io: {
    input: UpdateBlueprintTranslationInput,
    output: UpdateTenantBrandingOutput,
  },
  policy: {
    auth: 'admin',
    policies: [{ name: 'platform.app-config.manage', version: 1 }],
  },
});

export const UpdateTenantTranslationOverridesCommand = defineCommand({
  meta: {
    name: 'appConfig.updateTenantTranslations',
    version: 1,
    description: 'Applies tenant-specific translation entries.',
    owners: [OwnersEnum.PlatformSigil],
    tags: [TagsEnum.I18n],
    stability: StabilityEnum.Beta,
    goal: 'Allow tenants to override selected message keys.',
    context:
      'Called by the Studio when a tenant customizes labels or copy for their locale.',
  },
  io: {
    input: UpdateTenantTranslationInput,
    output: UpdateTenantBrandingOutput,
  },
  policy: {
    auth: 'admin',
    policies: [{ name: 'platform.app-config.manage', version: 1 }],
  },
});

export const GetResolvedBrandingQuery = defineQuery({
  meta: {
    name: 'appConfig.getResolvedBranding',
    version: 1,
    description: 'Returns the resolved branding for a tenant/app/environment.',
    owners: [OwnersEnum.PlatformSigil],
    tags: ['branding'],
    stability: StabilityEnum.Beta,
    goal: 'Expose hydrated branding assets for rendering UI/email experiences.',
    context:
      'Used by runtime surfaces to fetch brand assets prior to rendering tenant-specific experiences.',
  },
  io: {
    input: new SchemaModel({
      name: 'GetResolvedBrandingInput',
      fields: {
        tenantId: { type: ScalarTypeEnum.ID(), isOptional: false },
        appId: { type: ScalarTypeEnum.ID(), isOptional: false },
        environment: {
          type: ScalarTypeEnum.String_unsecure(),
          isOptional: true,
        },
      },
    }),
    output: new SchemaModel({
      name: 'GetResolvedBrandingOutput',
      fields: {
        branding: { type: ScalarTypeEnum.JSONObject(), isOptional: false },
      },
    }),
  },
  policy: {
    auth: 'admin',
    policies: [{ name: 'platform.app-config.read', version: 1 }],
  },
});

export const ResolveMessageQuery = defineQuery({
  meta: {
    name: 'appConfig.resolveMessage',
    version: 1,
    description:
      'Resolves a translation key for a tenant in the requested locale.',
    owners: [OwnersEnum.PlatformSigil],
    tags: [TagsEnum.I18n],
    stability: StabilityEnum.Experimental,
    goal: 'Expose a server-side API for resolving message keys on demand.',
    context:
      'Used by backend services or scripts that need translated copy outside the front-end runtime.',
  },
  io: {
    input: MessageResolutionInput,
    output: MessageResolutionOutput,
  },
  policy: {
    auth: 'admin',
    policies: [{ name: 'platform.app-config.read', version: 1 }],
  },
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const appConfigContracts: Record<string, ContractSpec<any, any>> = {
  UpdateTenantBrandingCommand,
  VerifyCustomDomainCommand,
  UpdateBlueprintTranslationCatalogCommand,
  UpdateTenantTranslationOverridesCommand,
  GetResolvedBrandingQuery,
  ResolveMessageQuery,
};

export function registerAppConfigContracts(registry: SpecRegistry) {
  return registry
    .register(UpdateTenantBrandingCommand)
    .register(VerifyCustomDomainCommand)
    .register(UpdateBlueprintTranslationCatalogCommand)
    .register(UpdateTenantTranslationOverridesCommand)
    .register(GetResolvedBrandingQuery)
    .register(ResolveMessageQuery);
}
