export function toJson(value: unknown) {
	return JSON.stringify(value, null, 2);
}

export function toNdjson(values: readonly unknown[]) {
	return values.map((value) => JSON.stringify(value)).join('\n');
}

export function parseJson<T>(fileName: string, content: string): T {
	try {
		return JSON.parse(content) as T;
	} catch (error) {
		throw new Error(
			`Invalid JSON in ${fileName}: ${
				error instanceof Error ? error.message : 'unknown parse failure'
			}`
		);
	}
}

export function parseOptionalJson<T>(
	fileName: string,
	content: string | undefined,
	fallback: T
): T {
	if (content === undefined) {
		return fallback;
	}
	return parseJson<T>(fileName, content);
}

export function parseNdjson<T>(fileName: string, content: string): T[] {
	const trimmed = content.trim();
	if (!trimmed) {
		return [];
	}
	return trimmed.split('\n').map((line, index) => {
		try {
			return JSON.parse(line) as T;
		} catch (error) {
			throw new Error(
				`Invalid NDJSON in ${fileName} at line ${index + 1}: ${
					error instanceof Error ? error.message : 'unknown parse failure'
				}`
			);
		}
	});
}

export function parseOptionalNdjson<T>(
	fileName: string,
	content: string | undefined,
	fallback: T[]
): T[] {
	if (content === undefined) {
		return fallback;
	}
	return parseNdjson<T>(fileName, content);
}
