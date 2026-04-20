import type { OperationSpecRegistry } from '@contractspec/lib.contracts-spec/operations/registry';
import type { ContractResult } from '@contractspec/lib.contracts-spec/results';
import type { HandlerCtx } from '@contractspec/lib.contracts-spec/types';
import { createFetchHandler, type RestOptions } from './rest-generic';
import {
	type ContractResultResponseOptions,
	contractResultToNextResponse,
	type NextResponseFactory,
} from './result-response';

export function makeNextAppHandler(
	reg: OperationSpecRegistry,
	ctxFactory: (req: Request) => HandlerCtx,
	options?: RestOptions
) {
	const handler = createFetchHandler(reg, ctxFactory, options);
	return async function requestHandler(req: Request) {
		return handler(req);
	};
}

export function contractResultToNextJson(
	result: ContractResult<unknown, string, string>,
	nextResponse: NextResponseFactory,
	options?: ContractResultResponseOptions
): Response {
	return contractResultToNextResponse(result, nextResponse, options);
}
