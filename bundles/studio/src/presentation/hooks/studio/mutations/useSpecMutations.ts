import {
  graphql,
  type CreateSpecInput,
  type UpdateSpecInput,
} from '@contractspec/lib.gql-client-studio';
import { useGraphQLMutation } from '../../../libs/gql-client';

const CREATE_SPEC_MUTATION = graphql(`
  mutation CreateStudioSpec($input: CreateSpecInput!) {
    createStudioSpec(input: $input) {
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

const UPDATE_SPEC_MUTATION = graphql(`
  mutation UpdateStudioSpec($id: String!, $input: UpdateSpecInput!) {
    updateStudioSpec(id: $id, input: $input) {
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

export function useCreateStudioSpec() {
  const mutation = useGraphQLMutation(CREATE_SPEC_MUTATION);
  return {
    ...mutation,
    mutateAsync: async (input: CreateSpecInput) => {
      const result = await mutation.mutateAsync({ input });
      return result.createStudioSpec;
    },
  };
}

export function useUpdateStudioSpec() {
  const mutation = useGraphQLMutation(UPDATE_SPEC_MUTATION);
  return {
    ...mutation,
    mutateAsync: async (input: { id: string } & UpdateSpecInput) => {
      const { id, ...rest } = input;
      const result = await mutation.mutateAsync({ id, input: rest });
      return result.updateStudioSpec;
    },
  };
}
