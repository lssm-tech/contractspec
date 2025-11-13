import type { AppBlueprintSpec, TenantAppConfig } from './spec';
import type { ResolvedAppConfig } from './runtime';

export type ValidationSeverity = 'error' | 'warning';

export interface ValidationIssue {
  path: string;
  message: string;
  severity: ValidationSeverity;
}

const DOMAIN_REGEX =
  /^(?!:\/\/)([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.[A-Za-z]{2,}$/;

export function validateAppBlueprintSpec(
  spec: AppBlueprintSpec
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const slotIds = new Set<string>();

  for (const slot of spec.integrationSlots ?? []) {
    if (slotIds.has(slot.slotId)) {
      issues.push({
        severity: 'error',
        path: `integrationSlots.${slot.slotId}`,
        message: `Duplicate integration slot id "${slot.slotId}".`,
      });
    } else {
      slotIds.add(slot.slotId);
    }
    if (slot.allowedModes && slot.allowedModes.length === 0) {
      issues.push({
        severity: 'warning',
        path: `integrationSlots.${slot.slotId}.allowedModes`,
        message: 'allowedModes is empty; slot will accept all supported modes.',
      });
    }
  }

  if (spec.branding && !spec.branding.appNameKey.trim()) {
    issues.push({
      severity: 'warning',
      path: 'branding.appNameKey',
      message: 'branding.appNameKey should reference a translation key.',
    });
  }

  return issues;
}

export function validateTenantAppConfig(
  blueprint: AppBlueprintSpec,
  tenant: TenantAppConfig
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const slotMap = new Map(
    (blueprint.integrationSlots ?? []).map((slot) => [slot.slotId, slot])
  );

  const bindings = tenant.integrations ?? [];
  const slotsBound = new Set<string>();
  for (const binding of bindings) {
    const slot = slotMap.get(binding.slotId);
    if (!slot) {
      issues.push({
        severity: 'error',
        path: `integrations.${binding.slotId}`,
        message: `Integration slot "${binding.slotId}" is not defined in blueprint "${blueprint.meta.name}".`,
      });
      continue;
    }
    slotsBound.add(slot.slotId);
  }

  for (const slot of slotMap.values()) {
    if (slot.required && !slotsBound.has(slot.slotId)) {
      issues.push({
        severity: 'error',
        path: `integrations.${slot.slotId}`,
        message: `Required integration slot "${slot.slotId}" is not bound for tenant "${tenant.meta.tenantId}".`,
      });
    }
  }

  const domain = tenant.branding?.customDomain;
  if (domain) {
    if (!DOMAIN_REGEX.test(domain)) {
      issues.push({
        severity: 'error',
        path: 'branding.customDomain',
        message: `Custom domain "${domain}" is not a valid hostname.`,
      });
    }
  }

  const assets = tenant.branding?.assets ?? [];
  for (const asset of assets) {
    if (!/^https?:\/\//.test(asset.url)) {
      issues.push({
        severity: 'warning',
        path: `branding.assets.${asset.type}`,
        message: `Asset URL "${asset.url}" should be an absolute HTTP(S) URL.`,
      });
    }
  }

  if (tenant.locales) {
    const { defaultLocale, enabledLocales } = tenant.locales;
    if (!enabledLocales.includes(defaultLocale)) {
      issues.push({
        severity: 'warning',
        path: 'locales.enabledLocales',
        message: `enabledLocales does not include defaultLocale "${defaultLocale}".`,
      });
    }
  }

  return issues;
}

export function validateResolvedAppConfig(
  blueprint: AppBlueprintSpec,
  resolved: ResolvedAppConfig
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const requiredSlots = (blueprint.integrationSlots ?? []).filter(
    (slot) => slot.required
  );
  for (const slot of requiredSlots) {
    const matched = resolved.integrations.some(
      (integration) => integration.slot.slotId === slot.slotId
    );
    if (!matched) {
      issues.push({
        severity: 'error',
        path: `integrations.${slot.slotId}`,
        message: `Resolved config is missing required integration slot "${slot.slotId}".`,
      });
    }
  }

  if (
    resolved.translation &&
    !resolved.translation.supportedLocales.includes(
      resolved.translation.defaultLocale
    )
  ) {
    issues.push({
      severity: 'warning',
      path: 'translation.supportedLocales',
      message:
        'supportedLocales should include defaultLocale for consistent fallback behaviour.',
    });
  }

  return issues;
}

