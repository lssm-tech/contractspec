import type { AnalyticsReader } from '@contractspec/lib.contracts/integrations/providers/analytics';
import type {
  QueryDefinition,
  QueryParameters,
  QueryResult,
} from '../query-engine';
import { createPosthogQueryEngine } from '../datasource/posthog-datasource';

export interface ExecutePosthogQueryInput {
  definition: QueryDefinition;
  params: QueryParameters;
  reader: AnalyticsReader;
}

export async function executePosthogQuery(
  input: ExecutePosthogQueryInput
): Promise<QueryResult> {
  const engine = createPosthogQueryEngine(input.reader);
  return engine.execute(input.definition, input.params);
}
