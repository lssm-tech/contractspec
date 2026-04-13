import type { Argument, Command, Option } from 'commander';

export interface ParseState {
	command: Command;
	commandPath: string[];
	completedPositionals: number;
	pendingOption?: Option;
}

export function parseCompletionState(
	program: Command,
	tokens: string[]
): ParseState {
	const state: ParseState = {
		command: program,
		commandPath: [],
		completedPositionals: 0,
	};

	for (const token of tokens) {
		if (state.pendingOption) {
			state.pendingOption = undefined;
			continue;
		}

		if (token === '--') {
			break;
		}

		const optionMatch = resolveOptionToken(state.command, token);
		if (optionMatch) {
			if (optionMatch.expectsValue && !optionMatch.hasInlineValue) {
				state.pendingOption = optionMatch.option;
			}
			continue;
		}

		const subcommand = findExactSubcommand(state.command, token);
		if (subcommand) {
			state.command = subcommand;
			state.commandPath.push(subcommand.name());
			state.completedPositionals = 0;
			continue;
		}

		state.completedPositionals += 1;
	}

	return state;
}

export function findOptionSuggestions(
	command: Command,
	partial: string
): string[] {
	return command.options
		.filter((option) => !option.hidden)
		.flatMap((option) => {
			const flags = [option.short, option.long].filter(
				(flag): flag is string => typeof flag === 'string'
			);
			return flags.filter((flag) => {
				if (partial.length === 0) {
					return true;
				}
				if (partial.startsWith('--')) {
					return flag.startsWith('--') && flag.startsWith(partial);
				}
				return flag.startsWith(partial);
			});
		});
}

export function findSubcommandSuggestions(
	command: Command,
	partial: string
): string[] {
	return command.commands
		.filter(
			(candidate) => !(candidate as Command & { _hidden?: boolean })._hidden
		)
		.flatMap((candidate) => [candidate.name(), ...candidate.aliases()])
		.filter((candidate) =>
			partial.length === 0 ? true : candidate.startsWith(partial)
		);
}

export function findActiveArgument(
	command: Command,
	completedPositionals: number
): Argument | undefined {
	if (command.registeredArguments.length === 0) {
		return undefined;
	}

	const direct = command.registeredArguments[completedPositionals];
	if (direct) {
		return direct;
	}

	const last = command.registeredArguments.at(-1);
	if (last?.variadic) {
		return last;
	}

	return undefined;
}

export function resolveInlineOptionValue(command: Command, token: string) {
	if (!token.startsWith('-')) {
		return undefined;
	}

	const separatorIndex = token.indexOf('=');
	if (separatorIndex < 0) {
		return undefined;
	}

	const optionToken = token.slice(0, separatorIndex);
	const value = token.slice(separatorIndex + 1);
	const option = resolveOptionToken(command, optionToken)?.option;
	if (!option) {
		return undefined;
	}

	return {
		option,
		prefix: `${optionToken}=`,
		value,
	};
}

function findExactSubcommand(
	command: Command,
	token: string
): Command | undefined {
	return command.commands.find((candidate) => {
		if ((candidate as Command & { _hidden?: boolean })._hidden) {
			return false;
		}
		return candidate.name() === token || candidate.aliases().includes(token);
	});
}

function resolveOptionToken(command: Command, token: string) {
	for (const option of command.options) {
		const matchesShort = option.short === token;
		const matchesLong = option.long === token;
		const matchesLongWithValue =
			typeof option.long === 'string' && token.startsWith(`${option.long}=`);
		const matchesShortWithValue =
			Boolean(option.short) &&
			Boolean(option.required) &&
			token.startsWith(option.short ?? '') &&
			token !== option.short;

		if (
			!matchesShort &&
			!matchesLong &&
			!matchesLongWithValue &&
			!matchesShortWithValue
		) {
			continue;
		}

		return {
			option,
			expectsValue: option.required || option.optional,
			hasInlineValue: matchesLongWithValue || matchesShortWithValue,
		};
	}

	return undefined;
}
