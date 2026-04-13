import type { Command, Option } from 'commander';
import {
	findActiveArgument,
	findOptionSuggestions,
	findSubcommandSuggestions,
	parseCompletionState,
	resolveInlineOptionValue,
} from './command-tree';
import {
	argumentPrefersDirectories,
	isPathLikeArgument,
	isPathLikeOption,
	optionPrefersDirectories,
	resolveOptionValues,
} from './metadata';
import { listPathSuggestions } from './path-suggestions';

export async function resolveCompletionCandidates(
	program: Command,
	tokens: string[],
	cwd: string = process.cwd()
): Promise<string[]> {
	const currentToken = tokens.at(-1) ?? '';
	const priorTokens = tokens.slice(0, -1);
	const state = parseCompletionState(program, priorTokens);
	const suggestions = new Set<string>();

	const optionWithInlineValue = resolveInlineOptionValue(
		state.command,
		currentToken
	);
	if (optionWithInlineValue) {
		for (const suggestion of await resolveValueSuggestions(
			state.commandPath,
			optionWithInlineValue.option,
			optionWithInlineValue.value,
			cwd
		)) {
			suggestions.add(`${optionWithInlineValue.prefix}${suggestion}`);
		}
		return [...suggestions].sort((left, right) => left.localeCompare(right));
	}

	if (state.pendingOption) {
		for (const suggestion of await resolveValueSuggestions(
			state.commandPath,
			state.pendingOption,
			currentToken,
			cwd
		)) {
			suggestions.add(suggestion);
		}
		return [...suggestions].sort((left, right) => left.localeCompare(right));
	}

	if (!currentToken.startsWith('-')) {
		for (const subcommand of findSubcommandSuggestions(
			state.command,
			currentToken
		)) {
			suggestions.add(subcommand);
		}

		for (const positional of await resolvePositionalSuggestions(
			state.command,
			state.completedPositionals,
			currentToken,
			cwd
		)) {
			suggestions.add(positional);
		}
	}

	for (const option of findOptionSuggestions(state.command, currentToken)) {
		suggestions.add(option);
	}

	return [...suggestions].sort((left, right) => left.localeCompare(right));
}

async function resolvePositionalSuggestions(
	command: Command,
	completedPositionals: number,
	partial: string,
	cwd: string
): Promise<string[]> {
	const argument = findActiveArgument(command, completedPositionals);
	if (!argument) {
		return [];
	}

	if (argument.argChoices?.length) {
		return argument.argChoices.filter((choice) => choice.startsWith(partial));
	}

	if (!isPathLikeArgument(argument)) {
		return [];
	}

	return listPathSuggestions(
		partial,
		cwd,
		argumentPrefersDirectories(argument)
	);
}

async function resolveValueSuggestions(
	commandPath: string[],
	option: Option,
	partial: string,
	cwd: string
): Promise<string[]> {
	const explicitValues = resolveOptionValues(commandPath, option);
	if (explicitValues) {
		return explicitValues.filter((value) => value.startsWith(partial));
	}

	if (!isPathLikeOption(option)) {
		return [];
	}

	return listPathSuggestions(partial, cwd, optionPrefersDirectories(option));
}
