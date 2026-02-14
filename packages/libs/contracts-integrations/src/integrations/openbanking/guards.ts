import type {
  ResolvedAppConfig,
  ResolvedIntegration,
} from '@contractspec/lib.contracts-spec/app-config/runtime';

const PRIMARY_SLOT_ID = 'primaryOpenBanking';

export interface OpenBankingGuardResult {
  ok: boolean;
  integration?: ResolvedIntegration;
  error?: string;
}

export function ensurePrimaryOpenBankingIntegration(
  config: ResolvedAppConfig
): OpenBankingGuardResult {
  const integration = config.integrations.find(
    (item) => item.slot.slotId === PRIMARY_SLOT_ID
  );

  if (!integration) {
    return {
      ok: false,
      error: 'primaryOpenBanking slot is not bound in the resolved app config.',
    };
  }

  const status = integration.connection.status;
  if (status === 'error' || status === 'disconnected') {
    return {
      ok: false,
      integration,
      error: `primaryOpenBanking connection is in status "${status}".`,
    };
  }

  if (status === 'unknown') {
    return {
      ok: false,
      integration,
      error: 'primaryOpenBanking connection health is unknown.',
    };
  }

  return { ok: true, integration };
}

export function assertPrimaryOpenBankingReady(
  config: ResolvedAppConfig
): ResolvedIntegration {
  const result = ensurePrimaryOpenBankingIntegration(config);
  if (!result.ok) {
    throw new Error(result.error ?? 'Open banking integration not available.');
  }
  if (!result.integration) {
    throw new Error(result.error ?? 'Open banking integration not available.');
  }
  return result.integration;
}
