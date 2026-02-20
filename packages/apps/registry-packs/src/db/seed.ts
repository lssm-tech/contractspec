/**
 * Seed script — populates the registry with example packs for development.
 *
 * Usage: bun run src/db/seed.ts
 */
import { getDb } from './client.js';
import { packs, packVersions, packReadmes, authTokens } from './schema.js';
import { hashToken, generateToken } from '../auth/token.js';

const db = getDb();

// Clear existing data
db.delete(packVersions).run();
db.delete(packReadmes).run();
db.delete(authTokens).run();
db.delete(packs).run();

console.log('Cleared existing data');

// Create a demo auth token
const demoToken = generateToken();
db.insert(authTokens)
  .values({
    token: hashToken(demoToken),
    username: 'demo-user',
    scope: 'publish',
  })
  .run();

console.log(`Demo auth token: ${demoToken}`);

// Seed packs
const seedPacks = [
  {
    name: 'typescript-best-practices',
    displayName: 'TypeScript Best Practices',
    description:
      'Opinionated TypeScript rules for strict mode, naming, and patterns.',
    authorName: 'demo-user',
    license: 'MIT',
    tags: ['typescript', 'best-practices', 'code-quality'],
    targets: ['opencode', 'cursor', 'claude-code', 'copilot'],
    features: ['rules', 'commands'],
    downloads: 1250,
    weeklyDownloads: 85,
    featured: true,
    verified: true,
  },
  {
    name: 'react-patterns',
    displayName: 'React Patterns',
    description:
      'React component patterns, hooks best practices, and testing rules.',
    authorName: 'demo-user',
    license: 'MIT',
    tags: ['react', 'frontend', 'hooks', 'testing'],
    targets: ['opencode', 'cursor', 'copilot'],
    features: ['rules', 'agents', 'commands'],
    downloads: 980,
    weeklyDownloads: 62,
    featured: true,
    verified: false,
  },
  {
    name: 'monorepo-tooling',
    displayName: 'Monorepo Tooling',
    description: 'Rules and agents for Turborepo/Nx monorepo workflows.',
    authorName: 'admin',
    license: 'MIT',
    tags: ['monorepo', 'turborepo', 'nx', 'devops'],
    targets: ['opencode', 'cursor', 'claude-code'],
    features: ['rules', 'agents', 'mcp', 'hooks'],
    downloads: 540,
    weeklyDownloads: 30,
    featured: false,
    verified: true,
  },
  {
    name: 'api-design',
    displayName: 'API Design Guidelines',
    description:
      'REST/GraphQL API design rules, schema validation, and docs generation.',
    authorName: 'admin',
    license: 'Apache-2.0',
    tags: ['api', 'rest', 'graphql', 'openapi'],
    targets: ['opencode', 'cursor', 'claude-code', 'copilot', 'gemini-cli'],
    features: ['rules', 'commands', 'skills'],
    downloads: 320,
    weeklyDownloads: 18,
    featured: false,
    verified: false,
  },
  {
    name: 'security-audit',
    displayName: 'Security Audit Pack',
    description:
      'Security-focused rules, OWASP checks, and secret scanning agents.',
    authorName: 'demo-user',
    license: 'MIT',
    tags: ['security', 'owasp', 'audit', 'secrets'],
    targets: ['opencode', 'cursor', 'claude-code'],
    features: ['rules', 'agents', 'commands', 'models'],
    downloads: 760,
    weeklyDownloads: 45,
    featured: true,
    verified: true,
  },
];

for (const pack of seedPacks) {
  db.insert(packs).values(pack).run();

  // Add a version for each pack
  db.insert(packVersions)
    .values({
      packName: pack.name,
      version: '1.0.0',
      integrity: `sha256-${pack.name}-placeholder`,
      tarballUrl: `/packs/${pack.name}/versions/1.0.0/download`,
      tarballSize: 2048,
      packManifest: {
        name: pack.name,
        description: pack.description,
        tags: pack.tags,
        targets: pack.targets,
        features: pack.features,
      },
      fileCount: 5,
      featureSummary: Object.fromEntries(pack.features.map((f) => [f, 2])),
    })
    .run();

  // Add a README for each pack
  db.insert(packReadmes)
    .values({
      packName: pack.name,
      content: `# ${pack.displayName}\n\n${pack.description}\n\n## Installation\n\n\`\`\`bash\nagentpacks install registry:${pack.name}\n\`\`\`\n\n## Features\n\n${pack.features.map((f) => `- ${f}`).join('\n')}\n`,
    })
    .run();
}

console.log(`Seeded ${seedPacks.length} packs with versions and READMEs`);
console.log('Done!');
