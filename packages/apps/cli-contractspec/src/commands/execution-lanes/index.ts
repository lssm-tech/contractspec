import { Command } from 'commander';
import { createClarifyCommand } from './clarify-command';
import { createCompleteCommand } from './complete-command';
import { createPlanCommand } from './plan-command';
import { createTeamCommand } from './team-command';

export const executionLanesCommand = new Command('execution-lanes')
	.description('Create and inspect execution-lane artifacts and runs')
	.addCommand(createClarifyCommand())
	.addCommand(createPlanCommand())
	.addCommand(createCompleteCommand())
	.addCommand(createTeamCommand());
