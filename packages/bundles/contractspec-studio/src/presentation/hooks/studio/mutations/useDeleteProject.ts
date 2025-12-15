import { useMutation } from '@tanstack/react-query';

export interface DeleteProjectResponse {
  deleteStudioProject: {
    id: string;
    slug: string;
    name: string;
  };
}

const DELETE_PROJECT_MUTATION = /* GraphQL */ `
  mutation DeleteStudioProject($id: String!) {
    deleteStudioProject(id: $id) {
      id
      slug
      name
    }
  }
`;

async function deleteProjectRequest(input: { id: string }) {
  const response = await fetch('/api/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: DELETE_PROJECT_MUTATION,
      variables: { id: input.id },
    }),
  });
  const payload = (await response.json()) as {
    data?: DeleteProjectResponse;
    errors?: { message: string }[];
  };
  if (payload.errors?.length) {
    throw new Error(payload.errors.map((err) => err.message).join(', '));
  }
  return payload.data!;
}

export function useDeleteStudioProject() {
  return useMutation({
    mutationFn: deleteProjectRequest,
  });
}



