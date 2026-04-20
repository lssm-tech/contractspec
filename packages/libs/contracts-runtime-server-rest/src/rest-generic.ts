import { defaultRestPath } from '@contractspec/lib.contracts-spec/jsonschema';
import type { OperationSpecRegistry } from '@contractspec/lib.contracts-spec/operations/registry';
import {
	contractFail,
	normalizeContractError,
} from '@contractspec/lib.contracts-spec/results';
import type { HandlerCtx } from '@contractspec/lib.contracts-spec/types';
import { contractResultToResponse } from './result-response';

export interface RestOptions {
	basePath?: string;
	cors?:
		| boolean
		| {
				origin?: string | '*';
				methods?: string[];
				headers?: string[];
				credentials?: boolean;
				maxAge?: number;
		  };
	prettyJson?: number | false;
	resultEnvelope?: boolean;
	onError?: (err: unknown) => { status: number; body: unknown };
}

function corsHeaders(opt: NonNullable<RestOptions['cors']>) {
	const h: Record<string, string> = {};
	const origin = typeof opt === 'object' ? (opt.origin ?? '*') : '*';
	h['access-control-allow-origin'] = origin as string;
	h['vary'] = 'Origin';
	if (typeof opt === 'object') {
		if (opt.methods) h['access-control-allow-methods'] = opt.methods.join(', ');
		if (opt.headers) h['access-control-allow-headers'] = opt.headers.join(', ');
		if (opt.credentials) h['access-control-allow-credentials'] = 'true';
		if (typeof opt.maxAge === 'number') {
			h['access-control-max-age'] = String(opt.maxAge);
		}
	} else {
		h['access-control-allow-methods'] = 'GET,POST,OPTIONS';
		h['access-control-allow-headers'] =
			'content-type,x-idempotency-key,x-trace-id';
	}
	return h;
}

function joinPath(a: string | undefined, b: string) {
	const left = (a ?? '').replace(/\/+$/g, '');
	const right = b.replace(/^\/+/g, '');
	return `${left}/${right}`.replace(/\/{2,}/g, '/');
}

export function createFetchHandler(
	reg: OperationSpecRegistry,
	ctxFactory: (req: Request) => HandlerCtx,
	options?: RestOptions
) {
	const opts: Required<Omit<RestOptions, 'onError'>> &
		Pick<RestOptions, 'onError'> = {
		basePath: options?.basePath ?? '',
		cors: options?.cors ?? false,
		prettyJson: options?.prettyJson ?? false,
		resultEnvelope: options?.resultEnvelope ?? false,
		onError: options?.onError,
	};

	interface Route {
		method: 'GET' | 'POST';
		path: string;
		name: string;
		version: string;
	}

	const routes: Route[] = reg.list().map((spec) => ({
		method: (spec.transport?.rest?.method ??
			(spec.meta.kind === 'query' ? 'GET' : 'POST')) as 'GET' | 'POST',
		path: joinPath(
			opts.basePath,
			spec.transport?.rest?.path ??
				defaultRestPath(spec.meta.key, spec.meta.version)
		),
		name: spec.meta.key,
		version: spec.meta.version,
	}));

	const routeTable = new Map<string, Route>();
	for (const r of routes) routeTable.set(`${r.method} ${r.path}`, r);

	const makeJson = (
		status: number,
		data: unknown,
		extraHeaders?: HeadersInit
	) => {
		const body = opts.prettyJson
			? JSON.stringify(data, null, opts.prettyJson)
			: JSON.stringify(data);
		const base: HeadersInit = {
			'content-type': 'application/json; charset=utf-8',
		};
		return new Response(body, {
			status,
			headers: extraHeaders ? { ...base, ...extraHeaders } : base,
		});
	};

	return async function handle(req: Request): Promise<Response> {
		const url = new URL(req.url);
		const key = `${req.method.toUpperCase()} ${url.pathname}`;

		if (opts.cors && req.method.toUpperCase() === 'OPTIONS') {
			const h = corsHeaders(opts.cors === true ? {} : opts.cors);
			return new Response(null, {
				status: 204,
				headers: { ...h, 'content-length': '0' },
			});
		}

		const route = routeTable.get(key);
		if (!route) {
			const headers: HeadersInit = {};
			if (opts.cors)
				Object.assign(
					headers,
					corsHeaders(opts.cors === true ? {} : opts.cors)
				);
			return contractResultToResponse(
				contractFail(
					'NOT_FOUND',
					{ path: url.pathname },
					{
						detail: `No ContractSpec route matched ${url.pathname}.`,
					}
				),
				{
					headers,
					prettyJson: opts.prettyJson,
					envelope: opts.resultEnvelope,
				}
			);
		}

		try {
			let input: unknown = {};
			if (route.method === 'GET') {
				if (url.searchParams.has('input')) {
					const raw = url.searchParams.get('input');
					input = raw ? JSON.parse(raw) : {};
				} else {
					const obj: Record<string, unknown> = {};
					for (const [k, v] of url.searchParams.entries()) obj[k] = v;
					input = obj;
				}
			} else {
				const contentType = req.headers.get('content-type') || '';
				if (contentType.includes('application/json')) {
					input = await req.json();
				} else if (contentType.includes('application/x-www-form-urlencoded')) {
					const form = (await req.formData()) as never as FormData;
					input = Object.fromEntries(form.entries());
				} else if (!contentType) {
					input = {};
				} else {
					return contractResultToResponse(
						contractFail(
							'BAD_REQUEST',
							{ contentType },
							{
								status: 415,
								title: 'Unsupported Media Type',
								detail: `Unsupported content type: ${contentType}`,
							}
						),
						{
							prettyJson: opts.prettyJson,
							envelope: opts.resultEnvelope,
						}
					);
				}
			}

			const ctx = ctxFactory(req);
			const result = await reg.executeResult(
				route.name,
				route.version,
				input,
				ctx
			);

			const headers: HeadersInit = {};
			if (opts.cors)
				Object.assign(
					headers,
					corsHeaders(opts.cors === true ? {} : opts.cors)
				);
			return contractResultToResponse(result, {
				headers,
				prettyJson: opts.prettyJson,
				envelope: opts.resultEnvelope,
			});
		} catch (err: unknown) {
			if (opts.onError) {
				const mapped = opts.onError(err);
				const headers: HeadersInit = {};
				if (opts.cors)
					Object.assign(
						headers,
						corsHeaders(opts.cors === true ? {} : opts.cors)
					);
				return makeJson(mapped.status, mapped.body, headers);
			}
			const headers: HeadersInit = {};
			if (opts.cors)
				Object.assign(
					headers,
					corsHeaders(opts.cors === true ? {} : opts.cors)
				);
			return contractResultToResponse(normalizeContractError(err), {
				headers,
				prettyJson: opts.prettyJson,
				envelope: opts.resultEnvelope,
			});
		}
	};
}
