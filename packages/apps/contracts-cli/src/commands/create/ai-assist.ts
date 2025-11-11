import ora from 'ora';
import chalk from 'chalk';
import { AIClient } from '../../ai/client.js';
import type { Config } from '../../utils/config.js';
import type { OpKind, PresentationKind, OperationSpecData, EventSpecData, PresentationSpecData } from '../../types.js';

/**
 * Use AI to generate operation spec from description
 */
export async function aiGenerateOperation(
  description: string,
  kind: OpKind,
  config: Config
): Promise<Partial<OperationSpecData>> {
  const spinner = ora('Generating operation spec with AI...').start();

  try {
    const client = new AIClient(config);
    const result = await client.generateOperationSpec(description, kind);

    spinner.succeed(chalk.green('Operation spec generated!'));

    return {
      name: result.name,
      version: result.version,
      description: result.description,
      goal: result.goal,
      context: result.context,
      stability: result.stability,
      owners: result.owners,
      tags: result.tags,
      auth: result.auth,
      flags: result.flags,
      kind,
      hasInput: true,
      hasOutput: true,
      emitsEvents: result.possibleEvents.length > 0,
    };
  } catch (error) {
    spinner.fail(chalk.red('Failed to generate spec'));
    throw error;
  }
}

/**
 * Use AI to generate event spec from description
 */
export async function aiGenerateEvent(
  description: string,
  config: Config
): Promise<Partial<EventSpecData>> {
  const spinner = ora('Generating event spec with AI...').start();

  try {
    const client = new AIClient(config);
    const result = await client.generateEventSpec(description);

    spinner.succeed(chalk.green('Event spec generated!'));

    return {
      name: result.name,
      version: result.version,
      description: result.description,
      stability: result.stability,
      owners: result.owners,
      tags: result.tags,
      piiFields: result.piiFields,
    };
  } catch (error) {
    spinner.fail(chalk.red('Failed to generate spec'));
    throw error;
  }
}

/**
 * Use AI to generate presentation spec from description
 */
export async function aiGeneratePresentation(
  description: string,
  kind: PresentationKind,
  config: Config
): Promise<Partial<PresentationSpecData>> {
  const spinner = ora('Generating presentation spec with AI...').start();

  try {
    const client = new AIClient(config);
    const result = await client.generatePresentationSpec(description, kind);

    spinner.succeed(chalk.green('Presentation spec generated!'));

    return {
      name: result.name,
      version: result.version,
      description: result.description,
      stability: result.stability,
      owners: result.owners,
      tags: result.tags,
      presentationKind: kind,
    };
  } catch (error) {
    spinner.fail(chalk.red('Failed to generate spec'));
    throw error;
  }
}

