import { gqlSchemaBuilder } from './builder';
import { registerAuthSchema } from './modules/auth';
import { registerWorkspacesSchema } from './modules/workspaces';
import { registerStudioSchema } from './modules/studio';
import { registerLifecycleSchema } from './modules/lifecycle';
import { registerIntegrationsSchema } from './modules/integrations';
import { registerRegistrySchema } from './modules/registry';

registerAuthSchema(gqlSchemaBuilder);
registerWorkspacesSchema(gqlSchemaBuilder);
registerStudioSchema(gqlSchemaBuilder);
registerLifecycleSchema(gqlSchemaBuilder);
registerIntegrationsSchema(gqlSchemaBuilder);
registerRegistrySchema(gqlSchemaBuilder);

export const schema = gqlSchemaBuilder.toSchema();
