import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { graphql } from '@contractspec/lib.gql-client-studio';
import { gqlRequest } from '../../../libs/gql-client';
import { authClient } from '../../../providers/auth/client';
import type { CanvasState } from '../../../../modules/visual-builder';

export interface StudioCanvasResponse {
  studioCanvas: CanvasState;
}

const STUDIO_CANVAS_QUERY = graphql(`
  query StudioCanvas($projectId: String!) {
    studioCanvas(projectId: $projectId)
  }
`);

export function useStudioCanvas(
  projectId: string,
  options: { enabled?: boolean } = {}
): UseQueryResult<StudioCanvasResponse> {
  const { data: sessionData } = authClient.useSession();
  const token = sessionData?.session?.token;
  const isEnabled = (options.enabled ?? Boolean(projectId)) && Boolean(token);

  return useQuery({
    queryKey: ['studioCanvas', projectId],
    queryFn: async () => {
      const result = await gqlRequest(
        STUDIO_CANVAS_QUERY,
        { projectId },
        token ? { Authorization: `Bearer ${token}` } : {}
      );
      return result as unknown as StudioCanvasResponse;
    },
    enabled: isEnabled,
    staleTime: 10_000,
  });
}
