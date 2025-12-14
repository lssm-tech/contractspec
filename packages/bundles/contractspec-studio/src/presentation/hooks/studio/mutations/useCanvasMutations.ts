import { useMutation } from '@tanstack/react-query';
import type { ComponentNode } from '../../../../modules/visual-builder';

export interface SaveCanvasDraftInput {
  canvasId: string;
  nodes: ComponentNode[];
  label?: string;
}

export interface CanvasVersionResponse {
  id: string;
  label: string;
  status: 'draft' | 'deployed';
  nodes: unknown;
  createdAt: string;
  createdBy?: string | null;
}

const SAVE_DRAFT_MUTATION = /* GraphQL */ `
  mutation SaveCanvasDraft($input: SaveCanvasDraftInput!) {
    saveCanvasDraft(input: $input) {
      id
      label
      status
      nodes
      createdAt
      createdBy
    }
  }
`;

const DEPLOY_VERSION_MUTATION = /* GraphQL */ `
  mutation DeployCanvasVersion($input: DeployCanvasVersionInput!) {
    deployCanvasVersion(input: $input) {
      id
      label
      status
      nodes
      createdAt
      createdBy
    }
  }
`;

const UNDO_VERSION_MUTATION = /* GraphQL */ `
  mutation UndoCanvasVersion($input: UndoCanvasInput!) {
    undoCanvasVersion(input: $input) {
      id
      label
      status
      nodes
      createdAt
      createdBy
    }
  }
`;

async function gqlRequest<T>(query: string, variables: Record<string, unknown>) {
  const response = await fetch('/api/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  });
  const payload = (await response.json()) as { data?: T; errors?: { message: string }[] };
  if (payload.errors?.length) {
    throw new Error(payload.errors.map((e) => e.message).join(', '));
  }
  return payload.data!;
}

export function useSaveCanvasDraft() {
  return useMutation({
    mutationFn: async (input: SaveCanvasDraftInput) => {
      return gqlRequest<{ saveCanvasDraft: CanvasVersionResponse }>(SAVE_DRAFT_MUTATION, {
        input,
      });
    },
  });
}

export function useDeployCanvasVersion() {
  return useMutation({
    mutationFn: async (input: { canvasId: string; versionId: string }) => {
      return gqlRequest<{ deployCanvasVersion: CanvasVersionResponse }>(DEPLOY_VERSION_MUTATION, {
        input,
      });
    },
  });
}

export function useUndoCanvasVersion() {
  return useMutation({
    mutationFn: async (input: { canvasId: string }) => {
      return gqlRequest<{ undoCanvasVersion: CanvasVersionResponse | null }>(UNDO_VERSION_MUTATION, {
        input,
      });
    },
  });
}


