import type { AppBlueprintSpec } from '@contractspec/lib.contracts/app-config/spec';
import {
  OwnersEnum,
  StabilityEnum,
  TagsEnum,
} from '@contractspec/lib.contracts/ownership';

export const supabaseKnowledgeBlueprint: AppBlueprintSpec = {
  meta: {
    key: 'knowledge.supabase.dual-store',
    version: '1.0.0',
    appId: 'knowledge-assistant',
    title: 'Knowledge Assistant - Supabase Dual Store',
    description:
      'Blueprint that uses Supabase for both vector retrieval and SQL-backed analytics.',
    domain: 'knowledge',
    owners: [OwnersEnum.PlatformCore],
    tags: [
      TagsEnum.Automation,
      'knowledge',
      'supabase',
      'vector-db',
      'database',
    ],
    stability: StabilityEnum.Experimental,
  },
  capabilities: {
    enabled: [
      { key: 'vector-db.search', version: '1.0.0' },
      { key: 'vector-db.storage', version: '1.0.0' },
      { key: 'database.sql', version: '1.0.0' },
    ],
  },
  integrationSlots: [
    {
      slotId: 'primary-vector-db',
      requiredCategory: 'vector-db',
      allowedModes: ['managed', 'byok'],
      requiredCapabilities: [
        { key: 'vector-db.search', version: '1.0.0' },
        { key: 'vector-db.storage', version: '1.0.0' },
      ],
      required: true,
      description: 'Primary semantic retrieval store for knowledge chunks.',
    },
    {
      slotId: 'primary-database',
      requiredCategory: 'database',
      allowedModes: ['managed', 'byok'],
      requiredCapabilities: [{ key: 'database.sql', version: '1.0.0' }],
      required: true,
      description:
        'Primary SQL database for analytics and transactional reads.',
    },
  ],
  workflows: {
    ingestKnowledge: {
      key: 'knowledge.ingest.supabase',
      version: '1.0.0',
    },
    refreshMetrics: {
      key: 'knowledge.metrics.supabase',
      version: '1.0.0',
    },
  },
  notes:
    'Bind both slots to Supabase connections when you want shared infra for embeddings and SQL operations.',
};
