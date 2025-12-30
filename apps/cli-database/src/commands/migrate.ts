import { execa } from 'execa';

export async function runMigrate(cmd: string, _argv: unknown) {
  if (cmd === 'migrate:dev') {
    await execa('prisma', ['migrate', 'dev'], { stdio: 'inherit' });
    return;
  }
  if (cmd === 'migrate:deploy') {
    await execa('prisma', ['migrate', 'deploy'], { stdio: 'inherit' });
    return;
  }
  if (cmd === 'migrate:status') {
    await execa('prisma', ['migrate', 'status'], { stdio: 'inherit' });
    return;
  }
}
