/**
 * impl command group
 *
 * Commands for managing and verifying spec implementations.
 */

import { Command } from 'commander';
import { createStatusCommand } from './status';
import { createListCommand } from './list';
import { createVerifyCommand } from './verify';
import { createLinkCommand } from './link';

/**
 * Create the impl command group
 */
export function createImplCommand(): Command {
  const implCommand = new Command('impl')
    .description('Manage and verify spec implementations')
    .addHelpText(
      'after',
      `
Examples:
  $ contractspec impl status                     Check all specs
  $ contractspec impl status --spec ./my.spec.ts Check single spec
  $ contractspec impl list ./my.spec.ts          List implementations
  $ contractspec impl verify ./my.spec.ts        Verify implementation
  $ contractspec impl link ./my.spec.ts ./my.handler.ts  Link implementation
`
    );

  implCommand.addCommand(createStatusCommand());
  implCommand.addCommand(createListCommand());
  implCommand.addCommand(createVerifyCommand());
  implCommand.addCommand(createLinkCommand());

  return implCommand;
}

export {
  createStatusCommand,
  createListCommand,
  createVerifyCommand,
  createLinkCommand,
};
