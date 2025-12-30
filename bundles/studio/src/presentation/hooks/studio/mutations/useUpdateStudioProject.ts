import { graphql } from '@contractspec/lib.gql-client-studio';

export const UPDATE_PROJECT_MUTATION = graphql(`
  mutation UpdateStudioProject($id: String!, $input: UpdateProjectInput!) {
    updateStudioProject(id: $id, input: $input) {
      id
      slug
      name
      description
      updatedAt
    }
  }
`);
