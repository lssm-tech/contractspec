import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import type { CanvasVersionSnapshot } from '../../../../modules/visual-builder';

export interface CanvasVersionsResponse {
  canvasVersions: CanvasVersionSnapshot[];
}

const CANVAS_VERSIONS_QUERY = /* GraphQL */ `
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
`;

async function fetchCanvasVersions(canvasId: string): Promise<CanvasVersionsResponse> {
  const response = await fetch('/api/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: CANVAS_VERSIONS_QUERY,
      variables: { canvasId },
    }),
  });
  const payload = (await response.json()) as {
    data?: CanvasVersionsResponse;
    errors?: { message: string }[];
  };
  if (payload.errors?.length) {
    throw new Error(payload.errors.map((e) => e.message).join(', '));
  }
  return payload.data ?? { canvasVersions: [] };
}

export function useCanvasVersions(
  canvasId: string,
  options: { enabled?: boolean } = {}
): UseQueryResult<CanvasVersionsResponse> {
  return useQuery({
    queryKey: ['canvasVersions', canvasId],
    queryFn: () => fetchCanvasVersions(canvasId),
    enabled: options.enabled ?? Boolean(canvasId),
    staleTime: 10_000,
  });
}









