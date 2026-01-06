import { defineCommand, defineQuery } from '@contractspec/lib.contracts';

/**
 * listPets
 *
 * @source OpenAPI: GET /pets
 */
export const ListPetsSpec = defineQuery({
  meta: {
    key: 'listPets',
    version: '1.0.0',
    stability: 'stable',
    owners: [],
    tags: [],
    description: "listPets",
    goal: "Imported from OpenAPI",
    context: 'Imported from OpenAPI: GET /pets',
  },
  io: {
    input: null,
    output: null, // TODO: Define output schema
  },
  policy: {
    auth: 'user',
  },
  transport: {
    rest: {
      method: 'GET',
      path: '/pets',
    },
  },
});