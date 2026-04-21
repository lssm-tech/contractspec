export type ContractResultState =
	| 'accepted'
	| 'completed'
	| 'created'
	| 'empty'
	| 'partial'
	| 'queued';

export type ContractProblemCategory =
	| 'auth'
	| 'conflict'
	| 'dependency'
	| 'internal'
	| 'integration'
	| 'job'
	| 'not_found'
	| 'payment'
	| 'policy'
	| 'rate_limit'
	| 'timeout'
	| 'validation'
	| 'workflow';

export type ContractProblemSeverity = 'error' | 'fatal' | 'info' | 'warning';

export type StandardSuccessCode =
	| 'ACCEPTED'
	| 'CREATED'
	| 'MULTI_STATUS'
	| 'NO_CONTENT'
	| 'OK'
	| 'PARTIAL'
	| 'QUEUED';

export type StandardFailureCode =
	| 'BAD_GATEWAY'
	| 'BAD_REQUEST'
	| 'CONFLICT'
	| 'FORBIDDEN'
	| 'GONE'
	| 'INTERNAL_ERROR'
	| 'METHOD_NOT_ALLOWED'
	| 'NOT_FOUND'
	| 'NOT_IMPLEMENTED'
	| 'PAYMENT_REQUIRED'
	| 'PRECONDITION_FAILED'
	| 'RATE_LIMITED'
	| 'SERVICE_UNAVAILABLE'
	| 'TIMEOUT'
	| 'UNAUTHENTICATED'
	| 'VALIDATION_FAILED';

export interface ContractProblemIssue {
	path?: string;
	code?: string;
	message: string;
}

export interface ContractProblemSource {
	service?: string;
	channel?: string;
	workflowId?: string;
	stepId?: string;
	jobId?: string;
	runId?: string;
}

export interface ContractProblemOperation {
	key: string;
	version: string;
	kind?: string;
}

export interface ContractProblem<
	TCode extends string = StandardFailureCode,
	TArgs extends Record<string, unknown> = Record<string, unknown>,
> {
	type: string;
	title: string;
	status: number;
	code: TCode;
	detail?: string;
	instance?: string;
	category: ContractProblemCategory;
	severity: ContractProblemSeverity;
	retryable: boolean;
	retryAfter?: number | Date;
	gqlCode?: string;
	traceId?: string;
	operation?: ContractProblemOperation;
	source?: ContractProblemSource;
	args?: TArgs;
	issues?: ContractProblemIssue[];
	metadata?: Record<string, unknown>;
}

export interface ContractSuccess<
	TData = unknown,
	TCode extends string = StandardSuccessCode,
> {
	ok: true;
	code: TCode;
	status: number;
	data: TData;
	state?: ContractResultState;
	message?: string;
	warnings?: ContractProblem[];
	partialProblems?: ContractProblem[];
	traceId?: string;
	headers?: Record<string, string>;
	links?: Record<string, string>;
	pagination?: Record<string, unknown>;
	cache?: Record<string, unknown>;
	idempotency?: Record<string, unknown>;
	source?: ContractProblemSource;
	metadata?: Record<string, unknown>;
}

export interface ContractFailure<
	TCode extends string = StandardFailureCode,
	TArgs extends Record<string, unknown> = Record<string, unknown>,
> {
	ok: false;
	code: TCode;
	status: number;
	problem: ContractProblem<TCode, TArgs>;
}

export type ContractResult<
	TData = unknown,
	TSuccessCode extends string = StandardSuccessCode,
	TFailureCode extends string = StandardFailureCode,
	TFailureArgs extends Record<string, unknown> = Record<string, unknown>,
> =
	| ContractSuccess<TData, TSuccessCode>
	| ContractFailure<TFailureCode, TFailureArgs>;

export interface ContractSuccessSpec {
	status: number;
	state?: ContractResultState;
	description?: string;
	headers?: Record<string, string>;
}

export interface ContractFailureSpec<
	TArgs extends Record<string, unknown> = Record<string, unknown>,
> {
	status?: number;
	description: string;
	title?: string;
	type?: string;
	category?: ContractProblemCategory;
	severity?: ContractProblemSeverity;
	retryable?: boolean;
	retryAfter?: number;
	gqlCode?: string;
	http?: number;
	when?: string;
	args?: TArgs;
}

