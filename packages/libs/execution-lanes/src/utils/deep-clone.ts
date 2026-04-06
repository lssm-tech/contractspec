export function deepClone<T>(value: T): T {
	if (value instanceof Date) {
		return new Date(value.getTime()) as T;
	}

	if (Array.isArray(value)) {
		return value.map((item) => deepClone(item)) as T;
	}

	if (value && typeof value === 'object') {
		const result: Record<string, unknown> = {};
		for (const [key, entry] of Object.entries(
			value as Record<string, unknown>
		)) {
			result[key] = deepClone(entry);
		}
		return result as T;
	}

	return value;
}
