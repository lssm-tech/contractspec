/**
 * CICD command group.
 *
 * Commands for installing and managing CI/CD workflows.
 */

import { Command } from 'commander';
import { doctorCommand } from './doctor';
import { installCommand } from './install';

export const cicdCommand = new Command('cicd')
	.description('CI/CD workflow management')
	.addCommand(installCommand)
	.addCommand(doctorCommand);
