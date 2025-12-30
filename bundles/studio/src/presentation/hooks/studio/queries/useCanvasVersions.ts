import { type UseQueryResult } from '@tanstack/react-query';
import { graphql } from '@contractspec/lib.gql-client-studio';
import { useGraphQL } from '../../../libs/gql-client';
import { authClient } from '../../../providers/auth/client';
import type { CanvasVersionSnapshot } from '../../../../modules/visual-builder';

export interface CanvasVersionsResponse {
  canvasVersions: CanvasVersionSnapshot[];
}

const CANVAS_VERSIONS_QUERY = graphql(`
  query CanvasVersions($canvasId: String!) {
    canvasVersions(canvasId: $canvasId) {
      id
      label
      status
      nodes
      createdAt
      createdBy
    }
  }
`);

export function useCanvasVersions(
  canvasId: string,
  options: { enabled?: boolean } = {}
): UseQueryResult<CanvasVersionsResponse> {
  const { data: sessionData } = authClient.useSession();
  const token = sessionData?.session?.token;
  // useGraphQL handles token internally via authClient, but we might want to ensure token exists if that's a requirement for this query.
  // The original code checked 'token' for 'enabled'.
  // However, useGraphQL uses authClient internally.
  // If we want to strictly follow the previous logic:

  const isEnabled = (options.enabled ?? Boolean(canvasId)) && Boolean(token);

  const query = useGraphQL(
    CANVAS_VERSIONS_QUERY,
    { canvasId },
    {
      enabled: isEnabled,
      staleTime: 10_000,
    }
  );
  return query as unknown as UseQueryResult<CanvasVersionsResponse>;
}
