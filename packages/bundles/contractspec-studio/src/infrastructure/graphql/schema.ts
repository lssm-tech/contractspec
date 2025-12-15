import { gqlSchemaBuilder } from './builder';
import { registerAuthSchema } from './modules/auth';
import { registerStudioSchema } from './modules/studio';
import { registerEvolutionSchema } from './modules/evolution';
import { registerLearningSchema } from './modules/learning';
import { registerOnboardingSchema } from './modules/onboarding';
import { registerLifecycleSchema } from './modules/lifecycle';
import { registerIntegrationsSchema } from './modules/integrations';
import { registerRegistrySchema } from './modules/registry';
import { registerTeamsSchema } from './modules/teams';
import { registerPlatformAdminSchema } from './modules/platform-admin';

registerAuthSchema(gqlSchemaBuilder);
registerPlatformAdminSchema(gqlSchemaBuilder);
registerStudioSchema(gqlSchemaBuilder);
registerEvolutionSchema(gqlSchemaBuilder);
registerLearningSchema(gqlSchemaBuilder);
registerOnboardingSchema(gqlSchemaBuilder);
registerTeamsSchema(gqlSchemaBuilder);
registerLifecycleSchema(gqlSchemaBuilder);
registerIntegrationsSchema(gqlSchemaBuilder);
registerRegistrySchema(gqlSchemaBuilder);

export const schema = gqlSchemaBuilder.toSchema();