export interface ResultCatalog<
	TSuccess extends Record<string, ContractSuccessSpec> = Record<
		string,
		ContractSuccessSpec
	>,
	TFailure extends Record<string, ContractFailureSpec> = Record<
		string,
		ContractFailureSpec
	>,
> {
	success?: TSuccess;
	errors?: TFailure;
}

export interface ResultContext {
	traceId?: string;
	operation?: ContractProblemOperation;
	source?: ContractProblemSource;
	metadata?: Record<string, unknown>;
}

export interface ContractSuccessOptions<TCode extends string> {
	code?: TCode;
	status?: number;
	state?: ContractResultState;
	message?: string;
	warnings?: ContractProblem[];
	partialProblems?: ContractProblem[];
	traceId?: string;
	headers?: Record<string, string>;
	links?: Record<string, string>;
	pagination?: Record<string, unknown>;
	cache?: Record<string, unknown>;
	idempotency?: Record<string, unknown>;
	source?: ContractProblemSource;
	metadata?: Record<string, unknown>;
}

export interface ContractFailureOptions<
	TCode extends string,
	TArgs extends Record<string, unknown>,
> extends ResultContext {
	code?: TCode;
	status?: number;
	title?: string;
	detail?: string;
	type?: string;
	category?: ContractProblemCategory;
	severity?: ContractProblemSeverity;
	retryable?: boolean;
	retryAfter?: number | Date;
	gqlCode?: string;
	instance?: string;
	args?: TArgs;
	issues?: ContractProblemIssue[];
}

export class ContractSpecError<
	TCode extends string = StandardFailureCode,
	TArgs extends Record<string, unknown> = Record<string, unknown>,
> extends Error {
	readonly problem: ContractProblem<TCode, TArgs>;
	readonly code: TCode;
	readonly status: number;
	readonly retryable: boolean;

	constructor(problem: ContractProblem<TCode, TArgs>) {
		super(problem.detail ?? problem.title);
		this.name = 'ContractSpecError';
		this.problem = problem;
		this.code = problem.code;
		this.status = problem.status;
		this.retryable = problem.retryable;
		Object.setPrototypeOf(this, new.target.prototype);
	}
}

const successSpec = (
	status: number,
	state: ContractResultState,
	description: string
): ContractSuccessSpec => ({ status, state, description });

const failureSpec = (
	status: number,
	category: ContractProblemCategory,
	description: string,
	options: Pick<
		ContractFailureSpec,
		'retryable' | 'severity' | 'title' | 'type'
	> = {}
): ContractFailureSpec => ({
	status,
	category,
	description,
	retryable: options.retryable ?? isStandardRetryableStatus(status),
	severity: options.severity ?? (status >= 500 ? 'error' : 'warning'),
	title: options.title,
	type: options.type,
});

export const STANDARD_SUCCESS_SPECS = {
	OK: successSpec(200, 'completed', 'The operation completed successfully.'),
	CREATED: successSpec(201, 'created', 'The resource was created.'),
	ACCEPTED: successSpec(202, 'accepted', 'The operation was accepted.'),
	NO_CONTENT: successSpec(
		204,
		'empty',
		'The operation completed without a body.'
	),
	PARTIAL: successSpec(206, 'partial', 'The operation partially completed.'),
	MULTI_STATUS: successSpec(
		207,
		'partial',
		'The operation returned multiple statuses.'
	),
	QUEUED: successSpec(
		202,
		'queued',
		'The operation was queued for asynchronous work.'
	),
} as const satisfies Record<StandardSuccessCode, ContractSuccessSpec>;

