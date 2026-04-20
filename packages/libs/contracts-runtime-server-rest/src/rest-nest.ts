import {
	type ContractResult,
	ContractSpecError,
	isContractResult,
	normalizeContractError,
} from '@contractspec/lib.contracts-spec/results';

export interface NestHttpResponse {
	status(code: number): { json(body: unknown): unknown };
}

export interface NestArgumentsHostLike {
	switchToHttp(): { getResponse(): NestHttpResponse };
}

export interface NestExecutionContextLike extends NestArgumentsHostLike {}

export interface NestObservableLike<_T = unknown> {
	pipe(operator: unknown): unknown;
}

export interface NestCallHandlerLike {
	handle(): Promise<unknown> | NestObservableLike | unknown;
}

export interface NestMapOperatorFactory {
	map(project: (value: unknown) => unknown): unknown;
}

export function mapContractResultForNest(value: unknown): {
	status: number;
	body: unknown;
} {
	if (isContractResult(value)) {
		if (value.ok) {
			return { status: value.status, body: value.data };
		}
		return { status: value.status, body: value.problem };
	}
	return { status: 200, body: value };
}

export class ContractSpecNestExceptionFilter {
	catch(exception: unknown, host: NestArgumentsHostLike): unknown {
		const failure = normalizeContractError(exception);
		const response = host.switchToHttp().getResponse();
		return response.status(failure.status).json(failure.problem);
	}
}

export class ContractSpecNestResultInterceptor {
	constructor(private readonly operators?: NestMapOperatorFactory) {}

	interceptValue(value: unknown): unknown {
		const mapped = mapContractResultForNest(value);
		return mapped.body;
	}

	intercept(
		_context: NestExecutionContextLike,
		next: NestCallHandlerLike
	): Promise<unknown> | unknown {
		const handled = next.handle();
		if (isPromiseLike(handled)) {
			return handled.then((value) => this.interceptValue(value));
		}
		if (isObservableLike(handled) && this.operators) {
			return handled.pipe(
				this.operators.map((value: unknown) => this.interceptValue(value))
			);
		}
		return this.interceptValue(handled);
	}
}

export function unwrapContractResultForNest<T>(result: ContractResult<T>): T {
	if (result.ok) return result.data;
	throw new ContractSpecError(result.problem);
}

function isPromiseLike(value: unknown): value is Promise<unknown> {
	return (
		typeof value === 'object' &&
		value !== null &&
		'then' in value &&
		typeof (value as { then?: unknown }).then === 'function'
	);
}

function isObservableLike(value: unknown): value is NestObservableLike {
	return (
		typeof value === 'object' &&
		value !== null &&
		'pipe' in value &&
		typeof (value as { pipe?: unknown }).pipe === 'function'
	);
}
