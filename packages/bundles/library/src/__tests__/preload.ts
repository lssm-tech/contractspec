import { afterEach, beforeEach, mock } from 'bun:test';
import { prismaMock, resetPrismaMock } from './mocks/prisma';

// Import the actual module first to get all exports
import * as actualModule from '@contractspec/lib.database-studio';

// Mock the database module before any test imports it
// Per bun docs: https://bun.sh/docs/test/mocks
mock.module('@contractspec/lib.database-studio', () => {
  // Return the mocked module - prisma is replaced with prismaMock
  // All other exports are passed through from the actual module
  return {
    ...actualModule,
    prisma: prismaMock,
  };
});

// Register global hooks to reset mocks before each test
beforeEach(() => {
  resetPrismaMock();
});

afterEach(() => {
  resetPrismaMock();
});