export const STANDARD_FAILURE_SPECS = {
	BAD_REQUEST: failureSpec(400, 'validation', 'The request is malformed.'),
	UNAUTHENTICATED: failureSpec(401, 'auth', 'Authentication is required.'),
	PAYMENT_REQUIRED: failureSpec(
		402,
		'payment',
		'Payment or billing action is required.'
	),
	FORBIDDEN: failureSpec(
		403,
		'auth',
		'The caller is not allowed to perform this action.'
	),
	NOT_FOUND: failureSpec(
		404,
		'not_found',
		'The requested resource was not found.'
	),
	METHOD_NOT_ALLOWED: failureSpec(
		405,
		'validation',
		'The requested method is not allowed.'
	),
	CONFLICT: failureSpec(
		409,
		'conflict',
		'The request conflicts with current state.'
	),
	GONE: failureSpec(
		410,
		'not_found',
		'The requested resource is no longer available.'
	),
	PRECONDITION_FAILED: failureSpec(
		412,
		'conflict',
		'A required precondition failed.'
	),
	VALIDATION_FAILED: failureSpec(
		422,
		'validation',
		'The request did not pass validation.'
	),
	RATE_LIMITED: failureSpec(
		429,
		'rate_limit',
		'The caller has been rate limited.',
		{
			retryable: true,
		}
	),
	INTERNAL_ERROR: failureSpec(
		500,
		'internal',
		'An unexpected error occurred.',
		{
			severity: 'error',
		}
	),
	NOT_IMPLEMENTED: failureSpec(
		501,
		'internal',
		'This operation is not implemented.',
		{
			severity: 'error',
		}
	),
	BAD_GATEWAY: failureSpec(
		502,
		'dependency',
		'An upstream dependency failed.',
		{
			retryable: true,
		}
	),
	SERVICE_UNAVAILABLE: failureSpec(
		503,
		'dependency',
		'The service is unavailable.',
		{
			retryable: true,
		}
	),
	TIMEOUT: failureSpec(504, 'timeout', 'The operation timed out.', {
		retryable: true,
	}),
} as const satisfies Record<StandardFailureCode, ContractFailureSpec>;

function pickFrom<T extends Record<string, unknown>, K extends keyof T>(
	source: T,
	codes: readonly K[]
): Pick<T, K> {
	const picked = {} as Pick<T, K>;
	for (const code of codes) {
		picked[code] = source[code];
	}
	return picked;
}

export const standardSuccess = {
	...STANDARD_SUCCESS_SPECS,
	pick<const TCodes extends readonly StandardSuccessCode[]>(...codes: TCodes) {
		return pickFrom(STANDARD_SUCCESS_SPECS, codes);
	},
};

export const standardErrors = {
	...STANDARD_FAILURE_SPECS,
	pick<const TCodes extends readonly StandardFailureCode[]>(...codes: TCodes) {
		return pickFrom(STANDARD_FAILURE_SPECS, codes);
	},
};

const STANDARD_SUCCESS_CODE_SET = new Set<string>(
	Object.keys(STANDARD_SUCCESS_SPECS)
);

const STANDARD_FAILURE_CODE_SET = new Set<string>(
	Object.keys(STANDARD_FAILURE_SPECS)
);

export function isStandardSuccessCode(
	code: string
): code is StandardSuccessCode {
	return STANDARD_SUCCESS_CODE_SET.has(code);
}

export function isStandardFailureCode(
	code: string
): code is StandardFailureCode {
	return STANDARD_FAILURE_CODE_SET.has(code);
}

export const success = {
	ok: <_TData = unknown>(options: Partial<ContractSuccessSpec> = {}) =>
		({
			status: options.status ?? 200,
			state: options.state ?? 'completed',
			description:
				options.description ?? 'The operation completed successfully.',
			headers: options.headers,
		}) satisfies ContractSuccessSpec,
	created: <_TData = unknown>(options: Partial<ContractSuccessSpec> = {}) =>
		({
			status: options.status ?? 201,
			state: options.state ?? 'created',
			description: options.description ?? 'The resource was created.',
			headers: options.headers,
		}) satisfies ContractSuccessSpec,
	accepted: <_TData = unknown>(options: Partial<ContractSuccessSpec> = {}) =>
		({
			status: options.status ?? 202,
			state: options.state ?? 'accepted',
			description: options.description ?? 'The operation was accepted.',
			headers: options.headers,
		}) satisfies ContractSuccessSpec,
	queued: <_TData = unknown>(options: Partial<ContractSuccessSpec> = {}) =>
		({
			status: options.status ?? 202,
			state: options.state ?? 'queued',
			description: options.description ?? 'The operation was queued.',
			headers: options.headers,
		}) satisfies ContractSuccessSpec,
	noContent: (options: Partial<ContractSuccessSpec> = {}) =>
		({
			status: options.status ?? 204,
			state: options.state ?? 'empty',
			description:
				options.description ?? 'The operation completed without a body.',
			headers: options.headers,
		}) satisfies ContractSuccessSpec,
	partial: <_TData = unknown>(options: Partial<ContractSuccessSpec> = {}) =>
		({
			status: options.status ?? 206,
			state: options.state ?? 'partial',
			description: options.description ?? 'The operation partially completed.',
			headers: options.headers,
		}) satisfies ContractSuccessSpec,
};

