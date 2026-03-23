const REQUIRED_ACCEPT_TYPES = ['application/json', 'text/event-stream'];

function canNormalizeAcceptHeader(acceptHeader: string | null) {
	return (
		!acceptHeader ||
		acceptHeader.includes('*/*') ||
		acceptHeader.includes('application/*') ||
		REQUIRED_ACCEPT_TYPES.some((value) => acceptHeader.includes(value))
	);
}

export function normalizeMcpRequest(request: Request) {
	if (request.method !== 'POST') return request;

	const acceptHeader = request.headers.get('accept');
	if (!canNormalizeAcceptHeader(acceptHeader)) return request;

	const missingTypes = REQUIRED_ACCEPT_TYPES.filter(
		(value) => !acceptHeader?.includes(value)
	);
	if (missingTypes.length === 0) return request;

	const headers = new Headers(request.headers);
	headers.set(
		'accept',
		[acceptHeader, ...missingTypes].filter(Boolean).join(', ')
	);

	return new Request(request, { headers });
}
