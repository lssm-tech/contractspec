import fs from 'node:fs';
import path from 'node:path';

export interface DbConfig {
  dbId: string;
  cwd: string; // path to the DB package root where prisma/ lives
  modules: string[]; // @lssm/app.cli-database-* modules to import
  configFile?: string; // override prisma config location (defaults to prisma.config.ts)
}

export interface DatabasesProfile {
  name: string;
  databases: DbConfig[];
}

export async function loadProfile(name: string): Promise<DatabasesProfile> {
  // Convention: look for databases.profile.<name>.json at repo root
  const root = process.cwd();
  const file = path.join(root, `databases.profile.${name}.json`);
  if (!fs.existsSync(file)) {
    throw new Error(`Profile not found: ${file}`);
  }
  const json = JSON.parse(fs.readFileSync(file, 'utf8')) as DatabasesProfile;
  return json;
}
