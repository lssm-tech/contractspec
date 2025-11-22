import { gqlSchemaBuilder } from './builder';
import { registerAuthSchema } from './modules/auth';
import { registerStudioSchema } from './modules/studio';
import { registerLifecycleSchema } from './modules/lifecycle';
import { registerIntegrationsSchema } from './modules/integrations';

registerAuthSchema(gqlSchemaBuilder);
registerStudioSchema(gqlSchemaBuilder);
registerLifecycleSchema(gqlSchemaBuilder);
registerIntegrationsSchema(gqlSchemaBuilder);

export const schema = gqlSchemaBuilder.toSchema();
