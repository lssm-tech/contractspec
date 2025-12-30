import { afterEach, beforeEach, mock } from 'bun:test';
import { prismaMock, resetPrismaMock } from './mocks/prisma';

// Set dummy env var to prevent Prisma client from throwing during import
process.env.CONTRACTSPEC_STUDIO_POSTGRES_PRISMA_URL =
  'postgresql://postgres:postgres@localhost:5432/studio';

console.log('[preload] Starting preload, before importing actual module');

// Import the actual module first to get all exports
import * as actualModule from '@contractspec/lib.database-studio';

console.log(
  '[preload] Actual module imported, prisma type:',
  typeof actualModule.prisma
);

// Mock the database module before any test imports it
// Per bun docs: https://bun.sh/docs/test/mocks
mock.module('@contractspec/lib.database-studio', () => {
  console.log('[preload] mock.module factory called');
  // Return the mocked module - prisma is replaced with prismaMock
  // All other exports are passed through from the actual module
  return {
    ...actualModule,
    prisma: prismaMock,
  };
});

console.log('[preload] Mock registered');

// Register global hooks to reset mocks before each test
beforeEach(() => {
  resetPrismaMock();
});

afterEach(() => {
  resetPrismaMock();
});
