import { graphql } from '@contractspec/lib.gql-client-studio';

export const STUDIO_INTEGRATIONS_QUERY = graphql(`
  query StudioIntegrations($projectId: String!) {
    studioIntegrations(projectId: $projectId) {
      id
      organizationId
      projectId
      provider
      name
      enabled
      usageCount
      lastUsed
      config
      createdAt
    }
  }
`);