export const failure = {
	badRequest: <TArgs extends Record<string, unknown> = Record<string, unknown>>(
		options: Partial<ContractFailureSpec<TArgs>> = {}
	) =>
		buildFailureSpec(400, 'validation', 'The request is malformed.', options),
	unauthenticated: <
		TArgs extends Record<string, unknown> = Record<string, unknown>,
	>(
		options: Partial<ContractFailureSpec<TArgs>> = {}
	) => buildFailureSpec(401, 'auth', 'Authentication is required.', options),
	paymentRequired: <
		TArgs extends Record<string, unknown> = Record<string, unknown>,
	>(
		options: Partial<ContractFailureSpec<TArgs>> = {}
	) =>
		buildFailureSpec(
			402,
			'payment',
			'Payment or billing action is required.',
			options
		),
	forbidden: <TArgs extends Record<string, unknown> = Record<string, unknown>>(
		options: Partial<ContractFailureSpec<TArgs>> = {}
	) =>
		buildFailureSpec(
			403,
			'auth',
			'The caller is not allowed to perform this action.',
			options
		),
	notFound: <TArgs extends Record<string, unknown> = Record<string, unknown>>(
		options: Partial<ContractFailureSpec<TArgs>> = {}
	) =>
		buildFailureSpec(
			404,
			'not_found',
			'The requested resource was not found.',
			options
		),
	conflict: <TArgs extends Record<string, unknown> = Record<string, unknown>>(
		options: Partial<ContractFailureSpec<TArgs>> = {}
	) =>
		buildFailureSpec(
			409,
			'conflict',
			'The request conflicts with current state.',
			options
		),
	validation: <TArgs extends Record<string, unknown> = Record<string, unknown>>(
		options: Partial<ContractFailureSpec<TArgs>> = {}
	) =>
		buildFailureSpec(
			422,
			'validation',
			'The request did not pass validation.',
			options
		),
	rateLimited: <
		TArgs extends Record<string, unknown> = Record<string, unknown>,
	>(
		options: Partial<ContractFailureSpec<TArgs>> = {}
	) =>
		buildFailureSpec(429, 'rate_limit', 'The caller has been rate limited.', {
			retryable: true,
			...options,
		}),
	internal: <TArgs extends Record<string, unknown> = Record<string, unknown>>(
		options: Partial<ContractFailureSpec<TArgs>> = {}
	) =>
		buildFailureSpec(500, 'internal', 'An unexpected error occurred.', {
			severity: 'error',
			...options,
		}),
	timeout: <TArgs extends Record<string, unknown> = Record<string, unknown>>(
		options: Partial<ContractFailureSpec<TArgs>> = {}
	) =>
		buildFailureSpec(504, 'timeout', 'The operation timed out.', {
			retryable: true,
			...options,
		}),
};

function buildFailureSpec<
	TArgs extends Record<string, unknown> = Record<string, unknown>,
>(
	status: number,
	category: ContractProblemCategory,
	description: string,
	options: Partial<ContractFailureSpec<TArgs>>
): ContractFailureSpec<TArgs> {
	return {
		status: options.status ?? options.http ?? status,
		http: options.http,
		category: options.category ?? category,
		description: options.description ?? description,
		title: options.title,
		type: options.type,
		severity: options.severity ?? (status >= 500 ? 'error' : 'warning'),
		retryable: options.retryable ?? isStandardRetryableStatus(status),
		retryAfter: options.retryAfter,
		gqlCode: options.gqlCode,
		when: options.when,
		args: options.args,
	};
}

export function defineResultCatalog<
	TSuccess extends Record<string, ContractSuccessSpec>,
	TFailure extends Record<string, ContractFailureSpec>,
>(
	catalog: ResultCatalog<TSuccess, TFailure>
): ResultCatalog<TSuccess, TFailure> {
	return catalog;
}

