import { graphql } from '@contractspec/lib.gql-client-studio';

export const PROJECT_SPECS_QUERY = graphql(`
  query ProjectSpecs($projectId: String!) {
    projectSpecs(projectId: $projectId) {
      id
      projectId
      type
      name
      version
      content
      metadata
      updatedAt
    }
  }
`);
