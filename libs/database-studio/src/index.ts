export { prisma } from './client'; // exports instance of prisma
export * from './generated/prisma/client'; // exports generated types from prisma

import type PothosPrismaTypes from './generated/pothos-types';
import { getDatamodel } from './generated/pothos-types';

export type { PothosPrismaTypes };
export { getDatamodel };

export * as utils from './utils/prisma-json';
export {
  toInputJson,
  toJsonValue,
  toJsonNullValue,
  toNullableJsonValue,
} from './utils/prisma-json';
