#!/usr/bin/env node
import mri from 'minimist';
import { execa } from 'execa';
import { loadProfile } from './profile.js';

async function main() {
  const argv = mri(process.argv.slice(2));
  const [cmd] = argv._ as string[];
  const profileName = (argv.profile as string) || 'default';
  const profile = await loadProfile(profileName);

  async function runForEachDb(args: string[]) {
    for (const db of profile.databases) {
      await execa('prisma', args, { stdio: 'inherit', cwd: db.cwd });
    }
  }

  switch (cmd) {
    case 'import':
      for (const db of profile.databases) {
        await execa('database', ['import', '--modules', db.modules.join(','), '--target', db.cwd], { stdio: 'inherit' });
      }
      break;
    case 'check':
      for (const db of profile.databases) {
        await execa('database', ['check', '--target', db.cwd], { stdio: 'inherit' });
      }
      break;
    case 'generate':
      await runForEachDb(['generate']);
      break;
    case 'migrate:dev':
      await runForEachDb(['migrate', 'dev']);
      break;
    case 'migrate:deploy':
      await runForEachDb(['migrate', 'deploy']);
      break;
    case 'migrate:status':
      await runForEachDb(['migrate', 'status']);
      break;
    case 'seed':
      await runForEachDb(['db', 'seed']);
      break;
    default:
      console.error('Usage: databases <import|check|generate|migrate:dev|migrate:deploy|migrate:status|seed> --profile <name>');
      process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});


