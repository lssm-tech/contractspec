import { contractSpecStudioSchemaBuilder } from './builder';
import { registerAuthSchema } from './modules/auth';
import { registerEvolutionSchema } from './modules/evolution';
import { registerIntegrationsSchema } from './modules/integrations';
import { registerLearningSchema } from './modules/learning';
import { registerLifecycleSchema } from './modules/lifecycle';
import { registerOnboardingSchema } from './modules/onboarding';
import { registerPlatformAdminSchema } from './modules/platform-admin';
import { registerRegistrySchema } from './modules/registry';
import { registerStudioSchema } from './modules/studio';
import { registerTeamsSchema } from './modules/teams';

registerAuthSchema(contractSpecStudioSchemaBuilder);
registerPlatformAdminSchema(contractSpecStudioSchemaBuilder);
registerStudioSchema(contractSpecStudioSchemaBuilder);
registerEvolutionSchema(contractSpecStudioSchemaBuilder);
registerLearningSchema(contractSpecStudioSchemaBuilder);
registerOnboardingSchema(contractSpecStudioSchemaBuilder);
registerTeamsSchema(contractSpecStudioSchemaBuilder);
registerLifecycleSchema(contractSpecStudioSchemaBuilder);
registerIntegrationsSchema(contractSpecStudioSchemaBuilder);
registerRegistrySchema(contractSpecStudioSchemaBuilder);

export const schema = contractSpecStudioSchemaBuilder.toSchema();
