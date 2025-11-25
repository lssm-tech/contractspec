import { afterEach, beforeEach, vi } from 'bun:test';
import { prismaMock, resetPrismaMock } from './mocks/prisma';

vi.mock('@lssm/lib.database-contractspec-studio', async () => {
  const actual = await vi.importActual<
    typeof import('@lssm/lib.database-contractspec-studio')
  >('@lssm/lib.database-contractspec-studio');
  return {
    ...actual,
    prisma: prismaMock as unknown as typeof actual.prisma,
  };
});

beforeEach(() => {
  resetPrismaMock();
});

afterEach(() => {
  resetPrismaMock();
});
