import type { TelemetrySpec } from '@contractspec/lib.contracts-spec/telemetry/spec';
import {
  OwnersEnum,
  StabilityEnum,
  TagsEnum,
} from '@contractspec/lib.contracts-spec/ownership';
import {
  OPENBANKING_PII_FIELDS,
  OPENBANKING_TELEMETRY_EVENTS,
} from '@contractspec/lib.contracts-integrations';

const commonProperties = {
  tenantId: {
    type: 'string',
    required: true,
    description: 'Tenant identifier for multi-tenant isolation.',
  },
  appId: {
    type: 'string',
    required: true,
    description: 'Application identifier associated with the event.',
  },
  blueprint: {
    type: 'string',
    required: true,
    description: 'Blueprint name@version emitting the telemetry.',
  },
  configVersion: {
    type: 'number',
    required: true,
    description: 'Resolved app config version when the event was generated.',
  },
  slotId: {
    type: 'string',
    required: true,
    description: 'Integration slot identifier (e.g., primaryOpenBanking).',
  },
  connectionId: {
    type: 'string',
    required: true,
    description: 'Integration connection ID used for the sync.',
  },
} as const;

function piiSafeString(description: string) {
  return {
    type: 'string' as const,
    description,
    pii: false,
  };
}

export const pocketFamilyOfficeTelemetry: TelemetrySpec = {
  meta: {
    key: 'pfo.telemetry',
    version: '1.0.0',
    title: 'Pocket Family Office Telemetry',
    description:
      'Operational telemetry for Pocket Family Office workflows, including Powens open banking syncs.',
    domain: 'finance',
    owners: [OwnersEnum.PlatformFinance],
    tags: ['open-banking', TagsEnum.Automation],
    stability: StabilityEnum.Experimental,
  },
  config: {
    defaultRetentionDays: 180,
    defaultSamplingRate: 1,
  },
  events: [
    {
      key: OPENBANKING_TELEMETRY_EVENTS.accountsSynced,
      version: '1.0.0',
      semantics: {
        what: 'Open banking account synchronisation completed.',
        why: 'Refresh canonical account metadata for reporting and workflows.',
      },
      privacy: 'internal',
      properties: {
        ...commonProperties,
        syncedCount: {
          type: 'number',
          description: 'Number of accounts synced successfully.',
        },
        failedCount: {
          type: 'number',
          description: 'Number of accounts that failed to sync.',
        },
        durationMs: {
          type: 'number',
          description: 'Duration of the sync job in milliseconds.',
        },
      },
    },
    {
      key: OPENBANKING_TELEMETRY_EVENTS.transactionsSynced,
      version: '1.0.0',
      semantics: {
        what: 'Open banking transaction synchronisation completed.',
        why: 'Keep canonical transaction ledger in sync for analytics.',
      },
      privacy: 'internal',
      properties: {
        ...commonProperties,
        accountId: {
          type: 'string',
          description: 'Bank account identifier used during the sync.',
          pii: false,
        },
        syncedCount: {
          type: 'number',
          description: 'Number of transactions synced successfully.',
        },
        failedCount: {
          type: 'number',
          description: 'Number of transactions that failed to sync.',
        },
        from: {
          type: 'timestamp',
          description: 'Start timestamp for the sync window.',
        },
        to: {
          type: 'timestamp',
          description: 'End timestamp for the sync window.',
        },
      },
    },
    {
      key: OPENBANKING_TELEMETRY_EVENTS.balancesRefreshed,
      version: '1.0.0',
      semantics: {
        what: 'Open banking balances refreshed.',
        why: 'Provide accurate cash position for dashboards and alerts.',
      },
      privacy: 'internal',
      properties: {
        ...commonProperties,
        accountId: piiSafeString('Bank account identifier.'),
        balanceTypes: {
          type: 'json',
          description: 'Balance types included in the refresh.',
        },
        refreshedAt: {
          type: 'timestamp',
          description: 'Timestamp when balances were refreshed.',
        },
      },
    },
    {
      key: OPENBANKING_TELEMETRY_EVENTS.overviewGenerated,
      version: '1.0.0',
      semantics: {
        what: 'Derived financial overview generated.',
        why: 'Persist cashflow and category summaries into knowledge space.',
      },
      privacy: 'internal',
      properties: {
        ...commonProperties,
        knowledgeEntryId: piiSafeString(
          'Identifier of the knowledge document containing the overview.'
        ),
        period: {
          type: 'string',
          description: 'Aggregation period used (week, month, quarter).',
        },
        periodStart: {
          type: 'timestamp',
          description: 'Start timestamp for the aggregation window.',
        },
        periodEnd: {
          type: 'timestamp',
          description: 'End timestamp for the aggregation window.',
        },
      },
      tags: ['knowledge', 'analytics'],
    },
  ],
};

export const OPENBANKING_SENSITIVE_FIELDS = OPENBANKING_PII_FIELDS;
