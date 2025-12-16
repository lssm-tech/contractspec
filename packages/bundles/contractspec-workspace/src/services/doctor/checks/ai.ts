/**
 * AI provider health checks.
 */

import type { FsAdapter } from '../../../ports/fs';
import type { CheckResult, CheckContext, DoctorPromptCallbacks, FixResult } from '../types';

/**
 * Run AI provider-related health checks.
 */
export async function runAiChecks(
  fs: FsAdapter,
  ctx: CheckContext,
  prompts?: DoctorPromptCallbacks
): Promise<CheckResult[]> {
  const results: CheckResult[] = [];

  // Check configured AI provider
  const providerResult = await checkAiProvider(fs, ctx);
  results.push(providerResult);

  // Check API key based on provider
  if (providerResult.status === 'pass') {
    results.push(await checkApiKey(fs, ctx, prompts));
  }

  return results;
}

/**
 * Check which AI provider is configured.
 */
async function checkAiProvider(
  fs: FsAdapter,
  ctx: CheckContext
): Promise<CheckResult> {
  const configPath = fs.join(ctx.workspaceRoot, '.contractsrc.json');

  try {
    const exists = await fs.exists(configPath);
    if (!exists) {
      return {
        category: 'ai',
        name: 'AI Provider',
        status: 'skip',
        message: 'No config file found',
      };
    }

    const content = await fs.readFile(configPath);
    const config = JSON.parse(content) as {
      aiProvider?: string;
      aiModel?: string;
    };

    const provider = config.aiProvider ?? 'claude';
    const model = config.aiModel ?? 'default';

    return {
      category: 'ai',
      name: 'AI Provider',
      status: 'pass',
      message: `Provider: ${provider}, Model: ${model}`,
    };
  } catch {
    return {
      category: 'ai',
      name: 'AI Provider',
      status: 'skip',
      message: 'Could not read AI config',
    };
  }
}

/**
 * Check if API key is set for the configured provider.
 */
async function checkApiKey(
  fs: FsAdapter,
  ctx: CheckContext,
  prompts?: DoctorPromptCallbacks
): Promise<CheckResult> {
  const configPath = fs.join(ctx.workspaceRoot, '.contractsrc.json');

  try {
    const content = await fs.readFile(configPath);
    const config = JSON.parse(content) as { aiProvider?: string };

    const provider = config.aiProvider ?? 'claude';

    // Map provider to env var
    const envVarMap: Record<string, string> = {
      claude: 'ANTHROPIC_API_KEY',
      openai: 'OPENAI_API_KEY',
      ollama: '', // Ollama doesn't need API key
      custom: 'CONTRACTSPEC_LLM_API_KEY',
    };

    const envVar = envVarMap[provider];

    // Ollama doesn't need an API key
    if (!envVar) {
      return {
        category: 'ai',
        name: 'API Key',
        status: 'pass',
        message: `${provider} does not require an API key`,
      };
    }

    const hasKey = !!process.env[envVar];

    if (hasKey) {
      return {
        category: 'ai',
        name: 'API Key',
        status: 'pass',
        message: `${envVar} is set`,
      };
    }

    return {
      category: 'ai',
      name: 'API Key',
      status: 'warn',
      message: `${envVar} not set`,
      details: `Set ${envVar} in your environment to use AI features`,
      fix: prompts
        ? {
            description: `Set ${envVar} environment variable`,
            apply: async (): Promise<FixResult> => {
              const key = await prompts.input(
                `Enter your ${provider} API key:`,
                { password: true }
              );

              if (!key) {
                return { success: false, message: 'No API key provided' };
              }

              // We can't actually set env vars permanently, but we can create a .env file
              const envPath = fs.join(ctx.workspaceRoot, '.env');
              try {
                let envContent = '';
                if (await fs.exists(envPath)) {
                  envContent = await fs.readFile(envPath);
                  // Check if var already exists
                  if (envContent.includes(`${envVar}=`)) {
                    return {
                      success: false,
                      message: `${envVar} already in .env, update manually`,
                    };
                  }
                  envContent += '\n';
                }

                envContent += `${envVar}=${key}\n`;
                await fs.writeFile(envPath, envContent);

                return {
                  success: true,
                  message: `Added ${envVar} to .env (restart required)`,
                };
              } catch (error) {
                const msg = error instanceof Error ? error.message : String(error);
                return { success: false, message: `Failed: ${msg}` };
              }
            },
          }
        : undefined,
    };
  } catch {
    return {
      category: 'ai',
      name: 'API Key',
      status: 'skip',
      message: 'Could not check API key',
    };
  }
}

