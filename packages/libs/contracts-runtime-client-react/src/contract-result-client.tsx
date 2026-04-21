'use client';

import {
	type ContractFailure,
	type ContractProblem,
	type ContractProblemIssue,
	type ContractResult,
	type ContractSuccess,
	contractFail,
	contractOk,
	isContractProblem,
	isContractResult,
} from '@contractspec/lib.contracts-spec/results';
import * as React from 'react';

export interface ContractFieldError {
	message: string;
	type?: string;
}

export type ContractFieldErrorMap = Record<string, ContractFieldError>;

export function parseContractResponse<TData = unknown>(
	value: unknown
): ContractResult<TData> {
	if (isContractResult(value)) {
		return value as ContractResult<TData>;
	}
	if (isContractProblem(value)) {
		return problemToFailure(value);
	}

	const graphQlProblem = readGraphQlProblem(value);
	if (graphQlProblem) {
		return problemToFailure(graphQlProblem);
	}

	const mcpProblem = readMcpProblem(value);
	if (mcpProblem) {
		return problemToFailure(mcpProblem);
	}

	if (isRecord(value)) {
		if (isContractProblem(value.problem)) {
			return problemToFailure(value.problem);
		}
		if (isContractProblem(value.lastProblem)) {
			return problemToFailure(value.lastProblem);
		}
		if (isContractProblem(value.error)) {
			return problemToFailure(value.error);
		}
		if (isContractResult(value.resultEnvelope)) {
			return value.resultEnvelope as ContractResult<TData>;
		}
		if (isContractResult(value.result)) {
			return value.result as ContractResult<TData>;
		}
		if (typeof value.error === 'string') {
			return contractFail('INTERNAL_ERROR', undefined, {
				detail: value.error,
			}) as ContractFailure;
		}
		if (typeof value.lastError === 'string') {
			return contractFail('INTERNAL_ERROR', undefined, {
				detail: value.lastError,
			}) as ContractFailure;
		}
		if ('output' in value) {
			return contractOk(value.output as TData);
		}
	}

	return contractOk(value as TData);
}

export function problemIssuesToFieldErrors(
	problem: ContractProblem | undefined
): ContractFieldErrorMap {
	const errors: ContractFieldErrorMap = {};
	for (const issue of problem?.issues ?? []) {
		const key = issue.path ?? '_root';
		errors[key] = {
			message: issue.message,
			type: issue.code,
		};
	}
	return errors;
}

export interface UseContractMutationState<TData> {
	result: ContractResult<TData> | null;
	data: TData | null;
	problem: ContractProblem | null;
	loading: boolean;
}

export function useContractMutation<TInput = unknown, TData = unknown>(
	execute: (input: TInput) => Promise<unknown>
) {
	const [state, setState] = React.useState<UseContractMutationState<TData>>({
		result: null,
		data: null,
		problem: null,
		loading: false,
	});

	const mutate = React.useCallback(
		async (input: TInput): Promise<ContractResult<TData>> => {
			setState((current) => ({ ...current, loading: true }));
			try {
				const result = parseContractResponse<TData>(await execute(input));
				setState({
					result,
					data: result.ok ? result.data : null,
					problem: result.ok ? null : result.problem,
					loading: false,
				});
				return result;
			} catch (error) {
				const result = parseContractResponse<TData>({
					error: error instanceof Error ? error.message : String(error),
				});
				setState({
					result,
					data: null,
					problem: result.ok ? null : result.problem,
					loading: false,
				});
				return result;
			}
		},
		[execute]
	);

	return { ...state, mutate };
}

export interface UseContractQueryOptions<TInput> {
	input: TInput;
	enabled?: boolean;
}

export function useContractQuery<TInput = void, TData = unknown>(
	execute: (input: TInput) => Promise<unknown>,
	options: UseContractQueryOptions<TInput>
) {
	const mutation = useContractMutation<TInput, TData>(execute);

	React.useEffect(() => {
		if (options.enabled === false) return;
		void mutation.mutate(options.input);
	}, [mutation.mutate, options.enabled, options.input]);

	return {
		...mutation,
		refetch: () => mutation.mutate(options.input),
	};
}

function problemToFailure<TCode extends string>(
	problem: ContractProblem<TCode, Record<string, unknown>>
): ContractFailure<TCode, Record<string, unknown>> {
	return {
		ok: false,
		code: problem.code,
		status: problem.status,
		problem,
	};
}

function readGraphQlProblem(value: unknown): ContractProblem | undefined {
	if (!isRecord(value) || !Array.isArray(value.errors)) return undefined;
	for (const error of value.errors) {
		if (!isRecord(error)) continue;
		const extensions = error.extensions;
		if (!isRecord(extensions)) continue;
		const contractspec = extensions.contractspec;
		if (!isRecord(contractspec)) continue;
		if (isContractProblem(contractspec.problem)) return contractspec.problem;
	}
	return undefined;
}

function readMcpProblem(value: unknown): ContractProblem | undefined {
	if (
		!isRecord(value) ||
		value.isError !== true ||
		!Array.isArray(value.content)
	) {
		return undefined;
	}
	for (const item of value.content) {
		if (!isRecord(item) || typeof item.text !== 'string') continue;
		try {
			const parsed = JSON.parse(item.text) as unknown;
			if (isContractProblem(parsed)) return parsed;
		} catch {
			continue;
		}
	}
	return undefined;
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null;
}

export type { ContractProblemIssue, ContractSuccess };
