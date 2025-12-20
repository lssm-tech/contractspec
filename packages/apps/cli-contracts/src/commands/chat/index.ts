/**
 * ContractSpec Chat Command
 *
 * Interactive AI chat for vibe coding within the CLI.
 */

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import {
  createProviderFromEnv,
  createProvider,
  getAvailableProviders,
  type ProviderName,
} from '@lssm/lib.ai-providers';
import {
  ChatService,
  InMemoryConversationStore,
} from '@lssm/module.ai-chat/core';
import type { Config } from '../../utils/config';
import { input, select } from '@inquirer/prompts';

/**
 * Default system prompt for ContractSpec CLI chat
 */
const CLI_SYSTEM_PROMPT = `You are ContractSpec AI, an expert coding assistant specialized in ContractSpec development.

You are running in a CLI environment. Your responses should be:
- Concise and terminal-friendly
- Use code blocks with syntax highlighting when showing code
- Provide actionable suggestions

Your capabilities:
- Help users create, modify, and understand ContractSpec specifications
- Generate code that follows ContractSpec patterns and best practices
- Explain concepts from the ContractSpec documentation
- Suggest improvements and identify issues in specs and implementations
- Guide users through the ContractSpec CLI commands

Current working directory context is available. Use it to understand the project structure.`;

/**
 * Chat command implementation
 */
async function runChat(
  options: {
    provider?: ProviderName;
    model?: string;
    apiKey?: string;
    context?: boolean;
  },
  config: Config
): Promise<void> {
  console.log(chalk.cyan('\n🤖 ContractSpec AI Chat'));
  console.log(
    chalk.dim(
      'Type your message and press Enter. Type "exit" or "quit" to leave.\n'
    )
  );

  // Determine provider
  let providerName = options.provider ?? config.aiProvider ?? 'openai';

  // Map legacy provider names
  if (providerName === 'claude') {
    providerName = 'anthropic';
  }

  // Create provider
  const spinner = ora('Connecting to AI provider...').start();

  try {
    const provider = options.apiKey
      ? createProvider({
          provider: providerName as ProviderName,
          model: options.model ?? config.aiModel,
          apiKey: options.apiKey,
        })
      : createProviderFromEnv();

    // Validate provider
    const validation = await provider.validate();
    if (!validation.valid) {
      spinner.fail(`Provider validation failed: ${validation.error}`);
      console.log(chalk.yellow('\nAvailable providers:'));
      const available = getAvailableProviders();
      for (const p of available) {
        const status = p.available ? chalk.green('✓') : chalk.red('✗');
        const reason = p.reason ? chalk.dim(` (${p.reason})`) : '';
        console.log(`  ${status} ${p.provider} [${p.mode}]${reason}`);
      }
      return;
    }

    spinner.succeed(`Connected to ${provider.name} (${provider.model})`);

    // Build workspace context if requested
    let contextInfo = '';
    if (options.context !== false) {
      const cwd = process.cwd();
      contextInfo = `\n\nWorkspace: ${cwd}`;
      console.log(chalk.dim(`Workspace context: ${cwd}`));
    }

    // Create chat service
    const chatService = new ChatService({
      provider,
      store: new InMemoryConversationStore(),
      systemPrompt: CLI_SYSTEM_PROMPT + contextInfo,
      onUsage: (usage) => {
        console.log(
          chalk.dim(
            `\n[Tokens: ${usage.inputTokens} in / ${usage.outputTokens} out]`
          )
        );
      },
    });

    console.log(chalk.dim('─'.repeat(60)));

    // Interactive loop
    let conversationId: string | undefined;

    while (true) {
      const userInput = await input({
        message: chalk.green('You'),
        theme: { prefix: '' },
      });

      const trimmedInput = userInput.trim().toLowerCase();
      if (
        trimmedInput === 'exit' ||
        trimmedInput === 'quit' ||
        trimmedInput === 'q'
      ) {
        console.log(chalk.cyan('\nGoodbye! 👋\n'));
        break;
      }

      if (trimmedInput === 'clear') {
        conversationId = undefined;
        console.log(chalk.dim('Conversation cleared.\n'));
        continue;
      }

      if (trimmedInput === 'help') {
        console.log(chalk.cyan('\nCommands:'));
        console.log('  exit, quit, q  - Exit the chat');
        console.log('  clear          - Clear conversation history');
        console.log('  help           - Show this help\n');
        continue;
      }

      if (!userInput.trim()) {
        continue;
      }

      // Stream response
      console.log(chalk.blue('\nAssistant:'));

      try {
        const result = await chatService.stream({
          conversationId,
          content: userInput,
        });

        conversationId = result.conversationId;
        // let fullResponse = '';

        for await (const chunk of result.stream) {
          if (chunk.type === 'text' && chunk.content) {
            process.stdout.write(chunk.content);
            // fullResponse += chunk.content;
          } else if (chunk.type === 'error' && chunk.error) {
            console.log(chalk.red(`\nError: ${chunk.error.message}`));
          }
        }

        console.log('\n');
        console.log(chalk.dim('─'.repeat(60)));
      } catch (error) {
        console.log(
          chalk.red(
            `\nError: ${error instanceof Error ? error.message : String(error)}`
          )
        );
        console.log(chalk.dim('─'.repeat(60)));
      }
    }
  } catch (error) {
    spinner.fail('Failed to initialize chat');
    console.error(
      chalk.red('\nError:'),
      error instanceof Error ? error.message : String(error)
    );
  }
}

/**
 * Provider selection prompt
 */
async function selectProvider(): Promise<{
  provider: ProviderName;
  model: string;
  apiKey?: string;
} | null> {
  const available = getAvailableProviders();

  const providerChoice = await select({
    message: 'Select AI provider',
    choices: available.map((p) => ({
      value: p.provider,
      name: `${p.provider} [${p.mode}]${!p.available ? ' (unavailable)' : ''}`,
      disabled: !p.available,
    })),
  });

  // Get models for provider
  const provider = createProvider({ provider: providerChoice as ProviderName });
  const models = await provider.listModels();

  const modelChoice = await select({
    message: 'Select model',
    choices: models.map((m) => ({
      value: m.id,
      name: `${m.name} (${Math.round(m.contextWindow / 1000)}K context)`,
    })),
  });

  return {
    provider: providerChoice as ProviderName,
    model: modelChoice,
  };
}

/**
 * Create the chat command
 */
export const chatCommand = new Command()
  .name('chat')
  .description('Interactive AI chat for vibe coding')
  .option(
    '-p, --provider <provider>',
    'AI provider (openai, anthropic, mistral, gemini, ollama)'
  )
  .option('-m, --model <model>', 'AI model to use')
  .option('-k, --api-key <key>', 'API key (or use environment variables)')
  .option('--no-context', 'Disable workspace context')
  .option('-i, --interactive', 'Interactive provider/model selection')
  .action(async (options) => {
    try {
      // Load config
      const { loadConfig } = await import('../../utils/config');
      const config = await loadConfig();

      if (options.interactive) {
        const selection = await selectProvider();
        if (selection) {
          options.provider = selection.provider;
          options.model = selection.model;
          options.apiKey = selection.apiKey;
        }
      }

      await runChat(options, config);
    } catch (error) {
      console.error(
        chalk.red('\n❌ Error:'),
        error instanceof Error ? error.message : String(error)
      );
      process.exit(1);
    }
  });
