import { resolve } from 'path';
import { existsSync, readFileSync } from 'fs';
import chalk from 'chalk';
import { loadPackManifest } from '../core/config.js';
import { parseModels, scanModelsForSecrets } from '../features/models.js';
import { createRegistryClient } from '../utils/registry-client.js';
import { createTarball } from '../utils/tarball.js';
import { loadCredentials } from '../utils/credentials.js';

interface PublishOptions {
  verbose?: boolean;
}

/**
 * Publish a pack to the registry.
 */
export async function runPublish(
  projectRoot: string,
  options: PublishOptions
): Promise<void> {
  const credentials = loadCredentials();
  if (!credentials.token) {
    console.log(chalk.red('Not authenticated. Run `agentpacks login` first.'));
    process.exit(1);
  }

  // Find the pack directory (current dir or specified)
  const packDir = resolve(projectRoot);

  // Validate pack.json exists
  const packJsonPath = resolve(packDir, 'pack.json');
  if (!existsSync(packJsonPath)) {
    console.log(chalk.red('No pack.json found. Are you in a pack directory?'));
    process.exit(1);
  }

  const manifest = loadPackManifest(packDir);
  console.log(chalk.bold(`Publishing ${manifest.name}@${manifest.version}...`));

  // Secret scanning
  const models = parseModels(packDir, manifest.name);
  if (models) {
    const secretWarnings = scanModelsForSecrets(models.config);
    if (secretWarnings.length > 0) {
      console.log(chalk.red('\nBlocked: secrets detected in models.json:'));
      for (const w of secretWarnings) {
        console.log(chalk.red(`  - ${w}`));
      }
      process.exit(1);
    }
  }

  // Create tarball
  if (options.verbose) console.log(chalk.dim('  Creating tarball...'));
  const tarball = await createTarball(packDir);

  // Publish
  if (options.verbose) console.log(chalk.dim('  Uploading...'));
  const client = createRegistryClient({
    registryUrl: credentials.registryUrl,
    authToken: credentials.token,
  });

  try {
    const result = await client.publish(tarball, {
      name: manifest.name,
      version: manifest.version,
      manifest: manifest as unknown as Record<string, unknown>,
    });

    console.log(chalk.green(`\nPublished ${result.name}@${result.version}`));
    console.log(chalk.dim(`  integrity: ${result.integrity}`));
  } catch (err) {
    console.log(
      chalk.red(
        `\nPublish failed: ${err instanceof Error ? err.message : String(err)}`
      )
    );
    process.exit(1);
  }
}
