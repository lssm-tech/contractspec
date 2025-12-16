/**
 * LLM Command Group
 *
 * Commands for LLM integration:
 * - export: Export specs to markdown for LLM consumption
 * - guide: Generate implementation guides for AI agents
 * - verify: Verify implementations against specs
 * - copy: Copy spec markdown to clipboard
 */

import { Command } from 'commander';
import chalk from 'chalk';
import { exportLLMCommand } from './export';
import { guideLLMCommand } from './guide';
import { verifyLLMCommand } from './verify';
import { copyLLMCommand } from './copy';

export const llmCommand = new Command('llm')
  .description(
    'LLM integration tools for spec export, guidance, and verification'
  )
  .addCommand(exportLLMCommand)
  .addCommand(guideLLMCommand)
  .addCommand(verifyLLMCommand)
  .addCommand(copyLLMCommand);
