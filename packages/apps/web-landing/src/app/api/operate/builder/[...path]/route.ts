import { NextResponse } from 'next/server';

function getBuilderApiBaseUrl(): string | null {
	return (
		process.env.CONTRACTSPEC_API_BASE_URL ??
		process.env.NEXT_PUBLIC_CONTRACTSPEC_API_BASE_URL ??
		null
	);
}

function buildTargetUrl(request: Request, path: string[]): URL | null {
	const apiBaseUrl = getBuilderApiBaseUrl();
	if (!apiBaseUrl) {
		return null;
	}
	const target = new URL(
		`/internal/builder/${path.join('/')}`,
		apiBaseUrl.endsWith('/') ? apiBaseUrl : `${apiBaseUrl}/`
	);
	const incomingUrl = new URL(request.url);
	target.search = incomingUrl.search;
	return target;
}

async function proxyBuilderRequest(
	request: Request,
	params: Promise<{ path: string[] }>
) {
	const { path } = await params;
	if (path.length < 2) {
		return NextResponse.json(
			{ ok: false, error: 'invalid_builder_proxy_path' },
			{ status: 400 }
		);
	}
	const targetUrl = buildTargetUrl(request, path);
	const token = process.env.CONTROL_PLANE_API_TOKEN;
	if (!targetUrl || !token) {
		return NextResponse.json(
			{ ok: false, error: 'builder_proxy_not_configured' },
			{ status: 503 }
		);
	}
	const forwarded = await fetch(targetUrl, {
		method: request.method,
		headers: {
			authorization: `Bearer ${token}`,
			'content-type': request.headers.get('content-type') ?? 'application/json',
		},
		body:
			request.method === 'GET' || request.method === 'HEAD'
				? undefined
				: await request.text(),
		cache: 'no-store',
	});
	return new NextResponse(await forwarded.text(), {
		status: forwarded.status,
		headers: {
			'content-type':
				forwarded.headers.get('content-type') ?? 'application/json',
		},
	});
}

export async function GET(
	request: Request,
	context: { params: Promise<{ path: string[] }> }
) {
	return proxyBuilderRequest(request, context.params);
}

export async function POST(
	request: Request,
	context: { params: Promise<{ path: string[] }> }
) {
	return proxyBuilderRequest(request, context.params);
}
