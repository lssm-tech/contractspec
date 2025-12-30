import { graphql } from '@contractspec/lib.gql-client-studio';
import { useGraphQLMutation } from '../../../libs/gql-client';

const RECORD_LEARNING_EVENT_MUTATION = graphql(`
  mutation RecordLearningEvent($input: RecordLearningEventInput!) {
    recordLearningEvent(input: $input) {
      id
    }
  }
`);

export function useRecordLearningEvent() {
  return useGraphQLMutation(RECORD_LEARNING_EVENT_MUTATION);
}
