import { defineFeature } from '@contractspec/lib.contracts-spec';

export const ProjectManagementSyncFeature = defineFeature({
  meta: {
    key: 'project-management-sync',
    version: '1.0.0',
    title: 'Project Management Sync',
    description:
      'Create work items in Linear, Jira, and Notion from contract definitions',
    domain: 'integration',
    owners: ['@examples'],
    tags: ['project-management', 'sync', 'linear', 'jira', 'notion'],
    stability: 'experimental',
  },

  integrations: [
    { key: 'project-management-sync.integration.linear', version: '1.0.0' },
    { key: 'project-management-sync.integration.jira', version: '1.0.0' },
    { key: 'project-management-sync.integration.notion', version: '1.0.0' },
  ],

  docs: [
    'docs.examples.project-management-sync',
    'docs.examples.project-management-sync.usage',
  ],
});