export function contractOk<TData, TCode extends string = 'OK'>(
	data: TData,
	options: ContractSuccessOptions<TCode> = {}
): ContractSuccess<TData, TCode> {
	return {
		ok: true,
		code: options.code ?? ('OK' as TCode),
		status: options.status ?? 200,
		data,
		state: options.state ?? 'completed',
		message: options.message,
		warnings: options.warnings,
		partialProblems: options.partialProblems,
		traceId: options.traceId,
		headers: options.headers,
		links: options.links,
		pagination: options.pagination,
		cache: options.cache,
		idempotency: options.idempotency,
		source: options.source,
		metadata: options.metadata,
	};
}

export function contractCreated<TData, TCode extends string = 'CREATED'>(
	data: TData,
	options: Omit<ContractSuccessOptions<TCode>, 'state' | 'status'> & {
		status?: number;
	} = {}
): ContractSuccess<TData, TCode> {
	return contractOk(data, {
		...options,
		code: options.code ?? ('CREATED' as TCode),
		status: options.status ?? 201,
		state: 'created',
	});
}

export function contractAccepted<TData, TCode extends string = 'ACCEPTED'>(
	data: TData,
	options: Omit<ContractSuccessOptions<TCode>, 'state' | 'status'> & {
		status?: number;
	} = {}
): ContractSuccess<TData, TCode> {
	return contractOk(data, {
		...options,
		code: options.code ?? ('ACCEPTED' as TCode),
		status: options.status ?? 202,
		state: 'accepted',
	});
}

export function contractQueued<TData, TCode extends string = 'QUEUED'>(
	data: TData,
	options: Omit<ContractSuccessOptions<TCode>, 'state' | 'status'> & {
		status?: number;
	} = {}
): ContractSuccess<TData, TCode> {
	return contractOk(data, {
		...options,
		code: options.code ?? ('QUEUED' as TCode),
		status: options.status ?? 202,
		state: 'queued',
	});
}

export function contractNoContent<TCode extends string = 'NO_CONTENT'>(
	options: Omit<ContractSuccessOptions<TCode>, 'state' | 'status'> & {
		status?: number;
	} = {}
): ContractSuccess<undefined, TCode> {
	return contractOk(undefined, {
		...options,
		code: options.code ?? ('NO_CONTENT' as TCode),
		status: options.status ?? 204,
		state: 'empty',
	});
}

export function contractPartial<TData, TCode extends string = 'PARTIAL'>(
	data: TData,
	options: Omit<ContractSuccessOptions<TCode>, 'state' | 'status'> & {
		status?: number;
		partialProblems?: ContractProblem[];
	} = {}
): ContractSuccess<TData, TCode> {
	return contractOk(data, {
		...options,
		code: options.code ?? ('PARTIAL' as TCode),
		status: options.status ?? 206,
		state: 'partial',
	});
}

export function contractFail<
	TCode extends string = StandardFailureCode,
	TArgs extends Record<string, unknown> = Record<string, unknown>,
>(
	code: TCode,
	args?: TArgs,
	options: Omit<ContractFailureOptions<TCode, TArgs>, 'code' | 'args'> = {}
): ContractFailure<TCode, TArgs> {
	const problem = createProblem(code, {
		...options,
		code,
		args,
	});
	return { ok: false, code, status: problem.status, problem };
}

export function contractValidationFail(
	issues: ContractProblemIssue[],
	options: Omit<
		ContractFailureOptions<'VALIDATION_FAILED', Record<string, unknown>>,
		'code' | 'issues'
	> = {}
): ContractFailure<'VALIDATION_FAILED'> {
	return contractFail('VALIDATION_FAILED', undefined, {
		...options,
		status: options.status ?? 422,
		category: options.category ?? 'validation',
		issues,
	});
}

export function createContractError<
	TCode extends string = StandardFailureCode,
	TArgs extends Record<string, unknown> = Record<string, unknown>,
>(
	code: TCode,
	args?: TArgs,
	options: Omit<ContractFailureOptions<TCode, TArgs>, 'code' | 'args'> = {}
): ContractSpecError<TCode, TArgs> {
	return new ContractSpecError(contractFail(code, args, options).problem);
}

export function isContractProblem(value: unknown): value is ContractProblem {
	return (
		isRecord(value) &&
		typeof value.type === 'string' &&
		typeof value.title === 'string' &&
		typeof value.status === 'number' &&
		typeof value.code === 'string' &&
		typeof value.category === 'string' &&
		typeof value.retryable === 'boolean'
	);
}

