import { execa } from 'execa';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function runGenerate(_argv: any) {
  await execa('prisma', ['generate'], { stdio: 'inherit' });
}
