import { ErrorCode } from './codes';

export interface ContractProblemLike {
	type: string;
	title: string;
	status: number;
	code: string;
	detail?: string;
	category:
		| 'auth'
		| 'conflict'
		| 'internal'
		| 'not_found'
		| 'payment'
		| 'policy'
		| 'rate_limit'
		| 'validation';
	severity: 'error' | 'fatal' | 'info' | 'warning';
	retryable: boolean;
	args?: Record<string, unknown>;
}

/**
 * Generic application error with code and optional details.
 *
 * @deprecated Use ContractSpecError and ContractProblem from
 * `@contractspec/lib.contracts-spec/results`.
 */
export class AppError extends Error {
	constructor(
		public code: ErrorCode,
		message: string,
		public details?: Record<string, unknown>
	) {
		super(message);
		Object.setPrototypeOf(this, new.target.prototype);
		this.name = 'AppError';
	}
}

/** Type guard to detect AppError */
export function isAppError(err: unknown): err is AppError {
	return err instanceof AppError;
}

export function appErrorToProblem(error: AppError): ContractProblemLike {
	const status = statusForAppErrorCode(error.code);
	return {
		type: `https://contractspec.io/problems/${error.code.toLowerCase().replace(/_/g, '-')}`,
		title: titleForCode(error.code),
		status,
		code: error.code,
		detail: error.message,
		category: categoryForStatus(status, error.code),
		severity: status >= 500 ? 'error' : 'warning',
		retryable:
			status === 429 || status === 502 || status === 503 || status === 504,
		args: error.details,
	};
}

function statusForAppErrorCode(code: ErrorCode): number {
	switch (code) {
		case ErrorCode.UNAUTHENTICATED:
			return 401;
		case ErrorCode.FORBIDDEN:
		case ErrorCode.POLICY_DENIED:
			return 403;
		case ErrorCode.NOT_FOUND:
			return 404;
		case ErrorCode.INVALID_INPUT:
			return 400;
		case ErrorCode.CONFLICT:
			return 409;
		case ErrorCode.RATE_LIMITED:
			return 429;
		default:
			return 500;
	}
}

function titleForCode(code: ErrorCode): string {
	return code
		.toLowerCase()
		.split('_')
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join(' ');
}

function categoryForStatus(
	status: number,
	code: ErrorCode
): ContractProblemLike['category'] {
	if (code === ErrorCode.POLICY_DENIED) return 'policy';
	if (status === 401 || status === 403) return 'auth';
	if (status === 402) return 'payment';
	if (status === 404) return 'not_found';
	if (status === 409) return 'conflict';
	if (status === 429) return 'rate_limit';
	if (status >= 400 && status < 500) return 'validation';
	return 'internal';
}