export function isContractSuccess(value: unknown): value is ContractSuccess {
	return isRecord(value) && value.ok === true && 'data' in value;
}

export function isContractFailure(value: unknown): value is ContractFailure {
	return (
		isRecord(value) &&
		value.ok === false &&
		typeof value.code === 'string' &&
		isContractProblem(value.problem)
	);
}

export function isContractResult(value: unknown): value is ContractResult {
	return isContractSuccess(value) || isContractFailure(value);
}

export function isContractSpecError(
	value: unknown
): value is ContractSpecError {
	return value instanceof ContractSpecError;
}

export function normalizeContractResult<TData>(
	value: TData | ContractResult<TData>,
	options: ContractSuccessOptions<StandardSuccessCode> = {}
): ContractResult<TData> {
	if (isContractResult(value)) {
		return value as ContractResult<TData>;
	}
	return contractOk(value, options);
}

export function normalizeContractError(
	error: unknown,
	options: ResultContext & {
		defaultCode?: StandardFailureCode;
		status?: number;
		category?: ContractProblemCategory;
		declaredErrors?: Record<string, ContractFailureSpec>;
	} = {}
): ContractFailure<string, Record<string, unknown>> {
	if (isContractFailure(error)) {
		const problem = resolveContractProblem(error.problem, options);
		return {
			...error,
			code: problem.code,
			status: problem.status,
			problem,
		};
	}
	if (isContractSpecError(error)) {
		const problem = resolveContractProblem(error.problem, options);
		return {
			ok: false,
			code: problem.code,
			status: problem.status,
			problem,
		};
	}
	if (isContractProblem(error)) {
		const problem = resolveContractProblem(error, options);
		return {
			ok: false,
			code: problem.code,
			status: problem.status,
			problem,
		};
	}

	const extractedCode = readStringProperty(error, 'code');
	const declared = extractedCode
		? options.declaredErrors?.[extractedCode]
		: undefined;
	const issues = readIssues(error);
	const candidateCode =
		extractedCode ??
		options.defaultCode ??
		(issues ? 'VALIDATION_FAILED' : 'INTERNAL_ERROR');
	const code =
		declared || isStandardFailureCode(candidateCode)
			? (candidateCode as StandardFailureCode)
			: 'INTERNAL_ERROR';
	const message =
		error instanceof Error
			? error.message
			: typeof error === 'string'
				? error
				: undefined;

	return contractFail(code, undefined, {
		status:
			options.status ??
			declared?.status ??
			declared?.http ??
			(issues ? 422 : undefined),
		title: declared?.title,
		detail: message,
		type: declared?.type,
		category:
			options.category ??
			declared?.category ??
			(issues
				? 'validation'
				: categoryForStatus(
						options.status ?? declared?.status ?? declared?.http ?? 500
					)),
		severity: declared?.severity,
		retryable: declared?.retryable,
		retryAfter: declared?.retryAfter,
		gqlCode: declared?.gqlCode,
		traceId: options.traceId,
		operation: options.operation,
		source: options.source,
		metadata: options.metadata,
		issues,
	});
}

function resolveContractProblem<TCode extends string>(
	problem: ContractProblem<TCode, Record<string, unknown>>,
	options: ResultContext & {
		declaredErrors?: Record<string, ContractFailureSpec>;
	}
): ContractProblem<string, Record<string, unknown>> {
	const declared = options.declaredErrors?.[problem.code];
	if (declared) {
		return enrichProblem(mergeDeclaredProblem(problem, declared), options);
	}
	if (isStandardFailureCode(problem.code)) {
		return enrichProblem(problem, options);
	}
	return createProblem('INTERNAL_ERROR', {
		detail: `Undeclared contract failure: ${problem.code}`,
		metadata: {
			...(problem.metadata ?? {}),
			originalCode: problem.code,
			originalStatus: problem.status,
			originalArgs: problem.args,
		},
		traceId: problem.traceId ?? options.traceId,
		operation: problem.operation ?? options.operation,
		source: problem.source ?? options.source,
	});
}

