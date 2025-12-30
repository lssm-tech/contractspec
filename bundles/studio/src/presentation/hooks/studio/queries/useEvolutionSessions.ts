import { graphql } from '@contractspec/lib.gql-client-studio';

export const EVOLUTION_SESSIONS_QUERY = graphql(`
  query EvolutionSessions($projectId: String!) {
    evolutionSessions(projectId: $projectId) {
      id
      projectId
      trigger
      status
      signals
      context
      suggestions
      appliedChanges
      startedAt
      completedAt
    }
  }
`);
