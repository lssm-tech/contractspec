import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import type { CanvasState } from '../../../../modules/visual-builder';

export interface StudioCanvasResponse {
  studioCanvas: CanvasState;
}

const STUDIO_CANVAS_QUERY = /* GraphQL */ `
  query StudioCanvas($projectId: String!) {
    studioCanvas(projectId: $projectId)
  }
`;

async function fetchStudioCanvas(projectId: string): Promise<StudioCanvasResponse> {
  const response = await fetch('/api/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: STUDIO_CANVAS_QUERY,
      variables: { projectId },
    }),
  });
  const payload = (await response.json()) as {
    data?: { studioCanvas: CanvasState };
    errors?: { message: string }[];
  };
  if (payload.errors?.length) {
    throw new Error(payload.errors.map((e) => e.message).join(', '));
  }
  return payload.data ?? ({ studioCanvas: { id: '', projectId, nodes: [], versions: [], updatedAt: '' } } as StudioCanvasResponse);
}

export function useStudioCanvas(
  projectId: string,
  options: { enabled?: boolean } = {}
): UseQueryResult<StudioCanvasResponse> {
  return useQuery({
    queryKey: ['studioCanvas', projectId],
    queryFn: () => fetchStudioCanvas(projectId),
    enabled: options.enabled ?? Boolean(projectId),
    staleTime: 10_000,
  });
}




