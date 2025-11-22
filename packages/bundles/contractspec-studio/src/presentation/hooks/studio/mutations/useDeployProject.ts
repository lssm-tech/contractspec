import { useMutation } from '@tanstack/react-query';

export interface DeployProjectInput {
  projectId: string;
  environment: 'DEVELOPMENT' | 'STAGING' | 'PRODUCTION';
}

export interface DeployProjectResponse {
  deployStudioProject: {
    id: string;
    environment: string;
    status: string;
    url?: string | null;
  };
}

const DEPLOY_MUTATION = /* GraphQL */ `
  mutation DeployStudioProject($input: DeployProjectInput!) {
    deployStudioProject(input: $input) {
      id
      environment
      status
      url
    }
  }
`;

async function deployProjectRequest(input: DeployProjectInput) {
  const response = await fetch('/api/studio/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: DEPLOY_MUTATION,
      variables: { input },
    }),
  });
  const payload = (await response.json()) as {
    data?: DeployProjectResponse;
    errors?: { message: string }[];
  };
  if (payload.errors?.length) {
    throw new Error(payload.errors.map((err) => err.message).join(', '));
  }
  return payload.data!;
}

export function useDeployStudioProject() {
  return useMutation({
    mutationFn: deployProjectRequest,
  });
}