function mergeDeclaredProblem<TCode extends string>(
	problem: ContractProblem<TCode, Record<string, unknown>>,
	declared: ContractFailureSpec
): ContractProblem<TCode, Record<string, unknown>> {
	const status = declared.status ?? declared.http ?? problem.status;
	return {
		...problem,
		status,
		type: declared.type ?? problem.type,
		title: declared.title ?? problem.title,
		detail: problem.detail ?? declared.description,
		category: declared.category ?? categoryForStatus(status),
		severity: declared.severity ?? (status >= 500 ? 'error' : 'warning'),
		retryable: declared.retryable ?? isStandardRetryableStatus(status),
		retryAfter: problem.retryAfter ?? declared.retryAfter,
		gqlCode: declared.gqlCode ?? problem.gqlCode,
	};
}

function enrichProblem<TCode extends string>(
	problem: ContractProblem<TCode, Record<string, unknown>>,
	options: ResultContext
): ContractProblem<TCode, Record<string, unknown>> {
	return {
		...problem,
		traceId: problem.traceId ?? options.traceId,
		operation: problem.operation ?? options.operation,
		source: problem.source ?? options.source,
		metadata: problem.metadata ?? options.metadata,
	};
}

export function problemToSafeMessage(
	problem: ContractProblem<string, Record<string, unknown>>
): string {
	return problem.detail ?? problem.title;
}

function createProblem<
	TCode extends string,
	TArgs extends Record<string, unknown>,
>(
	code: TCode,
	options: ContractFailureOptions<TCode, TArgs>
): ContractProblem<TCode, TArgs> {
	const status = options.status ?? statusForCode(code);
	const standard = (
		STANDARD_FAILURE_SPECS as Record<string, ContractFailureSpec>
	)[code];
	const category =
		options.category ?? standard?.category ?? categoryForStatus(status);
	const title = options.title ?? standard?.title ?? titleForCode(code);
	return {
		type:
			options.type ??
			standard?.type ??
			`https://contractspec.io/problems/${code.toLowerCase().replace(/_/g, '-')}`,
		title,
		status,
		code,
		detail: options.detail,
		instance: options.instance,
		category,
		severity:
			options.severity ??
			standard?.severity ??
			(status >= 500 ? 'error' : 'warning'),
		retryable:
			options.retryable ??
			standard?.retryable ??
			isStandardRetryableStatus(status),
		retryAfter: options.retryAfter ?? standard?.retryAfter,
		gqlCode: options.gqlCode ?? standard?.gqlCode,
		traceId: options.traceId,
		operation: options.operation,
		source: options.source,
		args: options.args,
		issues: options.issues,
		metadata: options.metadata,
	};
}

function statusForCode(code: string): number {
	return (
		(STANDARD_FAILURE_SPECS as Record<string, ContractFailureSpec>)[code]
			?.status ?? 500
	);
}

function titleForCode(code: string): string {
	return code
		.toLowerCase()
		.split('_')
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join(' ');
}

function categoryForStatus(status: number): ContractProblemCategory {
	if (status === 401) return 'auth';
	if (status === 402) return 'payment';
	if (status === 403) return 'auth';
	if (status === 404 || status === 410) return 'not_found';
	if (status === 409 || status === 412) return 'conflict';
	if (status === 429) return 'rate_limit';
	if (status === 504) return 'timeout';
	if (status >= 400 && status < 500) return 'validation';
	if (status >= 500) return 'internal';
	return 'internal';
}

function isStandardRetryableStatus(status: number): boolean {
	return status === 429 || status === 502 || status === 503 || status === 504;
}

function readStringProperty(value: unknown, key: string): string | undefined {
	if (!isRecord(value)) return undefined;
	const field = value[key];
	return typeof field === 'string' ? field : undefined;
}

function readIssues(value: unknown): ContractProblemIssue[] | undefined {
	if (!isRecord(value) || !Array.isArray(value.issues)) return undefined;
	return value.issues.map((issue) => {
		if (isRecord(issue)) {
			return {
				path: stringifyPath(issue.path),
				code: typeof issue.code === 'string' ? issue.code : undefined,
				message:
					typeof issue.message === 'string'
						? issue.message
						: JSON.stringify(issue),
			};
		}
		return { message: String(issue) };
	});
}

function stringifyPath(path: unknown): string | undefined {
	if (Array.isArray(path)) return path.join('.');
	if (typeof path === 'string') return path;
	return undefined;
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null;
}
