/**
 * CICD command group.
 *
 * Commands for installing and managing CI/CD workflows.
 */

import { Command } from 'commander';
import { installCommand } from './install';
import { doctorCommand } from './doctor';

export const cicdCommand = new Command('cicd')
  .description('CI/CD workflow management')
  .addCommand(installCommand)
  .addCommand(doctorCommand);
