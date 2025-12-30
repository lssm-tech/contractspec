import {
  graphql,
  type SaveCanvasDraftInput,
  type DeployCanvasVersionInput,
  type UndoCanvasInput,
} from '@contractspec/lib.gql-client-studio';
import { useGraphQLMutation } from '../../../libs/gql-client';

export interface CanvasVersionResponse {
  id: string;
  label: string;
  status: 'draft' | 'deployed';
  nodes: unknown;
  createdAt: string;
  createdBy?: string | null;
}

const SAVE_DRAFT_MUTATION = graphql(`
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
`);

const DEPLOY_VERSION_MUTATION = graphql(`
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
`);

const UNDO_VERSION_MUTATION = graphql(`
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
`);

export function useSaveCanvasDraft() {
  const mutation = useGraphQLMutation(SAVE_DRAFT_MUTATION);
  return {
    ...mutation,
    mutateAsync: async (input: SaveCanvasDraftInput) => {
      const result = await mutation.mutateAsync({ input });
      return result.saveCanvasDraft;
    },
  };
}

export function useDeployCanvasVersion() {
  const mutation = useGraphQLMutation(DEPLOY_VERSION_MUTATION);
  return {
    ...mutation,
    mutateAsync: async (input: DeployCanvasVersionInput) => {
      const result = await mutation.mutateAsync({ input });
      return result.deployCanvasVersion;
    },
  };
}

export function useUndoCanvasVersion() {
  const mutation = useGraphQLMutation(UNDO_VERSION_MUTATION);
  return {
    ...mutation,
    mutateAsync: async (input: UndoCanvasInput) => {
      const result = await mutation.mutateAsync({ input });
      return result.undoCanvasVersion;
    },
  };
}
