import type {
  ResolvedAppConfig,
  ResolvedIntegration,
} from '@contractspec/lib.contracts-spec/app-config/runtime';

const PRIMARY_SLOT_ID = 'primaryHealth';

export interface HealthGuardResult {
  ok: boolean;
  integration?: ResolvedIntegration;
  error?: string;
}

export function ensurePrimaryHealthIntegration(
  config: ResolvedAppConfig
): HealthGuardResult {
  const integration = config.integrations.find(
    (item) => item.slot.slotId === PRIMARY_SLOT_ID
  );
  if (!integration) {
    return {
      ok: false,
      error: 'primaryHealth slot is not bound in the resolved app config.',
    };
  }

  if (integration.spec.meta.category !== 'health') {
    return {
      ok: false,
      integration,
      error: `primaryHealth slot must bind a health integration, received "${integration.spec.meta.category}".`,
    };
  }

  const status = integration.connection.status;
  if (status === 'disconnected' || status === 'error') {
    return {
      ok: false,
      integration,
      error: `primaryHealth connection is in status "${status}".`,
    };
  }
  if (status === 'unknown') {
    return {
      ok: false,
      integration,
      error: 'primaryHealth connection health is unknown.',
    };
  }
  return {
    ok: true,
    integration,
  };
}

export function assertPrimaryHealthReady(
  config: ResolvedAppConfig
): ResolvedIntegration {
  const result = ensurePrimaryHealthIntegration(config);
  if (!result.ok || !result.integration) {
    throw new Error(result.error ?? 'Health integration not available.');
  }
  return result.integration;
}
