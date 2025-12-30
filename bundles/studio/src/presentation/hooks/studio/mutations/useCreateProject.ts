import {
  graphql,
  type CreateProjectInput,
} from '@contractspec/lib.gql-client-studio';
import { useGraphQLMutation } from '../../../libs/gql-client';

const CREATE_PROJECT_MUTATION = graphql(`
  mutation CreateStudioProject($input: CreateProjectInput!) {
    createStudioProject(input: $input) {
      id
      slug
      name
      tier
      deploymentMode
    }
  }
`);

export function useCreateStudioProject() {
  const mutation = useGraphQLMutation(CREATE_PROJECT_MUTATION);
  return {
    ...mutation,
    mutateAsync: async (input: CreateProjectInput) => {
      const result = await mutation.mutateAsync({ input });
      return result.createStudioProject;
    },
  };
}
