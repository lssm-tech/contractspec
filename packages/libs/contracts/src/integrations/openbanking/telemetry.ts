export const OPENBANKING_PII_FIELDS = [
  'iban',
  'bic',
  'accountNumberMasked',
  'accountNumber',
  'counterpartyName',
  'counterpartyAccount',
  'description',
  'merchantName',
  'merchantCategoryCode',
  'reference',
] as const;

export const OPENBANKING_TELEMETRY_EVENTS = {
  accountsSynced: 'openbanking.accounts.synced',
  accountsSyncFailed: 'openbanking.accounts.sync_failed',
  transactionsSynced: 'openbanking.transactions.synced',
  transactionsSyncFailed: 'openbanking.transactions.sync_failed',
  balancesRefreshed: 'openbanking.balances.refreshed',
  balancesRefreshFailed: 'openbanking.balances.refresh_failed',
  overviewGenerated: 'openbanking.overview.generated',
} as const;

export type OpenBankingTelemetryEvent =
  (typeof OPENBANKING_TELEMETRY_EVENTS)[keyof typeof OPENBANKING_TELEMETRY_EVENTS];

export function redactOpenBankingTelemetryPayload<
  T extends Record<string, unknown>
>(payload: T): T {
  const redacted: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(payload)) {
    if (OPENBANKING_PII_FIELDS.includes(key as (typeof OPENBANKING_PII_FIELDS)[number])) {
      redacted[key] = maskValue(value);
    } else if (Array.isArray(value)) {
      redacted[key] = value.map((item) =>
        typeof item === 'object' && item !== null
          ? redactOpenBankingTelemetryPayload(item as Record<string, unknown>)
          : item
      );
    } else if (typeof value === 'object' && value !== null) {
      redacted[key] = redactOpenBankingTelemetryPayload(
        value as Record<string, unknown>
      );
    } else {
      redacted[key] = value;
    }
  }
  return redacted as T;
}

function maskValue(value: unknown): string {
  if (value == null) return '';
  const str = String(value);
  if (str.length <= 4) return '*'.repeat(str.length);
  return `${'*'.repeat(Math.max(str.length - 4, 0))}${str.slice(-4)}`;
}




