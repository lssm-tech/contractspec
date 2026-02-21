import chalk from 'chalk';
import { saveCredentials } from '../utils/credentials.js';
import { createRegistryClient } from '../utils/registry-client.js';

interface LoginOptions {
  token?: string;
  registry?: string;
}

/**
 * Authenticate with the agentpacks registry.
 */
export async function runLogin(options: LoginOptions): Promise<void> {
  const registryUrl = options.registry ?? 'https://registry.agentpacks.dev';

  if (!options.token) {
    console.log(chalk.bold('agentpacks login\n'));
    console.log('To authenticate, you need an API token.');
    console.log(`Get one at: ${chalk.cyan(`${registryUrl}/account/tokens`)}\n`);
    console.log('Then run:');
    console.log(chalk.dim('  agentpacks login --token <your-token>\n'));
    return;
  }

  // Validate the token works
  const client = createRegistryClient({
    registryUrl,
    authToken: options.token,
  });

  const healthy = await client.health();
  if (!healthy) {
    console.log(
      chalk.yellow(`Warning: Could not reach registry at ${registryUrl}`)
    );
  }

  // Save credentials
  saveCredentials({
    registryUrl,
    token: options.token,
  });

  console.log(chalk.green(`Authenticated with ${registryUrl}`));
  console.log(
    chalk.dim('Credentials saved to ~/.config/agentpacks/credentials.json')
  );
}
