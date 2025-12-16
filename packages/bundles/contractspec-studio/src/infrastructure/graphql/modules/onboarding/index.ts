import { gqlSchemaBuilder } from '../../builder';
import { createOnboardingGraphqlTypes } from './graphql-types';
import { registerOnboardingMutations } from './graphql-mutations';
import { registerOnboardingQueries } from './graphql-queries';

export function registerOnboardingSchema(builder: typeof gqlSchemaBuilder) {
  const types = createOnboardingGraphqlTypes(builder);
  registerOnboardingQueries(builder, types);
  registerOnboardingMutations(builder, types);
}







