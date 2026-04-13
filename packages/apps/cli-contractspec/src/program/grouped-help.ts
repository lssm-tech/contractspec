import chalk from 'chalk';
import { Command, Help } from 'commander';
import { CATEGORY_ORDER, CATEGORY_OTHER } from './categories';

export class GroupedHelp extends Help {
	formatHelp(cmd: Command, helper: Help): string {
		const raw = new Help().formatHelp(cmd, helper);
		const splitTag = '\nCommands:\n';

		if (!raw.includes(splitTag)) {
			return raw;
		}

		const [preCommands] = raw.split(splitTag);
		const formattedGroups = this.formatCommandGroups(cmd, helper);
		return `${preCommands}${splitTag}${formattedGroups}`;
	}

	private formatCommandGroups(cmd: Command, helper: Help): string {
		const commands = helper.visibleCommands(cmd);
		if (!commands.length) {
			return '';
		}

		const termWidth = helper.padWidth(cmd, helper);
		const scopedHelper = Object.create(helper) as Help;
		scopedHelper.padWidth = () => termWidth;

		const groups: Record<string, Command[]> = {};
		for (const command of commands) {
			const category =
				(command as Command & { category?: string }).category ?? CATEGORY_OTHER;
			if (!groups[category]) {
				groups[category] = [];
			}
			groups[category].push(command);
		}

		return CATEGORY_ORDER.filter((category) => groups[category]?.length)
			.map((category) => {
				const dummyCommand = new Command();
				for (const command of groups[category] ?? []) {
					dummyCommand.addCommand(command);
				}

				const dummyHelp = new Help().formatHelp(dummyCommand, scopedHelper);
				const cleanOutput =
					dummyHelp.split('\nCommands:\n')[1]?.replace(/\n+$/, '') ?? dummyHelp;
				return `${chalk.yellow.bold(category)}\n${cleanOutput}`;
			})
			.join('\n\n');
	}
}
