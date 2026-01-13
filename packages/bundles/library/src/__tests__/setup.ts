import { afterEach, beforeEach } from 'bun:test';
import { resetPrismaMock } from './mocks/prisma';

// Reset mocks before each test
beforeEach(() => {
  resetPrismaMock();
});

afterEach(() => {
  resetPrismaMock();
});
