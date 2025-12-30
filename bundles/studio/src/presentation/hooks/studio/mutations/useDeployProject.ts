import {
  graphql,
  type DeployProjectInput,
} from '@contractspec/lib.gql-client-studio';
import { useGraphQLMutation } from '../../../libs/gql-client';

const DEPLOY_MUTATION = graphql(`
  mutation DeployStudioProject($input: DeployProjectInput!) {
    deployStudioProject(input: $input) {
      id
      environment
      status
      url
    }
  }
`);

export function useDeployStudioProject() {
  const mutation = useGraphQLMutation(DEPLOY_MUTATION);
  return {
    ...mutation,
    mutateAsync: async (input: DeployProjectInput) => {
      const result = await mutation.mutateAsync({ input });
      return result.deployStudioProject;
    },
  };
}
