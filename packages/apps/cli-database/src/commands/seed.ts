import { execa } from 'execa';

export async function runSeed(argv: any) {
  // Delegate to prisma db seed if configured, else no-op
  try {
    await execa('prisma', ['db', 'seed'], { stdio: 'inherit' });
  } catch (e) {
    console.warn('No prisma seed configured or seed failed.');
    throw e;
  }
}
