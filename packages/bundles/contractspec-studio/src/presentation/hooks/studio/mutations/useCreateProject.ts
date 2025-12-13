import { useMutation } from '@tanstack/react-query';

export interface CreateProjectInput {
  workspaceId?: string;
  name: string;
  description?: string;
  tier: 'STARTER' | 'PROFESSIONAL' | 'ENTERPRISE';
  deploymentMode?: 'SHARED' | 'DEDICATED';
  byokEnabled?: boolean;
  evolutionEnabled?: boolean;
}

export interface CreateProjectResponse {
  createStudioProject: {
    id: string;
    name: string;
    tier: string;
    deploymentMode: string;
  };
}

const CREATE_PROJECT_MUTATION = /* GraphQL */ `
  mutation CreateStudioProject($input: CreateProjectInput!) {
    createStudioProject(input: $input) {
      id
      name
      tier
      deploymentMode
    }
  }
`;

async function createProjectRequest(input: CreateProjectInput) {
  const response = await fetch('/api/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: CREATE_PROJECT_MUTATION,
      variables: { input },
    }),
  });
  const payload = (await response.json()) as {
    data?: CreateProjectResponse;
    errors?: { message: string }[];
  };
  if (payload.errors?.length) {
    throw new Error(payload.errors.map((err) => err.message).join(', '));
  }
  return payload.data!;
}

export function useCreateStudioProject() {
  return useMutation({
    mutationFn: createProjectRequest,
  });
}
