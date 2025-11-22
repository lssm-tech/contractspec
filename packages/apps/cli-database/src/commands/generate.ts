import { execa } from 'execa';

export async function runGenerate(argv: any) {
  await execa('prisma', ['generate'], { stdio: 'inherit' });
}
