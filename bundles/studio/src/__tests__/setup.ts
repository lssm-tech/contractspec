import { afterEach, beforeEach } from 'bun:test';
import { prismaMock, resetPrismaMock } from './mocks/prisma';

// Reset mocks before each test
beforeEach(() => {
  console.log('[setup] beforeEach running, resetting Prisma mock');
  resetPrismaMock();
  console.log(
    '[setup] member.findFirst mock set:',
    typeof prismaMock.member.findFirst.getMockImplementation
  );
});

afterEach(() => {
  resetPrismaMock();
});
