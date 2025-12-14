import { gqlSchemaBuilder } from './builder';
import { registerAuthSchema } from './modules/auth';
import { registerStudioSchema } from './modules/studio';
import { registerEvolutionSchema } from './modules/evolution';
import { registerLearningSchema } from './modules/learning';
import { registerLifecycleSchema } from './modules/lifecycle';
import { registerIntegrationsSchema } from './modules/integrations';
import { registerRegistrySchema } from './modules/registry';
import { registerTeamsSchema } from './modules/teams';

registerAuthSchema(gqlSchemaBuilder);
registerStudioSchema(gqlSchemaBuilder);
registerEvolutionSchema(gqlSchemaBuilder);
registerLearningSchema(gqlSchemaBuilder);
registerTeamsSchema(gqlSchemaBuilder);
registerLifecycleSchema(gqlSchemaBuilder);
registerIntegrationsSchema(gqlSchemaBuilder);
registerRegistrySchema(gqlSchemaBuilder);

export const schema = gqlSchemaBuilder.toSchema();
