export const DEMO_FIXTURES = {
  jurisdictions: ['EU', 'FR'] as const,
  locales: ['en-GB', 'fr-FR'] as const,
  demoOrgId: 'org_demo',
  demoUserId: 'user_demo',
  sources: {
    EU_SOURCE_1: {
      jurisdiction: 'EU',
      authority: 'DemoAuthority',
      title: 'EU Demo Source v1',
      fetchedAt: new Date('2026-01-01T00:00:00.000Z'),
      hash: 'hash_eu_v1',
      fileId: 'file_eu_v1',
    },
    EU_SOURCE_2: {
      jurisdiction: 'EU',
      authority: 'DemoAuthority',
      title: 'EU Demo Source v2',
      fetchedAt: new Date('2026-02-01T00:00:00.000Z'),
      hash: 'hash_eu_v2',
      fileId: 'file_eu_v2',
    },
  },
  rules: {
    EU_RULE_TAX: {
      id: 'rule_eu_tax',
      jurisdiction: 'EU',
      topicKey: 'tax_reporting',
    },
  },
} as const;


