import { createOnboardingGraphqlTypes } from './graphql-types';
import { registerOnboardingMutations } from './graphql-mutations';
import { registerOnboardingQueries } from './graphql-queries';
import type { contractSpecStudioSchemaBuilder } from '../../builder';

export function registerOnboardingSchema(
  builder: typeof contractSpecStudioSchemaBuilder
) {
  const types = createOnboardingGraphqlTypes(builder);
  registerOnboardingQueries(builder, types);
  registerOnboardingMutations(builder, types);
}
