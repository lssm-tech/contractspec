import { graphql } from '@contractspec/lib.gql-client-studio';
import { useGraphQLMutation } from '../../../libs/gql-client';

const DELETE_PROJECT_MUTATION = graphql(`
  mutation DeleteStudioProject($id: String!) {
    deleteStudioProject(id: $id) {
      id
      slug
      name
    }
  }
`);

export function useDeleteStudioProject() {
  const mutation = useGraphQLMutation(DELETE_PROJECT_MUTATION);
  return {
    ...mutation,
    mutateAsync: async (input: { id: string }) => {
      const result = await mutation.mutateAsync({ id: input.id });
      return result.deleteStudioProject;
    },
  };
}
