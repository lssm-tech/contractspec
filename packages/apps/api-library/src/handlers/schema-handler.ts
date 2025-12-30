import { Elysia } from 'elysia';
import contractsrcSchema from '../schemas/contractsrc.json';
import { contractRegistryManifestSchemaJson } from '../schemas/generate-registry-schema';

export const schemaHandler = new Elysia()
  .get('/schemas/contractsrc.json', () => contractsrcSchema)
  .get(
    '/schema/contractspec-registry.json',
    () => contractRegistryManifestSchemaJson
  );
